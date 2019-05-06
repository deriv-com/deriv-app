import React from 'react';

const Tac = () => (
    <div>
        <h2 data-anchor='terms-and-conditions'>{it.L('Terms and Conditions')}</h2>
        <p><i>{it.L('Version 47. Last modified 2018-09-28.')}</i></p>
        <p>{it.L('It is the responsibility of each Client to read and understand this legal notice and the terms and conditions pursuant to which an acquisition of financial contracts via this site is governed.')}</p>

        <h2 data-anchor='interpretation'>A. {it.L('Interpretation')}</h2>
        <p>
            {it.L('Depending on the jurisdiction to which a Client\'s account has been attached in accordance with the account opening procedures of the website and as detailed in the About Us section of the website and the type of products offered, the term "the Company" shall denote either')}&nbsp;
            <span data-show='-eucountry'>{it.L('Binary (C.R.) S.A.,')}&nbsp;</span>
            <span>{it.L('Binary (IOM) Ltd.,')}&nbsp;</span>
            <span>{it.L('Binary (Europe) Ltd., or')}&nbsp;</span>
            <span>{it.L('Binary Investments (Europe) Ltd.')}</span>
        </p>
        <p>{it.L('These Terms and Conditions may be supplemented from time to time by Supplementary Terms and Conditions applicable to a particular Company or products.')}</p>

        <h2 data-anchor='introduction'>B. {it.L('Introduction')}</h2>
        <p>{it.L('The financial trading services contained within this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the acquisition of financial contracts.')}</p>
        <p>{it.L('International currency or commodity prices are highly volatile and very difficult to predict. Due to such volatility, plus the bias in the pricing system favouring the website (as described in more detail below), no financial contract purchased in our system (whether or not the payout exceeds the premium amount) can be considered a safe contract.')}</p>
        <p>{it.L('The maximum loss that may be incurred by any Client is the amount of money paid by oneself to the Company.')}</p>
        <p>{it.L('The Company reserves the right in its sole discretion to refuse and/or cancel services, charge deposit and/or withdrawal fees to anyone for any reasons including, but not limited to:')}</p>
        <ul className='bullet'>
            <li>{it.L('any instance where the Company believes that person\'s activities at this site may be illegal in that person\'s country or state;')}</li>
            <li>{it.L('any instance where the Company may be approached or contacted by legal authorities or regulators from that person\'s country or state;')}</li>
            <li>{it.L('any instance where the Company may suffer any pecuniary, fiscal or regulatory disadvantage by virtue of that person\'s activities at this site;')}</li>
            <li>{it.L('any restriction to its Clients from purchasing any contracts during certain hours.')}</li>
        </ul>

        <h2 data-anchor='languages'>C. {it.L('Languages')}</h2>
        <p>{it.L('These Terms and Conditions, for the convenience of our Clients are provided in several different languages; however, these translations do reflect the same principles. We attempt, as much as possible to provide a faithful translation in English of the prevailing language. In the event of any differences between the English version of the website and any other language, the English version shall prevail.')}</p>
        <p>{it.L('You may communicate with us through this website by means of e-mail, phone or, exceptionally, by post. Details can be found in the Contact Us page.')}</p>
        <p>{it.L('Generally we will communicate with you through this website or by email to the email address used when opening your account. We will communicate with you in English or, if you select another preferred language when opening your account, in that language.')}</p>

        <h2 data-anchor='governing-laws-and-jurisdiction'>D. {it.L('Governing Laws and Jurisdiction')}</h2>
        <p>{it.L('Laws regarding financial contracts vary throughout the world, and it is the responsibility of clients accessing this site to ensure that they understand and fully comply with any laws or regulations relevant to themselves in their own country. This site does not constitute, and may not be used for the purposes of, an offer or solicitation to anyone in any jurisdiction in which such offer or solicitation is not authorised or to any person to whom it is unlawful to make such offer or solicitation. Access to this site and the offering of financial contracts via this site in certain jurisdictions may be restricted and, accordingly, clients accessing this site are required to inform themselves about and to observe such restrictions.')}</p>
        <p>{it.L('The transactions performed on this site and the relationship between Clients and the Company are to be governed by and construed in accordance with the laws of the country of incorporation of the Company (the "Jurisdiction"). You agree that the Jurisdiction\'s courts will have sole jurisdiction to settle any disputes that may arise in relation thereto. For such purposes, you irrevocably submit to the jurisdiction of the courts of the Jurisdiction in relation to any such dispute and you agree that any claim you might have against the Company shall only be brought before the courts of the Jurisdiction. For further information on complaints and disputes, kindly refer to the Company\'s [_1]Complaints and Disputes[_2] section.', `<a href=${it.url_for('terms-and-conditions#complaints')}>`, '</a>')}</p>
        <p>{it.L('For Binary Investments (Europe) Ltd and Binary (Europe) Ltd, the applicable Jurisdiction shall be Malta.')}</p>
        <p>{it.L('For Binary (IOM) Ltd, the applicable Jurisdiction shall be the Isle of Man.')}</p>
        <p data-show='-eucountry'>{it.L('For Binary (C.R.) S.A., the applicable Jurisdiction shall be Costa Rica.')}</p>

        <h2 data-anchor='contracts'>E. {it.L('Contracts')}</h2>
        <p>{it.L('The Company does not provide a market amongst or between Clients for investments, securities, derivatives or speculations. Each financial contract purchased by a Client via this site is an individual agreement between that Client and the Company and is not a security, nor is it transferable, negotiable or assignable to or with any third party.')}</p>
        <p>{it.L('Acquisition of financial contracts through this site must be effected in accordance with the terms and conditions presented on the pages of this site. Acquisition of a financial contract is completed when the financial contract has been customised, the premium (or the payout, as the case may be) has been calculated and payment has been verified.')}</p>

        <h2 data-anchor='clients-liability'>F. {it.L('Client\'s Liability')}</h2>
        <p>{it.L('Clients agree to be fully and personally liable for the due settlement of every transaction entered into under their account with the Company. This includes any transactions entered into by members of the Client\'s family or entourage who have gained access to the account. Clients are responsible for ensuring that they alone control access to the account, and that no minors are granted access to trading on the website. In any case, Clients remain fully liable for any and all positions traded on their account, and for any credit card transactions entered into the site for their account. Each Client also indemnifies the Company in respect to all costs and losses of any kind, whatsoever as may be incurred by the Company as a result, direct or indirect, of the Client\'s failure to perform or settle such a transaction. [_1]In regards to customers of Binary (IOM) Ltd., online gambling debts are enforceable in law in the Isle of Man.[_2]', '<span data-show="eucountry">', '</span>')}</p>

        <h2 data-anchor='customer-funds'>G. {it.L('Customer Funds')}</h2>
        <p>{it.L('Money collected from Clients are not invested in any securities, futures, currencies, derivatives or other investments, on behalf of Clients.')}</p>
        <p data-show='eucountry'>{it.L('We are required by our licence to inform you about what happens to funds which we hold on account for you, and the extent to which funds are protected in the event of insolvency. To learn more, please refer [_1]here[_2].',
            '<a href="http://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('The company holds customer funds in separate bank accounts to the operational accounts; and arrangements have been made to ensure assets in the customer accounts are distributed to customers in the event of insolvency. This meets the Gambling Commission\'s requirements for the segregation of customer funds at the level: medium protection.')}</p>
        <p>{it.L('The company has various deposit methods available, each with their own timing for deposits, some of which might not be available for withdrawals. Full details of deposits and withdrawals methods available including settlement times are available [_1]here[_2].',
            `<a href='${it.url_for('cashier/payment_methods')}'>`, '</a>')}
        </p>
        <p>{it.L('Your account should not be used as a banking facility and deposits should only be made with a view to using funds to place contracts. The Company is not a financial institution, Clients will not receive interest on deposits. Should you make repeated deposits and withdrawals without commensurate contracts being placed, we reserve the right to pass on to your accounts, without prior notice, any bank charges we have incurred before closing the account.')}</p>

        <h2 data-anchor='prohibited-trades'>H. {it.L('Prohibited Trades')}</h2>
        <p>{it.L('The Company reserves the right to refuse to do business with, to discontinue to do business with, and to reverse the transactions of, Clients who engage in any trading activity:')}</p>
        <ul className='bullet'>
            <li>{it.L('that contravenes any laws, regulations, instruments, ordinances or rules that govern the operation of any exchange, financial market, or financial regulatory environment; or')}</li>
            <li>{it.L('with insider knowledge of any financial market or instrument.')}</li>
        </ul>
        <p>{it.L('The Company has the discretion to seek information from Clients to verify compliance with these terms.')}</p>
        <p>{it.L('It is a condition of using the website that:')}</p>
        <ul className='bullet'>
            <li>{it.L('any Client that is employed in the banking and/or finance sector must only conduct trades through the website with the knowledge of his/her employer and in accordance with the employer\'s policies; and that')}</li>
            <li>{it.L('Clients agree to comply with the reasonable requests made by the Company for the purpose of verifying compliance with this term.')}</li>
        </ul>
        <p>{it.L('The Company may withhold payment of funds accumulated in a Client\'s account while it takes steps to verify compliance with these terms.')}</p>
        <p>{it.L('If the Company (in its sole discretion) is not satisfied that a Client is complying with these terms, or if a Client does not comply with a reasonable request for information made by the Company, the Company may cancel the Client\'s account and withhold any funds accumulated therein.')}</p>

        <h2 data-anchor='fraud-and-money-laundering'>I. {it.L('Fraud and Money Laundering')}</h2>
        <p>{it.L('No person shall abuse this site for the purpose of money laundering. The Company employs best-practice anti-money laundering procedures. All transactions are checked to prevent money laundering which may have several effects on Clients. The Company reserves the right to refuse to do business with, to discontinue to do business with, and to reverse the transactions of Clients who do not accept or adhere to these anti-money laundering processes. Acceptable funds should not originate from criminal activity. The Company is bound to report suspicious transactions to relevant authorities.')}</p>
        <p>{it.L('The anti-money laundering processes have the following effects on Clients:')}
            <ul className='bullet'>
                <li>{it.L('Clients must fill into the account opening form all requested details that establish their identity. Clients must give a valid identification, address, and contact email and personal telephone number.')}</li>
                <li>{it.L('Withdrawals may only be paid to the initiator of an account. When a Client maintains an account by means of telegraphic deposits, withdrawals are only paid to the holder of the originating bank account, and it is the onus of the Client to ensure that account number and name accompany all transfers to the Company. When a Client maintains an account by means of credit/debit card deposits, withdrawals are only paid back to the same card.')}</li>
                <li>{it.L('Clients must register personally.')}</li>
                <li>{it.L('Clients shall not hold or pool third party funds into their own account held with the Company.')}</li>
                <li>{it.L('It is prohibited to sell, transfer and/or acquire accounts to/from other clients. Transfer of funds among other clients is also prohibited.')}</li>
                <li>{it.L('Only one account is allowed per person. No withdrawals and/or refunds may be collected on accounts opened in false names or on multiple accounts opened by the same person.')}</li>
                <li>{it.L('The Company may, at its sole discretion or as required by regulations in place conduct appropriate "Know Your Customer" procedures and require a Client to provide proof of identity (such as notarized copy of passport or other means of identity verification as the Company deems required under the circumstances) and suspend an account until satisfactory identification information, evidence of identity and address, source of funds and/or source of wealth have been provided. If you open an account with Binary (Europe) Ltd or Binary (IOM) Ltd, you\'ll need to provide us with age verification documentation when you perform a deposit for the first time. You will also be required to provide KYC documentation to verify your identity for cumulative deposits and/or withdrawals of EUR 2,000.00. If you open an account with Binary Investments (Europe) Ltd, you\'ll need to provide KYC documentation as part of your account opening process.')}</li>
                <li>{it.L('You agree that we may use Personal Information provided by you in order to conduct appropriate anti-fraud checks. Personal Information that you provide may be disclosed to a credit reference or fraud prevention agency, which may keep a record of that information.')}</li>
                <li>{it.L('We record and monitor telephone conversations and/or electronic communications involving transactions when dealing on own account and the provision of client order services that relate to the reception and execution of client orders. Recordings may also be used for quality and anti-fraud purposes.')}</li>
            </ul>
        </p>
        <p>{it.L('We have the right and obligation not to accept the information provided by you if we know or have a reason to believe that it is incorrect, inaccurate or incomplete. In such case, we may ask you to clarify or correct the details provided.')}</p>

        <h2 data-anchor='companys-rights'>J. {it.L('Company\'s Right')}</h2>
        <p>{it.L('The Company reserves the right to suspend the operation of this site or sections thereof:')}
            <ul className='bullet'>
                <li>{it.L('When, as a result of political, economic, military or monetary events (including unusual market volatility or illiquidity) or any circumstances outside the control, responsibility and power of the Company, the continued operation of this site is not reasonably practicable without materially and adversely affecting and prejudicing the interests of Clients or the Company, or if, in the opinion of the Company, a price cannot be calculated for financial contracts.')}</li>
                <li>{it.L('When there is a breakdown in the means of communication normally employed in determining the price or value of any of the financial contracts or where the price or value of any of the financial contracts cannot be promptly or accurately ascertained.')}</li>
                <li>{it.L('In any event of an error in current prices, published odds or trading software.')}</li>
            </ul>
        </p>
        <p>{it.L('The Company has and retains the right, to terminate any event or trade, including but not limited to the occurrence of any of the above events.')}</p>
        <p>{it.L('In all circumstances, the Company reserves the right to make changes to these Terms and Conditions. If the Company elects to make any material changes to these Terms and Conditions, our clients will be notified in advance and shall either accept or decline to agree. Declining to agree shall result in a material breach of this agreement and the client\'s account may be frozen, suspended or cancelled. However, the client shall be allowed to withdraw any pending balance on account subject to KYC verification.')}</p>
        <p>{it.L('In such an event, the Company may at its sole discretion (with or without notice) close out Client\'s open financial contracts at prices it considers fair and reasonable.')}</p>
        <p>{it.L('Further, the Company, under the above circumstances, or any other, reserves the right to adjust a client\'s account should any trade result in a disruption, miscarry or aborted trade.')}</p>
        <p>{it.L('Although the Company has and retains all rights to refuse or to close a Client\'s account, the Company does warrant that all contractual obligations already made, shall be honoured.')}</p>
        <p>{it.L('The Company reserves the right to cancel/reverse transactions or amend the contractual terms (including, but not limited to, entry and exit spot) in the case that any contracts are acquired or sold at prices that do not reflect fair market prices or that are acquired or sold at an abnormally low level of risk due to an undetected programming error, bug or glitch in our website software, market data feed or contract pricing latency, data feed error, stray quotes, incorrect pricing parameters, or manifest mis-calculation of prices or other obvious errors ("Manifest Errors"). Clients have a duty to report to the Company any such problems, errors or suspected system inadequacies that they may experience and may not abuse of or arbitrage such system problems or errors for profit. The Company will endeavor to resolve any such difficulties in the shortest time possible. Any amendments to the contractual terms (including, but not limited to, entry and exit spot) of Manifestly Erroneous contracts shall be reasonable and fair. Monies exchanged between oneself and the Company in connection with Manifestly Erroneous contracts shall be returned to the recipient according to the amendments made to the contractual terms (including, but not limited to, entry and exit spot).')}</p>
        <p>{it.L('Clients with insider knowledge of any financial market or instrument are prohibited from trading at this website.')}</p>
        <p>{it.L('Any information given on these pages and/or emails or newsletters sent by the company related thereto, is not intended as financial or investment advice and the Company will not accept any liability in this respect, nor will the Company accept any responsibility for the accuracy or comprehensiveness of the information provided on this site.')}</p>
        <p>{it.L('The right is also reserved to amend or change the rules and scope of this service from time to time. Any change to the rules made whilst the site is in operation will not apply retrospectively and will only apply to acquisitions of financial contracts made after such change. It is the Company\'s responsibility to notify Clients before any changes to its terms come into effect.')}</p>

        <h2 data-anchor='dormant-and-inactive-accounts'>K. {it.L('Dormant and Inactive Accounts')}</h2>
        <p data-show='-eucountry'>{it.L('The company reserves the right to charge a dormant fee of up to USD/EUR/AUD/GBP 25 or, equivalent of USD25 in any other currency as calculated in accordance with the current exchange rate published by www.xe.com, or any other recognized data provider, as on the date of charging of the fee, every 6 months for every Client account that has had no transaction recorded for over 12 months.')}</p>
        <p data-show='eucountry'>{it.L('The company reserves the right to charge a dormant fee of up to USD/EUR/GBP 25 every 6 months for every Client account that has had no transaction recorded for over 12 months. Clients will be notified before the fee is deducted from the account. Clients need to contact our helpdesk to recover funds from inactive, closed, blocked or excluded accounts.')}</p>
        <h2 data-anchor='liability'>L. {it.L('Liability')}</h2>
        <p>{it.L('Save in case of negligence, fraud, or default by the Company, the Company will not be liable in any way to any clients in the event of force majeure, or for the act of any Government or legal authority, or for the failure of or damage or destruction to its computer systems, data, or records or any part thereof, or for delays, losses, errors, or omissions resulting from the failure or mismanagement of any telecommunications, computer equipment or software by the client or any damages or losses deemed or alleged to have resulted from or been caused by this site or its content.')}</p>

        <h2 data-anchor='marketing-and-promotion'>M. {it.L('Marketing and Promotion')}</h2>
        <p>{it.L('The Company may from time to time inform you about changes on the website, new services and promotions. If you, however, wish to opt out of such a service and do not wish to receive any direct marketing data you can either unsubscribe to the service or email our customer support team. If you decide to opt in again into receiving promotional material, you can also do so by contacting us.')}</p>

        <h2 data-anchor='account-opening'>N. {it.L('Account Opening')}</h2>
        <p>{it.L('You may only open an account at this site on conditions that:')}
            <ul className='bullet'>
                <li>{it.L('you have read this Legal Terms and Conditions page in full and understood that you will be buying and selling financial contracts subject to these terms and conditions;')}</li>
                <li>{it.L('you have read our privacy statement and hereby give us consent to process your personal information as outlined there;')}</li>
                <li>{it.L('you are over 18 years of age, unless you are an Estonian resident whereby you would have to be over 21;')}</li>
                <li>{it.L('you are not resident in a restricted country such as Canada, Costa Rica, Hong Kong, Israel, Jersey, Malaysia, Malta, Paraguay, United Arab Emirates, USA or any other restricted country which has been identified by the FATF as having strategic deficiencies;')}</li>
                <li>{it.L('you have sufficient experience and knowledge in matters of financial trading to be capable of evaluating the merits and risks of acquiring financial contracts via this site and have done so without relying on any information contained in this site.')}</li>
            </ul>
        </p>

        <h2 data-anchor='account-closure'>O. {it.L('Account Closure')}</h2>
        <p>{it.L('You may choose to contact us to close your account held with the Company. Your account may be closed if you do not have any open trade positions and if you have complied with the requested "Know Your Client" procedures to enable you to withdraw any pending funds in your account.')}</p>
    </div>
);

export default Tac;
