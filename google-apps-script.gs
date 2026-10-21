/**
 * Flowbook Lyrics NDA mail receiver — Google Apps Script.
 * Deploy as web app: Execute as Me; access Anyone.
 * Sends a PDF copy to Orbital Trance Records and stores it in a private Drive folder.
 * IMPORTANT: Public endpoints are not tamper-evident and can be abused.
 */
const OWNER_EMAIL = 'orbitaltrancerecords@gmail.com';
const FOLDER_NAME = 'Flowbook NDA Signed Copies';
const NDA_VERSION = '2026-10-21';
const NDA_CLAUSES = [
 ['1. Parties and purpose','This non-disclosure agreement (NDA) is between Daniel Singh, trading as or acting on behalf of Orbital Trance Records (the Owner), and the individual signing below (the Tester). Its purpose is confidential evaluation of the Flowbook Lyrics / MC Flowbook application (App).'],
 ['2. Confidential information','Confidential information includes non-public builds, functionality, designs, roadmaps, source code, test credentials, unreleased images, recordings, documentation, tester communications and information clearly identified as confidential, whether communicated in writing, electronically or verbally.'],
 ['3. Tester obligations','The Tester will use confidential information only to evaluate the App; not disclose it without the Owner\'s written permission; not publicly share screenshots, videos or builds; take reasonable protective care; and promptly report unauthorised access or disclosure. The Tester will not redistribute test copies or reverse-engineer the App, except to the extent permitted by law.'],
 ['4. Exclusions','Obligations do not apply to information lawfully known without restriction beforehand, publicly available without breach, independently developed, or lawfully received from an unrestricted third party. Required legal disclosures, reports to authorities and protected disclosures are permitted. Nothing limits rights that cannot lawfully be waived.'],
 ['5. Ownership and feedback','The App and materials remain their respective owners\' property. The Tester obtains only a limited right to test. The Owner may use optional feedback without payment but does not acquire ownership of the Tester\'s separately created lyrics, recordings or original content.'],
 ['6. Duration and deletion','Confidentiality applies during testing and for two years after the last disclosure. Genuine trade secrets remain protected for as long as they qualify under applicable law. On request, the Tester will stop testing and delete or return confidential test materials, subject to legal retention duties.'],
 ['7. No guarantee and governing law','Pre-release software may contain errors. The parties intend the agreement to bind them, governed by the laws of England and Wales subject to mandatory protections.'],
 ['8. Electronic signatures','Entering a full name, consenting to the terms and drawing a signature indicates the Tester\'s intention to sign electronically. Each party should retain a dated full copy; identity evidence and record-keeping may affect enforceability.']
];
function doGet() {
  return HtmlService.createHtmlOutput('<p>Flowbook NDA receiver ready. Use the Flowbook NDA signing link instead.</p>');
}
function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.website) throw Error('Spam rejected');
    const name = String(p.fullName || '').trim().slice(0,120);
    const email = String(p.email || '').trim().slice(0,180);
    const mode = p.mode === 'test' ? 'TEST' : 'LIVE';
    const agreed = p.agreed === 'yes';
    const sig = String(p.signature || '');
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !agreed || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(sig) || sig.length > 800000) {
      throw Error('Missing or invalid signed agreement fields');
    }
    const id = Utilities.getUuid();
    const signedAt = new Date();
    const filename = 'Flowbook-NDA-' + mode + '-' + signedAt.toISOString().slice(0,10) + '-' + id.slice(0,8);
    const bytes = Utilities.base64Decode(sig.split(',')[1]);
    const image = Utilities.newBlob(bytes, 'image/png', 'signature.png');
    const doc = DocumentApp.create(filename);
    try {
      const b = doc.getBody();
      b.appendParagraph('FLOWBOOK LYRICS — TESTER NON-DISCLOSURE AGREEMENT').setHeading(DocumentApp.ParagraphHeading.HEADING1);
      b.appendParagraph('Owned by Daniel Singh / Orbital Trance Records');
      b.appendParagraph('Agreement version: ' + NDA_VERSION);
      NDA_CLAUSES.forEach(function(item){b.appendParagraph(item[0]).setHeading(DocumentApp.ParagraphHeading.HEADING2);b.appendParagraph(item[1]);});
      b.appendHorizontalRule();
      b.appendParagraph('Electronic signature record').setHeading(DocumentApp.ParagraphHeading.HEADING2);
      b.appendParagraph('Name: ' + name);
      b.appendParagraph('Email: ' + email);
      b.appendParagraph('Signed at (UTC, server): ' + signedAt.toISOString());
      b.appendParagraph('Agreement consent: Yes');
      b.appendParagraph('Status: ' + (mode === 'TEST' ? 'TEST ONLY — not a tester submission' : 'Submitted beta-test agreement'));
      b.appendParagraph('Reference: ' + id);
      b.appendImage(image).setWidth(270);
      b.appendParagraph('This PDF was created from a public web form. The signer\'s identity has not been independently verified; it is not a certified or tamper-evident audit trail.');
      doc.saveAndClose();
      const pdf = DriveApp.getFileById(doc.getId()).getAs(MimeType.PDF).setName(filename + '.pdf');
      let folders = DriveApp.getFoldersByName(FOLDER_NAME);
      let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
      const saved = folder.createFile(pdf);
      MailApp.sendEmail({
        to:OWNER_EMAIL,
        subject:'Flowbook NDA '+mode+' signed — '+name,
        body:'A Flowbook NDA form was submitted.\n\nName: '+name+'\nEmail: '+email+'\nUTC: '+signedAt.toISOString()+'\nReference: '+id+'\nMode: '+mode+'\n\nThe PDF is attached and a copy is saved to your Google Drive folder "'+FOLDER_NAME+'". Verify the identity if required.\n',
        attachments:[saved.getBlob()]
      });
      return HtmlService.createHtmlOutput('<!doctype html><html><body><p>Submission processed. A copy has been emailed to the owner.</p></body></html>');
    } finally {
      DriveApp.getFileById(doc.getId()).setTrashed(true);
    }
  } catch (err) {
    console.error(err);
    return HtmlService.createHtmlOutput('<!doctype html><html><body><p>Submission failed. Please contact the owner and send your downloaded signed copy.</p></body></html>');
  }
}