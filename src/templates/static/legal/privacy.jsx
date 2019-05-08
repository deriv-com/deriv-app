import React from 'react';

const Privacy = () => (
    <div>
        <h2 data-anchor='security-and-privacy'>{it.L('Security and Privacy')}</h2>
        <p>{it.L('We recognise the importance of protecting your personal and financial information.')}</p>
        <p>{it.L('All information we obtain about you assists us in servicing you and your account. We know you may be concerned about what we do with this information.')}</p>
        <p>{it.L('We have outlined for you our privacy practices as follows:')}</p>

        <h2 data-anchor='use-of-information'>{it.L('Use of Information')}</h2>
        <p>{it.L('We operate in full compliance with the General Data Protection Regulation (GDPR) and other applicable Data Protection laws. These regulatory measures place obligations on users of personal data like us. They also lay down the principles for fair and lawful processing of all the information we acquire.')}</p>
        <p>{it.L('It is our commitment to safeguard your privacy online at all times. We only use your personal information to help us service your account, to improve our services to you, and to provide you with products you have requested. We do not sell your personal information to third parties, but we may provide it to payment providers to facilitate transactions on your account.')}</p>
        <p>{it.L('Your personal information is used primarily as a way of validating you as the legitimate account owner and proper recipient of withdrawal payments. We also use this information to process your trades. We collect from you all personal and financial data directly relating to you when you fill in our account opening form. In all instances, you have either a legal or a contractual obligation to provide us with the information. If such information is not provided, we will be unable to provide you with our services.')}</p>
        <p>{it.L('We reserve the right to request further information from you whenever deemed appropriate under the circumstances. For example, we may ask you to send us additional acceptable documents to confirm the authenticity of your account details or of any withdrawal request.')}</p>
        <p>{it.L('We hold all personal data we collect from you with due diligence and only process them for purposes as required or allowed by law. This includes the process of obtaining and sharing of certain information with third parties for credit or identity checks to comply with legal and regulatory obligations. In certain cases, we may process your data to fulfill our contractual obligations with you.')}</p>
        <p>{it.L('We also collect basic tax residence information for the purposes of CRS/FATCA compliance. The tax information you provide may only be disclosed to the authorities legally charged with collecting this information for CRS/FATCA reporting and only to the extent to which [_1] is legally obliged to collect it from and disclose it to. We don\'t use, disclose or process this information in any other way at any time.', it.website_name)}</p>
        <p>{it.L('You may update your personal information at any time by logging in to the "Settings" section of your account. It is your responsibility to ensure that [_1] is promptly and continually informed of any change in your personal information. You should note that if you provide us with inaccurate information, or if you fail to notify us of any changes to information previously supplied by you, this may adversely affect the quality of the services that we can provide.', it.website_name)}</p>

        <h2 data-anchor='profiling-and-categorisation'>{it.L('Profiling and Categorisation')}</h2>
        <p>{it.L('We collect and assess your data to profile you, as our client, in relation to our products. We do this manually through the assistance of automated processing. Through categorisation, we will be able to provide the most appropriate products and services to you.')}</p>

        <h2 data-anchor='cookies-and-device-information'>{it.L('Cookies and Device Information')}</h2>
        <p>{it.L('This website does not collect personally identifying information about you except when you specifically and knowingly provide it. You may use the technology called "cookies" to provide tailored information from a website.')}</p>
        <p>{it.L('A cookie is an element of data that a website can send to your browser, which may then store it on your system. You can set your browser to notify you when you receive a cookie, giving you the option whether to accept or decline it. If you do not accept the cookie, then you will need to input your login ID and password again at every form to log into the system. You are advised to choose this option if you have concerns about the security of your personal browser or PC.')}</p>
        <p>{it.L('Please note that our website generates log files that record the IP addresses of accesses to your account, login attempts, and device information such as the manufacturer, model, operating system, and browser. This information is gathered for the sole purpose of assisting in the unlikely event of a need to investigate access to your account by unauthorised users. Additionally, we may verify certain information you provide us in the account opening form or during the service with third-party information providers.')}</p>
        <p>{it.L('By using or interacting with our website, you are giving permission to the use of the Google Analytics User ID Feature, which allows Google to capture your [_1] login ID such as VRTC1234 and MT1234. When this feature is enabled, no other personally identifiable information other than your [_1] login ID, or other data which can be linked to such information by Google, is shared with or disclosed to Google.', it.website_name)}</p>

        <div data-show='eucountry'>
            <h2 data-anchor='transfer-of-data'>{it.L('Transfer of Data')}</h2>
            <p>{it.L('We may also transfer relevant personal and financial data to any company within the Binary Group of companies. This includes any of our business associates or payment providers within or outside of the EEA, including countries which might not offer an equivalent level of protection of personal data. In all instances, we place a contractual obligation on such third parties to offer the same level of rights and protection as stipulated in the GDPR.')}</p>
            <p>{it.L('You also have the right to request copies of any personal information you provided us and to request us to transmit such information to other service providers.')}</p>

            <h2 data-anchor='consent'>{it.L('Consent')}</h2>
            <p>{it.L('When you open an account with us, we will request your consent for the distribution of marketing materials to the e-mail address you provide us upon sign-up.')}</p>

            <h2 data-anchor='right-of-object'>{it.L('Right to Object')}</h2>
            <p>{it.L('You have the right to object to the direct distribution of marketing materials. This can be done by either not providing your consent to any marketing material before the service is rendered or revoking it at any point during the service. In any case, we will refrain from distributing marketing materials to you.')}</p>

            <h2 data-anchor='access-to-personal-data'>{it.L('Access to Personal Data')}</h2>
            <p>{it.L('Access to your personal data is strictly prohibited with the exception of key [_1] personnel and only as needed in the performance of their duties.', it.website_name)}</p>
            <p>{it.L('If [_1] is legally required to disclose your personal or financial information by law, regulation, or pursuant to the order of a court of competent jurisdiction or a governmental agency, we will promptly notify you to give you the opportunity to seek protection for the information as it deems appropriate. We will do so unless legally prohibited. Such required disclosure shall not be interpreted as a breach of this Terms and Conditions Agreement.', it.website_name)}</p>
            <p>{it.L('You also have the right to request us to copy, modify, or remove your personal information as long as such actions do not breach any legal or regulatory obligations we may have.')}</p>
        </div>

        <h2 data-anchor='data-retention'>{it.L('Data Retention')}</h2>
        <p>{it.L('If you choose to close your [_1] account, your data will be kept only for as long as necessary for us to meet our legal and regulatory obligations on data retention. We will delete your data once the applicable retention period expires.', it.website_name)}</p>

        <h2 data-anchor='security-statement'>{it.L('Security Statement')}</h2>
        <p>{it.L('We are committed to making sure your personal data and transactions are secure:')}</p>
        <ol>
            <li>{it.L('Your password and login ID are unique and passwords are hashed so that not even [_1] staff can read them. This is the reason why we cannot retrieve your password and have to issue you with a new one to your email address if you cannot recall it.', it.website_name)}</li>
            <li>{it.L('We maintain customer balances in cash or cash equivalent. We ensure that 100% of each customer\'s balance is available for immediate withdrawal, subject to verification.')}</li>
            <li>{it.L('All credit card details are submitted directly to the Visa/Mastercard network using the latest SSL encryption technology, in accordance with bank policies.')}</li>
            <li>{it.L('Our information security policies are based on industry best practices in access control and business continuity.')}</li>
            <li>{it.L('We use identity verification services and real-time fraud detection measures to help protect you from unauthorised access to your account. We also monitor account activity for signs of unusual activity that might indicate fraud and work with collection and law-enforcement agencies to address fraud issues.')}</li>
            <li>{it.L('You are responsible for keeping your log-in details secure, the security of any linked email address, and the security (password protection, screen locking, etc) of any personal computer or device on which your account is accessible. We shall not be held responsible if there is unauthorised use of the account when we are not at fault.')}</li>
        </ol>
        <br />

        <h2 data-anchor='links'>{it.L('Links')}</h2>
        <p>{it.L('Our website contains links to other websites and may contain banner or icon advertisements related to third-party websites. These websites and their advertisements may submit cookies to your web browser which is beyond our control. We are not responsible for the privacy practices or the content of such websites. We encourage you to read the privacy policies of these websites because their practices may differ from ours.')}</p>

        <h2 data-anchor='notification-of-changes'>{it.L('Notification of Changes')}</h2>
        <p>{it.L('Any changes in our privacy policy or security statement will be posted on this website. For any material changes that directly affect the economic use of your personal information, we will request your prior authorisation in writing before effecting such changes on your account.')}</p>
        <p>{it.L('You also have the right to request us to inform you about the personal data that we process about you and to provide its correction where necessary.')}</p>

        <div data-show='eucountry'>
            <h2 data-anchor='data-protection-officer'>{it.L('Data Protection Officer')}</h2>
            <p>{it.L('Our Data Protection Officer can be contacted at [_1]', 'dpo@binary.com')}</p>
            <p>{it.L('For full contact details of [_1], kindly check our [_2]Contact Us[_3] page.', it.website_name, `<a href=${it.url_for('contact')}>`, '</a>')}</p>

            <h2 data-anchor='complaints'>{it.L('Complaints')}</h2>
            <p>{it.L('For details on submitting a complaint to our Lead Supervisory Authority on our data processing practices, kindly check our [_1]Complaints and Disputes[_2] section.', `<a href=${it.url_for('terms-and-conditions#complaints')}>`, '</a>')}</p>
        </div>
    </div>
);

export default Privacy;
