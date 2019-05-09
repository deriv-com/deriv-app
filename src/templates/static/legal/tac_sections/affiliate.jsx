import React from 'react';
import ListNested from '../../../_common/components/list_nested.jsx';

const Affiliate = () => (
    <div>
        <h2 data-anchor='affiliate-terms-and-conditions'>{it.L('[_1]\'s Affiliate Programme terms and conditions', it.website_name)}</h2>
        <ol className='reset_ol'>
            <ListNested
                header={it.L('This document')}
                items={[
                    { text: it.L('This document (the "Agreement") sets out the terms and conditions between "the Company", which is Binary Services Ltd, and the person who has applied for this programme ("the Affiliate"), in relation to the Affiliate\'s application to setup an affiliate account (and membership of the affiliate programme if the Affiliate\'s application is deemed successful).') },
                    { text: it.L('The Company reserves the right to change any part of this Agreement at any time. The Company will endeavour to ensure that Affiliates are notified when changes have been made to this Agreement, but it is ultimately the Affiliate\'s responsibility to check these terms and conditions regularly. The Affiliate\'s continued participation in the Company\'s Affiliate Programme after the Company has posted the changes will constitute binding acceptance of such changes.') },
                ]}
            />

            <ListNested
                header={it.L('Acceptance')}
                items={[
                    { text: it.L('By indicating acceptance of these terms and conditions and continuing with application to join the Company\'s Affiliate Programme, the Affiliate is agreeing to the terms and conditions set out in this Agreement. If the Affiliate does not agree with the terms and conditions (or is not authorised to do so), the Affiliate should not continue with the application.') },
                    { text: it.L('The Company will, at its sole discretion, determine whether or not the Affiliate\'s application has been successful. The Company\'s decision is final and is not open to appeal.') },
                    { text: it.L('The Company will notify the Affiliate by email if the Affiliate\'s application has been successful.') },
                ]}
            />

            <ListNested
                header={it.L('The Affiliate\'s obligations')}
                items={[
                    { text: it.L('The Affiliate must provide such information to the licensee as they may reasonably require in order to be able to comply with their information reporting and other obligations to the UK Gambling Commission.') },
                    { text: it.L('The Affiliate must comply with the applicable laws, rules, and regulations (including, but not limited to, advertising, data protection, and privacy laws, rules, and regulations) of the jurisdiction(s) in which the Affiliate operates or targets business.') },
                    { text: it.L('The Affiliate must ensure that any historical trading records and performance figures presented to the Affiliate\'s referrals related to trading on the website [_1] are accurate and not misleading.', it.website_name) },
                    { text: it.L('All affiliate activities must be conducted in a professional and proper manner. The Affiliate shall be expected to act with good faith and integrity in relationship with the Affiliate\'s referrals and always act in the best interests of the Affiliate\'s referrals.') },
                    { text: it.L('The Affiliate must avoid the disclosure of any confidential information that may come to the Affiliate\'s knowledge or possession to third parties or external parties.') },
                ]}
            />

            <ListNested
                header={it.L('Restrictions')}
                items={[
                    { text: it.L('The Affiliate shall not encourage the Affiliate\'s referrals to take out any form of loans for the sake of making deposits and/or placing trades.') },
                    { text: it.L('The Affiliate shall not target any of the Affiliate\'s marketing, advertising, and promotional activities to any clients unless they are over 18 years old, or in case of Estonian residents over 21 years old.') },
                    { text: it.L('The Affiliate shall not hold or pool the Affiliate\'s referrals\' funds or third-party funds into the Affiliate\'s own account held with [_1].', it.website_name) },
                    { text: it.L('The Affiliate shall not resort to high-pressure sales tactics or false promises.') },
                    { text: it.L('The Affiliate shall not encourage the Affiliate\'s referrals to make deposits or place any trades where the purpose of that action is (whether in whole or in part) to increase affiliate commissions rather than to benefit the Affiliate\'s referrals\' trading performance and profitability.') },
                    { text: it.L('The Affiliate shall not place trades on the Affiliate\'s referrals\' behalf.') },
                    { text: it.L('The Affiliate shall not purchase or register keywords, search terms, or other identifiers for use in any search engine, portal, sponsored advertising service, or other search or referral service that are identical or similar to any of the Company\'s trademarks or trade names that include the word "[_1]" or any variation thereof.', it.website_name) },
                    { text: it.L('The Affiliate must ensure that the Affiliate does not place digital advertisements on websites providing unauthorised access to copyrighted content.') },
                    { text: it.L('Neither the Affiliate, the Affiliate\'s direct relatives, nor any clients controlled by the Affiliate are eligible to become clients, and the Affiliate shall not be entitled to any share of net revenue or any other remuneration from the Company in relation to such relatives, friends, or controlled clients.') },
                    { text: it.L('The Affiliate shall not develop and implement marketing, advertising, and promotional activities that infringe any applicable laws, rules, regulations, or codes of practice relating to marketing, advertising, and promotional activities applicable under the authority of any regulatory body of the jurisdiction(s) in which the Affiliate operates or targets business.') },
                ]}
            >
                <ul>
                    <li>{it.L('In the event that the Company is aware of an Affiliate who is in breach of any of the above provisions, the Company shall have the right, in addition to any other right or remedy available to it under this Agreement or applicable law, to immediately block the Affiliate\'s access to this programme. The Affiliate hereby irrevocably waives their rights to, and shall indemnify, the Company and any member of the Binary group of companies for, any claims or demands made against the Company or any member of the Binary group of companies, their directors, officers, shareholders, employees or against the [_1] website in respect of such action taken by the Company.', it.website_name)}</li>
                </ul>
            </ListNested>

            <ListNested
                header={it.L('The Company\'s obligations')}
                items={[
                    { text: it.L('The Affiliate and the Company are independent contractors, and nothing in this Agreement will create any partnership, joint venture, agency, franchise, sales representative, or employment relationship between them. The Affiliate will have no authority to make or accept any offers or representations on the Company\'s behalf. The Affiliate will not make any statement, whether on the Affiliate\'s website or otherwise, that would reasonably contradict anything in this paragraph.') },
                    { text: it.L('The Company reserves the right to refuse the Affiliate\'s referrals\' application to open an account (or to close the Affiliate\'s account), as deemed necessary, to comply with any requirements that the Company may periodically establish and/or that may be required under applicable laws, rules, and regulations.') },
                    { text: it.L('The Company will provide advertising collaterals with links containing affiliate IDs which may be modified by the Company from time to time.') },
                    { text: it.L('With regards to tracking the Affiliate\'s referrals accessing [_1] via the links on the Affiliate\'s website or by quoting affiliate IDs during the sign-up process, the Company shall use all reasonable endeavours to ensure that whenever a client is referred to [_1] through these links or affiliate IDs and they subsequently place a contract or otherwise transact with the Company, the relevant client is identified as originating from the Affiliate\'s referral. However, the Company shall not be liable to the Affiliate in any way if the Company is unable to identify a client as originating from the Affiliate\'s referral. Only properly tagged clients can be assigned to the Affiliate. It is the Affiliate\'s responsibility to ensure that all links are properly tagged.', it.website_name) },
                    { text: it.L('The Company shall be entitled to exercise any of its rights or fulfil any of its obligations hereunder (including, but not limited to, its payment obligations) through any member of the Binary group of companies.') },
                    { text: it.L('The Company reserves the right to void, delay, or withhold payment of commission fees to the Affiliate in situations involving a suspected breach of a law or a breach of the terms and conditions of this Agreement.') },
                    { text: it.L('The Company may change the commission structure at any time at its sole and absolute discretion. The Company will endeavour to ensure that Affiliates are notified when changes have been made to the commission structure.') },
                ]}
            />

            <ListNested
                header={it.L('Ownership')}
                items={[
                    { text: it.L('Ownership and content of the [_1] website remains the Company\'s respective properties and shall not be deemed to have been transferred to the Affiliate through any act or omission in respect of this Agreement.', it.website_name) },
                    { text: it.L('Ownership, content, and liability of the Affiliate\'s websites are the sole responsibility of the Affiliate. The Affiliate will be solely responsible for the development, operation, and maintenance of the Affiliate\'s website and for all materials that appear on the Affiliate\'s website. The Affiliate will indemnify and hold the Company harmless from all claims, damages, and expenses (including, without limitation to, attorneys\' fees) relating to the development, operation, maintenance, and contents of the Affiliate\'s website.') },
                    { text: it.L('When the Affiliate\'s referred clients open an account with any member of the Binary group, the Company assumes ownership of the database of names and contact information and any other data of the Affiliate\'s referred clients.') },
                ]}
            />

            <ListNested
                header={it.L('Spam - The Company does not condone Spam')}
                items={[
                    { text: it.L('Any form of Spam will result in the Affiliate\'s account being placed under review and all funds due being withheld pending an investigation into the Affiliate\'s account. The Affiliate needs to be aware that [_1] is liable to incur expenses in dealing with Spam generated mail and these same expenses will be deducted from the Affiliate\'s account. In this instance, the amount determined will be fair and deemed final and acceptable based on good faith, and such amount will be collectable by law and deemed to have been accepted by the Affiliate as fair and reasonable and as agreed to by registration as an affiliate of [_1].', it.website_name) },
                    { text: it.L('Should these expenses not be covered by funds in the Affiliate\'s account, the Company reserves the right to investigate other alternative means for obtaining payment. For example, should the Affiliate\'s account have generated purchasing accounts, the Company will hold payment of commission for these accounts until such a time as the account for damages has been cleared.') },
                ]}
            />

            <ListNested
                header={it.L('Payments')}
                items={[
                    { text: it.L('The Company shall pay the Affiliate the currently published percentage of net revenues (as detailed on the Commission page of the Affiliate\'s account) received during the term of the Agreement. The Affiliate\'s commission payments due shall only be for bona fide client referrals and the Company reserves the right to disregard duplicate accounts or nominee accounts that the Company sees as non-bona fide clients, at its sole discretion.') },
                    { text: it.L('The Company shall provide the Affiliate with statements accessible through an electronic system detailing the revenues generated by clients the Affiliate has referred, if any, which have accrued to the Affiliate over the course of the calendar month. Such statements shall be updated daily. At the end of a calendar month, the Company shall record the Affiliate\'s total share of Net Revenues, if any, during the previous calendar month. In the event that a revenue share in any calendar month is a negative amount, the Company shall be entitled but not obliged to carry forward and set off such negative amount against future revenue shares which would otherwise be payable to the Affiliate. However, the Company shall also be entitled but not obliged to zeroise the negative balance that would otherwise be carried forward.') },
                    { text: it.L('Payment of commission earned for the previous calendar month will be made monthly, on or around the 15th day of each month, and may be credited to any payment method as agreed between the Company and the Affiliate.') },
                    { text: it.L('If an error is made in the calculation of the Affiliate\'s share of the revenue share, the Company reserves the right to correct such calculation at any time, and to reclaim from the Affiliate any overpayment made by the Company to the Affiliate (including, without limitation, by way of reducing future payments earned, revenue to cover any processed chargebacks) before the Affiliate can start earning revenue again. In special cases, the Company reserves the right to exclude revenue sharing on promotional funds deposited into the client\'s account by the Company.') },
                    { text: it.L('Should any client for whom the Affiliate is receiving commissions process a chargeback, the Company reserves the right to deduct the commission portion of the chargeback from the total balance due to the Affiliate for the current month. Should this deduction of the accumulated revenue exceed the Affiliate\'s current amount due, the Affiliate\'s balance will then revert to a negative balance, and the Affiliate will have to earn revenue to cover the chargeback before the Affiliate can start earning revenue again. The Company reserves the right, in special cases, to exclude revenue sharing on promotional funds deposited into the client\'s account by the Company.') },
                    { text: it.L('Commissions will be earned throughout the life of the client, on all transactions the client undertakes with the Company, for as long as the Affiliate remains a member of this affiliate programme. The company reserves the right to cancel the commissions that are not reclaimed after 2 years.') },
                    { text: it.L('The Affiliate is not allowed to rebate any part commission payment onto the Affiliate\'s referrals and should the Company realise that the Affiliate is engaged in such actions; the Affiliate\'s account shall be revoked immediately.') },
                ]}
            />

            <ListNested
                header={it.L('Warranties')}
                items={[
                    { text: it.L('Each party to this Agreement represents and warrants to the other that it has, and will retain throughout the term of this Agreement, all right, title, and authority to enter into this Agreement, to grant to the other party the rights and licences granted in this Agreement, and to perform all of its obligations under this Agreement.') },
                    { text: it.L('The Affiliate represents, warrants, and undertakes that the Affiliate has obtained and shall maintain all necessary licences and consents to operate within any laws, rules, and regulations applicable under the authority of any regulatory body of the jurisdiction(s) in which the Affiliate operates or targets business.') },
                    { text: it.L('The Affiliate represents, warrants, and undertakes that the Affiliate\'s website or promotion shall contain no material that is defamatory, pornographic, unlawful, harmful, threatening, obscene, harassing, or racially, ethnically, or otherwise objectionable or discriminatory, violent, politically sensitive, or otherwise controversial or in breach of any third party rights and shall not link to any such material.') },
                ]}
            />

            <ListNested
                header={it.L('Disclaimer')}
                items={[
                    { text: it.L('The Company makes no claims that the [_1] website will be uninterrupted or provide an error-free service and will not be liable for the consequences of any such errors or interruptions.', it.website_name) },
                    { text: it.L('The Company provides the [_1] website on an "as is" and "as available" basis and gives no warranty that the [_1] website will be free of errors, or that errors will be corrected, or that the Company\'s website is free of any third-party interferences such as hackers or any other harmful components that arise outside of the Company\'s control.', it.website_name) },
                ]}
            />

            <ListNested
                header={it.L('Indemnity and liability')}
                items={[
                    { text: it.L('The Affiliate shall indemnify on demand and hold the Company harmless from and against any and all losses, demands, claims, damages, costs, expenses (including, but not limited to, consequential losses, loss of profit, and reasonable legal costs, if applicable), and liabilities suffered or incurred, directly or indirectly, by the Company in consequence of any breach, non-performance, or non-observance by the Affiliate of any of the Affiliate\'s obligations or warranties under this Agreement.') },
                    { text: it.L('The Company shall not be liable to the Affiliate in contract, or otherwise (including liability for negligence) for any loss, whether direct or indirect, of the Affiliate\'s business, revenue or profits, anticipated savings, or wasted expenditure, corruption, or destruction of data or for any indirect or consequential loss whatsoever when such outcome is the consequence of any breach, non-performance, or non-observance by the Affiliate of any of the Affiliate\'s obligations or warranties under this Agreement.') },
                ]}
            />

            <ListNested
                header={it.L('Termination')}
                items={[
                    { text: it.L('This Agreement may be terminated forthwith by either party on written notice to the other party if the other party is in material breach of the terms of the Agreement and, in the event of a breach capable of being remedied, fails to remedy the breach within 15 days of receipt of notice in writing of such breach.') },
                    { text: it.L('Either party may terminate this Agreement forthwith on written notice if a receiver, examiner, or administrator is appointed of the whole or any part of the other party\'s assets or the other party is struck off the Register of Companies in the jurisdiction where it was incorporated or an order is made or a resolution passed for winding up of the other party (unless such order or resolution is part of a voluntary scheme for the reconstruction or amalgamation of that party as a solvent corporation and the resulting corporation, if a different legal person, undertakes to be bound by this Agreement).') },
                    { text: it.L('Either party may terminate this Agreement on the delivery of one week\'s prior written notice to the other party.') },
                    {
                        header     : it.L('Termination causes'),
                        list_nested: [
                            {
                                header     : it.L('The following are causes for termination:'),
                                list_nested: [
                                    { text: it.L('The Company receives a complaint which could have involved the Alternate Dispute Resolution entity, or the Company believes that the Affiliate is in breach of any laws, rules, and regulations that may be relevant or applicable to the jurisdiction(s) in which the Affiliate operates or targets business.') },
                                    { text: it.L('The information provided during the sign-up process warranted by the Affiliate to be true and correct is determined by the Company to be false or incorrect during the term of this Agreement.') },
                                    { text: it.L('The Affiliate has not obtained and has not maintained all necessary licences and consents to operate within any laws, rules, and regulations applicable under the authority of any regulatory body of the jurisdiction(s) in which the Affiliate operates or targets business.') },
                                    { text: it.L('The Affiliate has placed digital advertisements for the licensed activities on websites providing unauthorised access to copyrighted content.') },
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
                    { text: it.L('No delay, neglect, or forbearance on the part of either party in enforcing any term or condition of this Agreement against the other party shall either be, or be deemed to be, a waiver or in any way prejudice any right of that party under this Agreement.') },
                    { text: it.L('If any provision of this Agreement is held to be void or unenforceable in whole or part, the impugned provision (or part thereof) shall be deemed to be deleted from this Agreement and the remaining provisions (including the remainder of the affected provision) shall continue to be valid and applicable.') },
                    { text: it.L('Any notice given or made under this Agreement to the Company shall be by email to [_1]. The Company shall send the Affiliate any notices given or made under this Agreement to the email address supplied on the Affiliate\'s application form or such other email address as notified by the Affiliate to the Company.', 'affiliates@binary.com') },
                    { text: it.L('Any disputes, controversy, or claims that arise out of or relating to this Agreement against the Company will be referred to, and finally determined by, an arbitration firm selected by the Company. The language to be used in the arbitral proceedings will be English. Judgement upon the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof. The Affiliate is also responsible for any and all costs related to such arbitration.') },
                ]}
            />
        </ol>
    </div>
);

export default Affiliate;
