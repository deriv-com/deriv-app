import React from 'react';

const PaymentAgents = () => (
    <div>
        <h2 data-anchor='payment-agents-terms-and-conditions'>{it.L('Payment Agents Terms and Conditions')}</h2>

        <h2 data-anchor='scope-of-agreement'>A. {it.L('Scope of Agreement')}</h2>
        <ol>
            <li>{it.L('This Agreement is between Binary (C.R) S.A. (hereinafter referred to as "the Company" or "[_1]") and Payment Agent (hereinafter referred to as "the Agent"), both of whom agree to be bound by this Agreement.', it.website_name)}</li>
            <li>{it.L('The Company and Agent (hereinafter referred to as "the Parties") desire to enter into this Agreement whereby the Company will offer to its clients local payment processing services through the Agent within a territory as specified in Section D of this Agreement.')}</li>
        </ol>

        <h2 data-anchor='general'>B. {it.L('General')}</h2>
        <ol>
            <li>{it.L('This Agreement constitutes the entire Agreement between the Parties and no earlier representation or arrangement or agreement written or oral relating to any matter dealt with in this Agreement between the Parties shall have any force or effect before the Commencement Date.')}</li>
            <li>{it.L('This Agreement is supplied to the Agent in English. In the event that there is a difference between the English version and any translated versions of this document, the English version shall prevail. The Company shall not be liable for any loss or damage whatsoever caused by an error, inaccuracy or misspelling and as a result by misunderstanding or misinterpretation of any of the terms or conditions or clauses or provisions of any translated versions of this Agreement.')}</li>
            <li>{it.L('Each Party shall do anything reasonably required by the other Party to give effect to the provisions of this Agreement.')}</li>
            <li>{it.L('If any provision of this Agreement is held to be invalid, void or unenforceable whatsoever by any court or Arbitration or regulatory body or competent authority or any other authority or law whatsoever in any jurisdiction in which the Agent provide its services, the remainder of this Agreement shall remain in full force and effect.')}</li>
        </ol>

        <h2 data-anchor='commencement-date'>C. {it.L('Commencement Date')}</h2>
        <p>{it.L('It is agreed and understood that the Commencement date of this Agreement means the date on which the Agent account is approved by the Company.')}</p>

        <h2 data-anchor='provision-of-services'>D. {it.L('Provision of Services')}</h2>
        <ol>
            <li>{it.L('The Agent may provide its services to clients of the Company who desire to deposit and/or withdraw money using the Agent. The Agent may provide its services to clients who intend to use e-wallet or e-payment methods other than those used by the Company (hereinafter referred to as the "e-payments") or local currencies other than those accepted by the Company (hereinafter referred to as the "local currencies") and local bank wire transfers (hereinafter referred to as the "bank wire transfers").')}</li>
            <li>{it.L('It is agreed that any deposits through the Agent shall be made as follows:  ')}
                <ul className='bullet'>
                    <li>{it.L('The client using e-payments and bank wire transfers may make a deposit to the Agent. The Agent, receiving the deposit, shall thereinafter make a deposit to his [_1] Account (hereinafter referred to as the "[_1] Agent Account").', it.website_name)}</li>
                    <li>{it.L('The sum received in the [_1] Agent Account shall be subsequently transferred by the Agent to the respective [_1] Client\'s Account.', it.website_name)}</li>
                </ul>
            </li>
            <li>{it.L('It is agreed that any withdrawals through the Agent shall be made as follows:')}
                <ul className='bullet'>
                    <li>{it.L('When the client requests a withdrawal from his [_1] Account, such request shall be automatically proceeded and as a result the requested sum shall be transferred from his [_1] Account to the [_1] Agent Account. However, it is noted that where the client reaches its withdrawal limits, a withdrawal request shall not be automatically proceeded before the required authentication process is conducted.', it.website_name)}</li>
                    <li>{it.L('The Agent thereinafter, shall transfer the requested sum to the client. It is noted that these transactions fall out of the scope of this Agreement and as result the Company shall not be liable against the Agent and the client or any other person, under contract or tort law or any other applicable law, for any dispute or potential dispute arising out of or in connection with such transactions.')}</li>
                </ul>
            </li>
            <li>{it.L('The Agent shall not be authorized to offer its services, under this Agreement, to clients who reside in restricted countries outlined in our terms and conditions (as amended from time to time), which are published on our website, [_1]www.binary.com.[_2]', `<a href="${it.url_for('new-account')}">`, '</a>')}</li>
        </ol>

        <h2 data-anchor='agents-obligations'>E. {it.L('Agent\'s Obligations')}</h2>
        <ol>
            <li>{it.L('The Agent shall upon demand provide the Company with all requested information and documentation in regards with its operations and competence including but not limited to its registration, incorporation, memberships, authorisations, knowledge, expertise and experience.')}</li>
            <li>{it.L('The Agent shall further undertake to perform all necessary due diligence measures on its clients and the Company shall be entitiled, at any time, to request from the Agent to provide all information and documentation relating to its clients for the purposes of the Company\'s AML compliance.')}</li>
            <li>{it.L('Where the Agent ceases to be competent, capable, adequate or qualified to effectively perform all its duties and obligations undertaken and agreed, under this Agreement, for any reason including but not limited to lack of knowledge, expertise, experience, skills and time, the Agent shall notify the Company immediately and without any delay notify the Company.')}
                <p>{it.L('In providing its services, the Agent shall:')}</p>
                <ul className='bullet'>
                    <li>{it.L('use its best endeavors and diligence to transfer funds deposited to [_1] Agent Account to its respective [_1] client account;', it.website_name)}</li>
                    <li>{it.L('provide the Company with all and any information whatsoever that it may become aware of that may be harmful, adverse or detrimental to the Company and its reputation;')}</li>
                    <li>{it.L('follow, comply and implement with all business-related directions, policies and procedures of the Company as amended or re-enacted or replaced from time to time;')}</li>
                    <li>{it.L('fairly and accurately describe its services to the clients;')}</li>
                    <li>{it.L('perform its services and other obligations hereunder at its own cost and risk.')}</li>
                </ul>
            </li>
            <li>{it.L('Where the Agent owns, or operates website/s, the Agent shall:')}
                <ul className='bullet'>
                    <li>{it.L('receive the approval of the Company to include any information in relation to the Company; and')}</li>
                    <li>{it.L('include a disclaimer and/or notice that any intellectual property rights including any Trademark or slogan whatsoever belong to the Company and any unauthorised use is strictly prohibited.')}</li>
                </ul>
            </li>
            <li>{it.L('It is agreed that the Company shall not be responsible or liable for any matter arising out of or in relation to the use and operation of any website owned or used by the Agent. It is understood that the Agent shall indemnify the Company for all and any losses that the Company may suffer arising out of, or in relation to the use or operations of any website used or owned by the Agent.')}</li>
            <li>{it.L('It is further agreed and understood that the Agent shall not use any domain name that includes the name [_1] and any derivation or variation of this name able to give the impression that the Company and the Agent are the same Person.', it.website_name)}</li>
            <li>{it.L('The Agent shall not:')}
                <ul className='bullet'>
                    <li>{it.L('represent itself as a representative of the Company or as an authorised Person by the Company in its advertising activities;')}</li>
                    <li>{it.L('use the Company\'s name or Trademark in its advertising activities without a written authorisation to be given by the Company;')}</li>
                    <li>{it.L('misrepresent its services provided to the clients;')}</li>
                    <li>{it.L('engage in misleading or illusory or deceptive conduct; ')}</li>
                    <li>{it.L('engage in misleading or illusory or deceptive advertising or promises;')}</li>
                    <li>{it.L('prepare and publish any material or place any advertisements which refer to the Company and its relationship with the Company without an authorisation to be given by the Company; ')}</li>
                    <li>{it.L('abusively or fraudulently whatsoever use the Application Programme Interface (API) of [_1]', it.website_name)}</li>
                </ul>
            </li>
        </ol>

        <h2 data-anchor='companys-obligations'>F. {it.L('Company\'s Obligations')}</h2>
        <p>{it.L('Where the Company ascertains any mistakes or flaws related to deposits, or withdrawals from or to [_1] Agent Account or [_1] client account, the Company shall, within a reasonable time, take all corrective measures to rectify such mistakes or flaws.', it.website_name)}</p>

        <h2 data-anchor='representations-and-warranties'>G. {it.L('Representations and Warranties')}</h2>
        <ol>
            <li>
                <p>{it.L('It is agreed that on the Commencement Date of this Agreement and on the date of each transaction, the Agent represents and warrants that:')}</p>
                <ul className='bullet'>
                    <li>{it.L('where the Agent is an individual, he has reached the age of 18 years or over and has full capacity to enter into this Agreement;')}</li>
                    <li>{it.L('he has all necessary authority, powers, consents, licences or authorisations and has taken all necessary actions to enable himself to lawfully enter into and perform this Agreement;')}</li>
                    <li>{it.L('this Agreement as well as any and all obligations and/or rights derive from this Agreement are binding and enforceable against him;')}</li>
                    <li>{it.L('the provisions of this Agreement or any Orders and any applicable laws will not be breached or violated;')}</li>
                    <li>{it.L('any information provided or has provided to the Company in relation to the Agent\'s financial position, domicile or other matters is accurate and not misleading.')}</li>
                    <li>{it.L('all measures required to obtain and maintain in full force and effect, all authority and/or powers and/or consents and/or licences and/or authorities to enter into and perform this Agreement;')}</li>
                    <li>{it.L('all reasonable steps are taken to comply with the law or Rules whatsoever applicable to the jurisdiction in which the Agent resides;')}</li>
                    <li>{it.L('upon our request, the Agent provides the Company with any and all information reasonably required to fully satisfy any and all demands or requests or Orders or the requirements whatsoever of any government or any other authority;')}</li>
                </ul>
            </li>
        </ol>

        <h2 data-anchor='antimoney-laundering-policy'>H. {it.L('Anti-Money Laundering Policy')}</h2>
        <ol>
            <li>{it.L('The Agent shall provide any and all information and documentation, required in the context of the due diligence that the Company shall conduct, from time to time. The Company, complying with the law and providing its services under this Agreement, shall be entitled, at any time, to request from the Agent to provide all and any due diligence information and documentation related to itself and any other person connected or associated with it for the purposes of this Agreement.')}</li>
            <li>{it.L('The Agent represents and warrants that it is currently and it will be in compliance with all laws related to Anti-Money Laundering as well as any financial or economic sanction programmes in a jurisdiction in which he operates.')}</li>
            <li>{it.L('Where the Agent omits or fails or refuse whatsoever to provide the Company with evidence of his identity or any other evidence as required by the law in relation to Anti-Money Laundering within a reasonable time, the Company reserve the right to cease to deal with him.')}</li>
        </ol>

        <h2 data-anchor='anti-corruption'>I. {it.L('Anti-Corruption')}</h2>
        <ol>
            <li>{it.L('The Agent undertakes to the Company that it shall comply with, and the service will be performed in accordance with any applicable anti-corruption laws.')}</li>
            <li>{it.L('This obligation encompasses the prohibition of unlawful payments or the granting of any form of unlawful benefits to public officials, business partners, employees, family members or any other partners.')}</li>
            <li>{it.L('The Company shall have the right to suspend or terminate this Agreement with immediete effect, should the Company have reasonable suspicion that the Agent is undertaking any practices that in breach of any applicable anti-corruption laws.')}</li>
        </ol>
        <h2 data-anchor='onboarding-policy'>J. {it.L('On-boarding Policy')}</h2>
        <ol>
            <li>{it.L('The Agent shall submit an application including the following information:')}
                <ul className='bullet'>
                    <li>{it.L('name, email address and contact number;')}</li>
                    <li>{it.L('URL website (where applicable);')}</li>
                    <li>{it.L('a list of payment methods accepted;')}</li>
                    <li>{it.L('the commission to be charged on deposits and withdrawals;')}</li>
                    <li>{it.L('any other information as requested by the Company.')}</li>
                </ul>
            </li>
            <li>{it.L('Information outlined in Paragraph 1 of this Section shall be submitted to <a href="mailto:[_1]">[_1]</a>.', 'affiliates@binary.com')}</li>
            <li>{it.L('The application shall be reviewed and assessed by the Company\'s compliance and marketing departments. It is noted that the Company\'s compliance department following and implementing the Anti-Money Laundering Policy and conducting due diligence in accordance with the law and Regulations shall request and collect all required information and documentation as per Section H.')}</li>
            <li>{it.L('The Company, exercising its absolute discretion, may accept or reject the Agent\'s application. Where the Agent\'s application is accepted, the Company shall include all relevant information including but not limited to name, address, website (if available), email address, telephone number, commission rates and payment methods used by the Agent in the Payment Agent list which is disclosed on the Company\'s website, [_1]www.binary.com[_2].', `<a href="${it.url_for('new-account')}">`, '</a>')}</li>
        </ol>

        <h2 data-anchor='events-of-defaults'>K. {it.L('Events of Default')}</h2>
        <ol>
            <li>{it.L('Each of the following event constitutes an "Event of Default":')}
                <ul className='bullet'>
                    <li>{it.L('In case of Agent\'s death, incapacity or where the Agent becomes of unsound mind;')}</li>
                    <li>{it.L('Where the Agent becomes incapable to pay his debts as they fall due, or is bankrupt or insolvent, as defined under any and all applicable bankruptcy or insolvency law, where the Agent is an individual;')}</li>
                    <li>{it.L('Where the Agent acts in breach of any warranty or representation or promise made under this Agreement, and any information provided to the Company in connection with this Agreement is, or becomes, untrue or misleading;')}</li>
                    <li>{it.L('Where the Agent fails to comply with its obligations or fails to perform any of its duties or other provisions under this Agreement and such failure continues for at least one business day after the receipt of the non-performance notice given by the Company.')}</li>
                    <li>{it.L('Where any procedure is involuntarily initiated against the Agent seeking or proposing liquidation, reorganisation, restructuring, an arrangement or composition, a freeze or moratorium, whatsoever in relation to itself or its debts in accordance with the law.')}</li>
                    <li>{it.L('Where any law-suit, action or other legal or administrative proceedings whatsoever in connection to this Agreement are initiated for any execution, any attachment or garnishment, or distress against the Agent or where an encumbrance takes possession of, the entire or any part of the Agent\'s property, undertakings or assets including tangible and intangible.')}</li>
                    <li>{it.L('Where the Agent is dissolved, or deregistered from any records of a formal register whatsoever. Furthermore, where any procedure is initiated, seeking or intending or proposing the Agent\'s dissolution or deregistration from any records of a formal register. ')}</li>
                    <li>{it.L('Any event capable to have a material adverse effect on the Agent\'s ability to perform any of its duties and obligations in accordance with this Agreement.')}</li>
                </ul>
            </li>
            <li>{it.L('It is agreed and understood that the Company may unilaterally terminate this Agreement if any of the events mentioned in the paragraphs above occurs. ')}</li>
        </ol>

        <h2 data-anchor='indemnification'>L. {it.L('Indemnification')}</h2>
        <ol>
            <li>{it.L('Subject to the law and the terms and conditions of this Agreement, the Company shall not be liable, to the Agent for any matter arising out of or in relation to this Agreement.')}</li>
            <li>{it.L('The Company shall not be responsible or liable to the Client for any fraudulent acts or omissions, negligence, misconduct or wilful default made by the Agent. Likewise, the Company shall not be responsible and/or liable to the Client if any terms and conditions of this Agreement are breached by the Agent.')}</li>
            <li>{it.L('The Agent agrees to indemnify the Company for all and any losses that the Company may suffer arising out of, or in connection with its fraudulent acts or omissions, negligence, misconduct, wilful default and/or breach of this Agreement.')}</li>
            <li>{it.L('The Company shall not be responsible or liable for any advice on financial services provided by the Agent to any Client.')}</li>
            <li>{it.L('The Company shall not perform any supervisory function in regards with any financial services whatsoever provided by the Agent.')}</li>
            <li>{it.L('Subject to the law, neither the Company nor any of its directors, officers, managers, employees, or agents shall be liable to the Agent or Client for any loss, damage or debt whatsoever arising directly or indirectly out of, or in connection with this Agreement. The Agent agrees to indemnify the Company and its directors, officers, managers, employees, or agents from, and against, any and all liabilities, losses, damages, costs, and expenses including all and any legal fees incurred arising out of his failure to comply with any and all of his obligations set forth in this Agreement.')}</li>
        </ol>

        <h2 data-anchor='modification'>M. {it.L('Modification/Amendment')}</h2>
        <p>{it.L('No modification or amendment of any or all clauses or provisions of this Agreement shall be valid unless the clear and unequivocal acceptance of such amendments by both Parties.')}</p>

        <h2 data-anchor='intellectual-property-rights'>N. {it.L('Intellectual Property Rights')}</h2>
        <ol>
            <li>{it.L('The Company is the sole owner of all rights or titles or interests whatsoever in and to all [_1] electronic systems including but not limited to any and all software, e-mail and email management software, including any modifications.', it.website_name)}</li>
            <li>{it.L('It is further noted that the Company shall be the sole owner of all rights or titles or interests whatsoever of data and other information generated or produced and distributed by or through [_1] electronic systems and other electronic systems used by [_1], including any modifications.', it.website_name)}</li>
            <li>{it.L('All [_1] registered or unregistered proprietary rights including but not limited to patents, trademarks, trade secrets, domain names, URL, pricing information or other proprietary rights materials, ideas, concepts, formats, suggestions, developments, arrangements, programs, techniques, methodologies, knowhow, equipment, processes, procedures whatsoever shall solely remain with the Company.', it.website_name)}</li>
        </ol>

        <h2 data-anchor='force-majeure-event'>O. {it.L('Force Majeure Event')}</h2>
        <ol>
            <li>{it.L('No Party shall be deemed liable for a partial or complete failure to meet its obligations, under this Agreement, in case of force majeure events including but not limited to civil war, unrest, insurrection, international intervention, any governmental actions, exchange controls, nationalizations, devaluations, forfeitures, natural disasters, act of God and other inevitable or unforeseeable or unanticipated or unpredicted events, not depending on the will of the Parties.')}</li>
            <li>{it.L('The Party which is not able to meet its obligations, under this Agreement due to force majeure events shall, within 5 business days after such event has occurred, inform, in writing, the other Party. The Party shall be deprived of the right to release from any responsibility, under this Agreement where it fails to duly notify the other Party on time.')}</li>
            <li>{it.L('Force majeure events must be confirmed by an authority and/or government authority of the Party\'s residence.')}</li>
            <li>{it.L('If force majeure events last for more than 30 business days, the Party not suffering force majeure events may terminate this Agreement immediately.')}</li>
        </ol>

        <h2 data-anchor='confidentiality'>P. {it.L('Confidentiality')}</h2>
        <ol>
            <li>{it.L('The Agent shall treat all information related to the Company and the client including but not limited to client\'s identity, financial status, trading or transaction performance, as well as Company\'s business plans, price points, ideas, concepts, formats, suggestions, developments, arrangements, programs, techniques, methodologies, knowhow, equipment, whatsoever as confidential (hereinafter referred to as the "Confidential Information").')}</li>
            <li>{it.L('The Agent shall not produce any copies of any Confidential Information or any content based on the concepts contained within the Confidential Information for personal use or for distribution, without the Company\'s request.')}</li>
            <li>{it.L('It is agreed that Confidential Information shall be considered as confidential even after the termination of the business relationship established under this Agreement or any other agreement or arrangement between the Parties.')}</li>
            <li>{it.L('It is noted that immediately upon termination of the relationship between the Company and the Agent, the Agent shall return to the Company any documents pertaining to the Company\'s business whatsoever which are in the Agent\'s possession.')}</li>
        </ol>

        <h2 data-anchor='choice-of-law-and-venue'>Q. {it.L('Choice of Law and Venue')}</h2>
        <p>{it.L('The parties agree that this Agreement and the relationship between the parties is to be governed by and construed under the laws of Costa Rica. The parties further agree that all disputes shall be resolved exclusively in the courts of Costa Rica (the "Identified Courts"). Each party hereby: (i) submits to the jurisdiction of the Identified Courts for any proceeding; (ii) shall not commence any proceeding except in the Identified Courts; (iii) waives, and shall not plead or make, any objection to the venue of any proceeding in the Identified Courts; (iv) waives, and shall not plead or make, any claim that any proceeding brought in the Identified Courts has been brought in an improper or otherwise inconvenient forum; and (v) waives, and shall not plead or make, any claim that the Identified Courts lack personal jurisdiction over it.')}</p>
        
        <h2 data-anchor='termination'>R. {it.L('Termination')}</h2>
        <p>{it.L('It is agreed and understood that any of the Parties may terminate this Agreement by giving 7 days written notice to the other Party.')}</p>
    </div>
);

export default PaymentAgents;
