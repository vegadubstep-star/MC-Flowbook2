# Free NDA email setup (Google Apps Script)

This adds free, automatic PDF emails to **orbitaltrancerecords@gmail.com** and a private Google Drive folder. The existing NDA page can remain on GitHub Pages. **This is not DocuSign**: there is no independently verified signer identity, verified delivery receipt, or tamper-evident certificate. Do not rely on it for highly sensitive/legal workflows without professional review.

## One-time setup on your phone

1. Sign into **orbitaltrancerecords@gmail.com** in Chrome, then visit **https://script.google.com/home/projects/create**. Turn on **Desktop site** in Chrome if necessary.
2. Delete the starter code from Code.gs. Copy the complete contents of **google-apps-script.gs** in this repository into Code.gs. Save and name it **Flowbook NDA Receiver**.
3. Press **Deploy → New deployment**. Select the gear icon → **Web app**.
4. Choose **Execute as: Me** and **Who has access: Anyone**. Press **Deploy**. Follow Google's permission/authorization prompts for Gmail, Google Docs and Drive. Only grant access to this script if you understand its code.
5. Copy the **Web app URL** ending in **/exec**. Paste it into the blank `const NDA_WEB_APP_URL = '';` line in **nda.html** on GitHub (edit via pencil icon, commit to main). Keep the quotation marks. **Never paste a private API key into GitHub**.
6. Wait for GitHub Pages to publish the update. Open **https://vegadubstep-star.github.io/MC-Flowbook2/nda.html?mode=test**, sign with a fake name and email, and choose **Submit signed copy**. Check **orbitaltrancerecords@gmail.com**, including Spam. A PDF should arrive with "TEST" in the subject; a copy is saved in the private Drive folder **Flowbook NDA Signed Copies**.
7. Once you've received the test email, share the live link: **https://vegadubstep-star.github.io/MC-Flowbook2/nda.html?mode=live**.

## Notes
- The signer should also save their own copy on the page. An iframe-based cross-domain submission may not deliver a reliable success receipt to the browser; **do not treat merely clicking Submit as proof of arrival**. The owner should verify the email/Drive PDF.
- Google Apps Script, MailApp and Google Drive have quotas and rate limits. The public endpoint can be spammed; keep it for a small, trusted tester group. Public forms need more abuse controls for broader use.
- Existing signings **cannot be recovered** from this upgrade. Signers who already signed must send their downloaded copy or sign again.
- The PDF uses fixed clauses in the script. If you revise **nda.html** terms, also revise **NDA_CLAUSES** and **NDA_VERSION** in **google-apps-script.gs**, and redeploy the Apps Script version.
- Signing and submitting is consent to send the supplied name, email and signature to the Owner's Google account for NDA recordkeeping. Keep these records private and delete them when no longer required.
