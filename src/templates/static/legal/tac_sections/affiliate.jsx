import React from 'react';
import ListNested from '../../../_common/components/list_nested.jsx';

const Affiliate = () => (
    <div>
        <h2 data-anchor='affiliate-terms-and-conditions'>{it.L('[_1] Affiliate Programme Terms and Conditions', it.website_name)}</h2>
        <ol className='reset_ol'>
            <ListNested
                header={it.L('This Document')}
                items={[
                    { text: it.L('This document (the "Agreement") sets out the terms and conditions between "the Company" which is Binary Services Ltd, and you (the person who applied for this programme; "you", "your", or "Affiliate"), in relation to your application to setup an affiliate account (and membership of the affiliate programme if your application is deemed successful).') },
                    { text: it.L('The Company reserves the right to change any part of this Agreement at any time. We will endeavor to ensure affiliates are notified when changes have been made to this Agreement, but it is ultimately your responsibility to check these terms and conditions regularly. Your continued participation in our affiliate programme after we have posted the changes will constitute binding acceptance of such changes.') },
                ]}
            />

            <ListNested
                header={it.L('Acceptance')}
                items={[
                    { text: it.L('By indicating your acceptance of these terms and conditions and continuing with your application to join our affiliate programme, you are agreeing to the terms and conditions set out in this Agreement. If you do not agree with the terms and conditions (or are not authorised to do so), you should not continue with your application.') },
                    { text: it.L('The Company will, at its sole discretion, determine whether or not your application has been successful. The Company\'s decision is final and is not open to appeal.') },
                    { text: it.L('The Company will notify you by email if your application has been successful.') },
                ]}
            />

            <ListNested
                header={it.L('The Affiliate\'s Obligations')}
                items={[
                    { text: it.L('Provide such information to the licensee as they may reasonably require in order to enable the licensee to comply with their information reporting and other obligations.') },
                    { text: it.L('Comply with the applicable laws, rules, and regulations (including, but not limited to, advertising, data protection and privacy laws, rules, and regulations) of the jurisdiction(s) in which you operate or target your business.') },
                    { text: it.L('Ensure that any historical trading records and performance figures presented to your referrals related to trading on the website [_1] are accurate and not misleading.', it.website_name) },
                    { text: it.L('All affiliate activities must be conducted in a professional and proper manner. You shall be expected to act with good faith and integrity in your relationships with your referrals, and always act in the best interests of your referrals.') },
                    { text: it.L('You shall avoid disclosure or unauthorized use of any confidential information that may come to your knowledge or possession to third clients or external parties.') },
                ]}
            />

            <ListNested
                header={it.L('Restrictions')}
                items={[
                    { text: it.L('You shall not encourage your referrals to take out any form of loans to be able to make deposits and/or place trades.') },
                    { text: it.L('You shall not target any of your marketing, advertising, and promotional activities to any clients unless they are over 18 years old, or for Estonian residents whereby they have to be over 21 years old.') },
                    { text: it.L('You shall not hold or pool your referrals\' funds or third party funds into your own account held with [_1].',it.website_name) },
                    { text: it.L('You shall not resort to high-pressure sales tactics or false promises.') },
                    { text: it.L('You shall not encourage your referrals to make deposits or place any trades where the purpose of that action is (whether in whole or in part) to increase affiliate commissions rather than to benefit your referrals\' trading performance and profitability.') },
                    { text: it.L('You shall not place trades on your referrals\' behalf.') },
                    { text: it.L('You shall not purchase or register keywords, search terms or other identifiers for use in any search engine, portal, sponsored advertising service or other search or referral service which are identical or similar to any of the Company\'s trademarks or trade names that include the word "[_1]" or any variation thereof.',it.website_name) },
                    { text: it.L('You must ensure that you do not place digital advertisements on websites providing unauthorised access to copyrighted content.') },
                    { text: it.L('Neither you, your direct relatives, or any clients you control are eligible to become clients, and you shall not be entitled to any share of net revenue or any other remuneration from the Company in relation to such relatives, friends, or controlled clients.') },
                    { text: it.L('You shall not develop and implement marketing, advertising, and promotional activities which infringe any applicable laws, rules, regulations, or codes of practice relating to marketing, advertising, and promotional activities applicable under the authority of any regulatory body of the jurisdiction(s) in which you operate or target your business.') },
                ]}
            >
                <ul>
                    <li>{it.L('In the event that the Company is aware of an Affiliate who is in breach of any of the above provisions, the Company shall have the right, in addition to any other right or remedy available to it under this Agreement or applicable law, to immediately block the Affiliate\'s access to this Programme. The Affiliate hereby irrevocably waives its rights to, and shall indemnify the Company and any member of the Binary group of companies for, any claims or demands made against the Company or any member of the Binary group of companies, their directors, officers, shareholders, employees or against the [_1] website in respect of such action taken by the Company.', it.website_name)}</li>
                </ul>
            </ListNested>

            <ListNested
                header={it.L('The Company\'s Obligations')}
                items={[
                    { text: it.L('You and the Company are independent contractors, and nothing in this Agreement will create any partnership, joint venture, agency, franchise, sales representative, or employment relationship between us. You will have no authority to make or accept any offers or representations on our behalf. You will not make any statement, whether on your website or otherwise, that reasonably would contradict anything in this paragraph.') },
                    { text: it.L('We reserve the right to refuse your referrals\' application to open an account (or to close their accounts), as deemed necessary, to comply with any requirements we may periodically establish and/or that may be required under applicable laws, rules, and regulations.') },
                    { text: it.L('The Company will provide advertising collaterals with links containing affiliate IDs which may be modified by us from time to time.') },
                    { text: it.L('With regards to tracking your referrals accessing [_1] via the links on your website or by quoting your affiliate IDs during the sign-up process, the Company shall use all reasonable endeavors to ensure that whenever a client is referred to [_1] through these links or affiliate IDs, and they subsequently place a contract or otherwise transact with the Company, the relevant client is identified as originating from your referral. However, the Company shall not be liable to you in any way if the Company is unable to identify a client as originating from your referral. Only properly tagged clients can be assigned to you. It is your responsibility to ensure that all links are properly tagged.', it.website_name) },
                    { text: it.L('The Company shall be entitled to exercise any of its rights or fulfil any of its obligations hereunder (including, but not limited to, its payment obligations) through any member of the Binary group of companies.') },
                    { text: it.L('The Company reserves the right to void, delay, or withhold payment of commission fees to you in situations including a suspected breach of a law or a breach of the terms and conditions of this Agreement.') },
                    { text: it.L('The Company may change the commission structure at any time at its sole and absolute discretion. We will endeavor to ensure affiliates are notified when changes have been made to the commission structure.') },
                ]}
            />

            <ListNested
                header={it.L('Ownership')}
                items={[
                    { text: it.L('Ownership and content of the [_1] website remains our respective properties and shall not be deemed to have been transferred to you through any act or omission in respect of this Agreement.', it.website_name) },
                    { text: it.L('Ownership, content, and liability of the Affiliate\'s websites are the sole responsibility of the Affiliate. You will be solely responsible for the development, operation, and maintenance of your website and for all materials that appear on your website. You will indemnify and hold us harmless from all claims, damages, and expenses (including, without limitation to, attorneys\' fees) relating to the development, operation, maintenance, and contents of your website.') },
                    { text: it.L('When the Affiliate\'s referred clients open an account with any member of the Binary group, we assume ownership of the database of names and contact information and any other data of the Affiliates\' referred clients.') },
                ]}
            />

            <ListNested
                header={it.L('Spam - We do not condone Spam')}
                items={[
                    { text: it.L('Any form of Spam will result in your account being placed under review and all funds due being withheld pending an investigation into your account. You need to be aware that [_1] is liable to incur expenses in dealing with Spam generated mail and these same expenses will be deducted from your account. In this instance, the amount determined will be fair and deemed final and acceptable based on good faith and such amount will be collectable by law and deemed to have been accepted by yourself as fair and reasonable and as agreed to by registration as an affiliate of [_1].', it.website_name) },
                    { text: it.L('Should these expenses not be covered by funds in your account we reserve the right to investigate other alternative means for obtaining payment, for example: should your account have generated purchasing accounts, we will hold payment of commission for these accounts until such a time as the account for damages has been cleared.') },
                ]}
            />

            <ListNested
                header={it.L('Payments')}
                items={[
                    { text: it.L('The Company shall pay you the currently published percentage of net revenues (as detailed on the commission page of your affiliate account) received during the term of the Agreement. The affiliate commission payments due shall only be for bona fide client referrals and the Company reserves the right to disregard duplicate accounts or nominee accounts that the Company sees as non-bona fide clients, at its sole discretion.') },
                    { text: it.L('The Company shall provide you with statements accessible through an electronic system detailing the revenues generated by clients you have referred, if any, which have accrued to you over the course of the calendar month. Such statements shall be updated daily. At the end of a calendar month, the Company shall record your total share of Net Revenues, if any, during the previous calendar month. In the event that a revenue share in any calendar month is a negative amount, the Company shall be entitled but not obliged to carry forward and set off such negative amount against future revenue shares which would otherwise be payable to you. However, the Company shall also be entitled but not obliged to zeroise the negative balance that would otherwise be carried forward.') },
                    { text: it.L('Payment of commission earned for the previous calendar month will be made monthly, on or around the 15th day of each month, and may be credited to any payment method as agreed between the Company and the Affiliate.') },
                    { text: it.L('If an error is made in the calculation of your share of the revenue share, the Company reserves the right to correct such calculation at any time, and to reclaim from you any overpayment made by the Company to you (including, without limitation, by way of reducing future payments earned, revenue to cover any processed chargebacks) before you can start earning revenue again. In special cases, the Company reserves the right to exclude revenue sharing  on promotional funds deposited into the client\'s account by the Company.') },
                    { text: it.L('Should any client for whom you are receiving commissions process a chargeback, the Company reserves the right to deduct the commission portion of the chargeback from the total balance due to you for the current month. Should this deduction of the accumulated revenue exceed your current amount due, your balance will then revert to a negative balance, and you will have to earn revenue to cover the chargeback before you can start earning revenue again. The Company reserves the right, in special cases, to exclude revenue sharing  on promotional funds deposited into the client\'s account by the Company.') },
                    { text: it.L('Commissions will be earned throughout the life of the client, on all transactions the client undertakes at the merchant, for as long as you, the Affiliate, remain a member of this affiliate programme. The company reserves the right to cancel the commissions that are not reclaimed after 2 years.') },
                    { text: it.L('You are not allowed to rebate any part commission payment onto your referrals and should the company realise you are engaged in such actions; your affiliate account shall be revoked immediately.') },
                ]}
            />

            <ListNested
                header={it.L('Warranties')}
                items={[
                    { text: it.L('Each party to this Agreement represents and warrants to the other that it has, and will retain throughout the term of this Agreement all right, title, and authority to enter into this Agreement, to grant to the other party the rights and licences granted in this Agreement, and to perform all of its obligations under this Agreement.') },
                    { text: it.L('You represent, warrant, and undertake that you have obtained and shall maintain all necessary licences and consents to operate within any laws, rules, and regulations applicable under the authority of any regulatory body of the jurisdiction(s) in which you operate or target your business.') },
                    { text: it.L('You represent, warrant, and undertake that your website or promotion shall contain no material which is defamatory, pornographic, unlawful, harmful, threatening, obscene, harassing, or racially, ethnically, or otherwise objectionable or discriminatory, violent, politically sensitive, or otherwise controversial or in breach of any third party rights and shall not link to any such material.') },
                ]}
            />

            <ListNested
                header={it.L('Disclaimer')}
                items={[
                    { text: it.L('The Company makes no claims that the [_1] website will be uninterrupted or provide an error free service, and will not be liable for the consequences of any such errors or interruptions.', it.website_name) },
                    { text: it.L('The Company provides the [_1] website on an “as is” and “as available” basis, and gives no warranty that the [_1] website will be free of errors, or that errors will be corrected, or that our website is free of any third party interferences such as hackers or any other harmful components that arise outside of the Company\'s control.', it.website_name) },
                ]}
            />

            <ListNested
                header={it.L('Indemnity and Liability')}
                items={[
                    { text: it.L('You shall indemnify on demand and hold the Company harmless from, and against any and all losses, demands, claims, damages, costs, expenses (including, but not limited to, consequential losses, loss of profit, and reasonable legal costs, if applicable), and liabilities suffered or incurred, directly, or indirectly, by the Company in consequence of any breach, non-performance, or non-observance by you of any of your obligations or warranties under this Agreement.') },
                    { text: it.L('The Company shall not be liable to you in contract, or otherwise (including liability for negligence) for any loss, whether direct or indirect, of the Affiliate\'s business, revenue or profits, anticipated savings, or wasted expenditure, corruption, or destruction of data or for any indirect or consequential loss whatsoever when such outcome is the consequence of any breach, non-performance, or non-observance by you of any of your obligations or warranties under this Agreement.') },
                ]}
            />

            <ListNested
                header={it.L('Termination')}
                items={[
                    { text: it.L('This Agreement may be terminated forthwith by either party on written notice to the other party if the other party is in material breach of the terms of the Agreement and, in the event of a breach capable of being remedied, fails to remedy the breach within 15 days of receipt of notice in writing of such breach.') },
                    { text: it.L('Either party may terminate this Agreement forthwith on written notice if a receiver, examiner, or administrator is appointed of the whole or any part of the other party\'s assets or the other party is struck off the Register of Companies in the jurisdiction where it was incorporated or an order is made or a resolution passed for winding up of the other party (unless such order or resolution is part of a voluntary scheme for the reconstruction or amalgamation of that party as a solvent corporation and the resulting corporation, if a different legal person, undertakes to be bound by this Agreement).') },
                    { text: it.L('Either party may terminate this Agreement on delivery of one weeks\' prior written notice to the other party.') },
                    {
                        header     : it.L('Termination for Causes'),
                        list_nested: [
                            {
                                header     : it.L('If:'),
                                list_nested: [
                                    { text: it.L('The Company receives a complaint which could have involved the Alternate Dispute Resolution entity, or the Company believes that you, the Affiliate, is in breach of any laws, rules, and regulations that may be relevant or applicable to the jurisdiction(s) in which you operate or target your business;') },
                                    { text: it.L('The information provided during the sign-up process warranted by yourself to be true and correct is determined by the Company to be false or incorrect during the term of this Agreement;') },
                                    { text: it.L('You have not obtained and have not maintained all necessary licences and consents to operate within any laws, rules, and regulations applicable under the authority of any regulatory body of the jurisdiction(s) in which you operate or target your business;') },
                                    { text: it.L('You have placed digital advertisements for the licensed activities on websites providing unauthorised access to copyrighted content.') },
                                ],
                            },
                        ],
                    },
                    { text: it.L('Termination of this Agreement shall not prejudice any rights of any party which may have arisen on or before the date of termination.') },
                ]}
            />

            <ListNested
                header={it.L('General')}
                items={[
                    { text: it.L('This Agreement contains the entire agreement between the parties with respect to its subject matter and supersedes all previous agreements and understandings between the parties with respect to its subject matter.') },
                    { text: it.L('No delay, neglect, or forbearance on the part of either party in enforcing against the other party any term or condition of this Agreement shall either be or be deemed to be a waiver or in any way prejudice any right of that party under this Agreement.') },
                    { text: it.L('If any provision of this Agreement is held to be void or unenforceable in whole or part, the impugned provision (or part thereof) shall be deemed to be deleted from this Agreement and the remaining provisions (including the remainder of the affected provision) shall continue to be valid and applicable.') },
                    { text: it.L('Any notice given or made under this Agreement to the Company shall be by email to [_1]. The Company shall send you any notices given or made under this Agreement to the email address supplied on your application form or such other email address as notified by you to the Company.','affiliates@binary.com') },
                    { text: it.L('Any disputes, controversy, or claims that arise out of or relating to this Agreement against the Company will be referred to and finally determined by an arbitration firm selected by the Company. The language to be used in the arbitral proceedings will be English. Judgement upon the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof. You are also responsible for any and all costs related to such arbitration.') },
                ]}
            />
        </ol>
    </div>
);

export default Affiliate;
