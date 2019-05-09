import React from 'react';

const PaymentAgents = () => (
    <div>
        <h2 data-anchor='payment-agents-terms-and-conditions'>{it.L('Payment agents terms and conditions')}</h2>

        <h2 data-anchor='scope-of-agreement'>A. {it.L('Scope of agreement')}</h2>
        <ol>
            <li>{it.L('This agreement is between Binary (C.R) S.A. (hereinafter referred to as "the Company" or "[_1]") and Payment Agent (hereinafter referred to as "the Agent"), both of whom agree to be bound by this agreement.', it.website_name)}</li>
            <li>{it.L('The Company and the Agent (hereinafter referred to as "the Parties") desire to enter into this agreement whereby the Company will offer to its clients local payment processing services through the Agent within a territory as specified in Section D of this agreement.')}</li>
        </ol>

        <h2 data-anchor='general'>B. {it.L('General')}</h2>
        <ol>
            <li>{it.L('This agreement constitutes the entire agreement between the Parties and no earlier representation, arrangement, or agreement, whether written or oral, relating to any matter dealt with in this agreement between the Parties, shall have any force or effect before the Commencement Date.')}</li>
            <li>{it.L('This agreement is supplied to the Agent in English. In the event that there is a difference between the English version and any translated versions of this document, the English version shall prevail. The Company shall not be liable for any loss or damage whatsoever caused by an error, inaccuracy, or misspelling and, as a result, by misunderstanding or misinterpretation of any of the terms or conditions or clauses or provisions of any translated versions of this agreement.')}</li>
            <li>{it.L('Each Party shall do anything reasonably required by the other Party to give effect to the provisions of this agreement.')}</li>
            <li>{it.L('If any provision of this agreement is held to be invalid, void, or unenforceable in any way by any court, arbitration, regulatory body, competent authority, or any other authority or law whatsoever in any jurisdiction in which the Agent provides their services, the remainder of this agreement shall remain in full force and effect.')}</li>
        </ol>

        <h2 data-anchor='commencement-date'>C. {it.L('Commencement Date')}</h2>
        <p>{it.L('The Commencement Date of this agreement shall mean the date on which the Agent account is approved by the Company.')}</p>

        <h2 data-anchor='provision-of-services'>D. {it.L('Provision of services')}</h2>
        <ol>
            <li>{it.L('The Agent may provide the Agent\'s services to those clients of the Company who desire to deposit and/or withdraw money using the Agent. The Agent may provide the Agent\'s services to clients who intend to use e-wallet or e-payment methods other than those used by the Company (hereinafter referred to as the "e-payments") or local currencies other than those accepted by the Company (hereinafter referred to as the "local currencies") and local bank wire transfers (hereinafter referred to as the "bank wire transfers").')}</li>
            <li>{it.L('It is agreed that any deposits through the Agent shall be made as follows:')}
                <ul className='bullet'>
                    <li>{it.L('The client using e-payments and bank wire transfers may make a deposit to the Agent. The Agent, receiving the deposit, shall thereinafter make a deposit to the Agent\'s [_1] account (hereinafter referred to as the "[_1] Agent Account").', it.website_name)}</li>
                    <li>{it.L('The sum received in the [_1] Agent Account shall be subsequently transferred by the Agent to the respective client\'s [_1] account (hereinafter referred to as the "[_1] Client Account").', it.website_name)}</li>
                </ul>
            </li>
            <li>{it.L('It is agreed that any withdrawals through the Agent shall be made as follows:')}
                <ul className='bullet'>
                    <li>{it.L('When the client requests a withdrawal from [_1] Client Account, such request shall be automatically proceeded, and, as a result, the requested sum shall be transferred from the [_1] Client Account to the [_1] Agent Account. However, it is noted that when the client reaches the client\'s withdrawal limits, a withdrawal request shall not be automatically proceeded before the required authentication process is conducted.', it.website_name)}</li>
                    <li>{it.L('The Agent shall thereinafter transfer the requested sum to the client. It is noted that these transactions fall out of the scope of this agreement, and, as a result, the Company shall not be liable against the Agent and the client or any other person, under contract, tort law, or any other applicable law, for any dispute or potential dispute arising out of or in connection with such transactions.')}</li>
                </ul>
            </li>
            <li>{it.L('The Agent shall not be authorised to offer the Agent\'s services, under this agreement, to the clients who reside in restricted countries outlined in the Company\'s terms and conditions (as amended from time to time), which are published on the Company\'s website, [_1].', '<a href={it.url_for(\'new-account\')}>www.binary.com</a>')}</li>
        </ol>

        <h2 data-anchor='agents-obligations'>E. {it.L('Agent\'s obligations')}</h2>
        <ol>
            <li>{it.L('Upon demand, the Agent shall provide the Company with all the requested information and documentation regarding their operations and competence, including but not limited to their registration, incorporation, memberships, authorisations, knowledge, expertise, and experience.')}</li>
            <li>{it.L('The Agent shall further undertake to perform all necessary due diligence on the Agent\'s clients, and the Company shall be entitled, at any time, to request the Agent to provide all information and documentation relating to their clients for the purposes of the Company\'s AML compliance. ')}</li>
            <li>{it.L('Where the Agent ceases to be competent, capable, adequate, or qualified to effectively perform all of the Agent\'s duties and obligations that are undertaken and agreed to under this agreement, for any reason, including but not limited to lack of knowledge, expertise, experience, skills, and time, the Agent shall notify the Company immediately and without any delay.')}
                <p>{it.L('In providing the Agent\'s services, the Agent shall do the following:')}</p>
                <ul className='bullet'>
                    <li>{it.L('Use their best endeavours and diligence to transfer funds deposited to [_1] Agent Account to its respective [_1] Client account', it.website_name)}</li>
                    <li>{it.L('Provide the Company with all and any information whatsoever that the Agent may become aware of that may be harmful, adverse, or detrimental to the Company and its reputation')}</li>
                    <li>{it.L('Follow, comply, and implement with all business-related directions, policies, and procedures of the Company as amended or re-enacted or replaced from time to time')}</li>
                    <li>{it.L('Fairly and accurately describe the Agent\'s services to the clients')}</li>
                    <li>{it.L('Perform the Agent\'s services and other obligations hereunder at their own cost and risk')}</li>
                </ul>
            </li>
            <li>{it.L('Where the Agent owns or operates website/s, the Agent shall do the following:')}
                <ul className='bullet'>
                    <li>{it.L('Receive the approval of the Company to include any information in relation to the Company')}</li>
                    <li>{it.L('Include a disclaimer and/or notice that any intellectual property rights, including any trademark or slogan whatsoever, belong to the Company, and any unauthorised use is strictly prohibited')}</li>
                </ul>
            </li>
            <li>{it.L('It is agreed that the Company shall not be responsible or liable for any matter arising out of or in relation to the use and operation of any website owned or used by the Agent. It is understood that the Agent shall indemnify the Company for all and any losses that the Company may suffer arising out of, or in relation to the use or operations of any website used or owned by the Agent.')}</li>
            <li>{it.L('It is further agreed and understood that the Agent shall not use any domain name that includes the name [_1] and any derivation or variation of this name that might give the impression that the Company and the Agent are the same person.', it.website_name)}</li>
            <li>{it.L('The Agent shall not do the following:')}
                <ul className='bullet'>
                    <li>{it.L('Represent themselves as a representative of the Company or as an authorised person by the Company in their advertising activities')}</li>
                    <li>{it.L('Use the Company\'s name or trademark in the Agent\'s advertising activities without a written authorisation to be given by the Company')}</li>
                    <li>{it.L('Misrepresent the services that the Agent provides to the clients')}</li>
                    <li>{it.L('Engage in misleading, illusory, or deceptive conduct')}</li>
                    <li>{it.L('Engage in misleading, illusory, or deceptive advertising or promises')}</li>
                    <li>{it.L('Prepare and publish any material or place any advertisements that refer to the Company and the Agent\'s relationship with the Company without an authorisation being given by the Company')}</li>
                    <li>{it.L('Abusively or fraudulently use, for any purpose, the Application Programme Interface (API) of [_1]', it.website_name)}</li>
                </ul>
            </li>
        </ol>

        <h2 data-anchor='companys-obligations'>F. {it.L('Company\'s obligations')}</h2>
        <p>{it.L('Where the Company ascertains any mistakes or flaws related to deposits or withdrawals from or to [_1] Agent Account or [_1] Client Account, the Company shall, within a reasonable time, take all corrective measures to rectify such mistakes or flaws.', it.website_name)}</p>

        <h2 data-anchor='representations-and-warranties'>G. {it.L('Representations and warranties')}</h2>
        <ol>
            <li>
                <p>{it.L('It is agreed that on the Commencement Date of this agreement and on the date of each transaction, the Agent represents and warrants the following:')}</p>
                <ul className='bullet'>
                    <li>{it.L('Where the Agent is an individual, the Agent has reached the age of 18 years or over and has full capacity to enter into this agreement.')}</li>
                    <li>{it.L('The Agent has all the necessary authority, power, consents, licences, or authorisations and has taken all necessary actions to enable themselves to lawfully enter into and perform this agreement.')}</li>
                    <li>{it.L('This agreement, as well as any and all obligations or rights deriving from this agreement, is binding and enforceable against the Agent.')}</li>
                    <li>{it.L('The provisions of this agreement or any orders and any applicable laws will not be breached or violated.')}</li>
                    <li>{it.L('Any information that the Agent provided or will provide to the Company in relation to the Agent\'s financial position, domicile, or other matters is accurate and not misleading.')}</li>
                    <li>{it.L('The Agent has taken all measures required to obtain and maintain in full force and effect all authority and/or powers and/or consents and/or licences and/or authorities to enter into and perform this agreement.')}</li>
                    <li>{it.L('All reasonable steps are taken to comply with the law or any rules applicable to the jurisdiction in which the Agent resides.')}</li>
                    <li>{it.L('Upon the Company\'s request, the Agent provides the Company with any and all information reasonably required to fully satisfy any and all demands, requests, orders, or requirements of any government or any other authority.')}</li>
                </ul>
            </li>
        </ol>

        <h2 data-anchor='antimoney-laundering-policy'>H. {it.L('Anti-money laundering policy')}</h2>
        <ol>
            <li>{it.L('The Agent shall provide any and all information and documentation required in the context of the due diligence that the Company shall conduct from time to time. The Company, complying with the law and providing its services under this agreement, shall be entitled, at any time, to request the Agent to provide all and any due diligence information and documentation related to the Agent and any other person connected or associated with the Agent for the purposes of this agreement.')}</li>
            <li>{it.L('The Agent represents and warrants that the Agent is and will be in compliance with all laws related to anti-money laundering as well as any financial or economic sanction programmes in the jurisdiction in which the Agent operates.')}</li>
            <li>{it.L('Where the Agent omits, fails, or refuses in any manner to provide the Company with evidence of the Agent\'s identity or any other evidence as required by the law in relation to anti-money laundering within a reasonable time, the Company reserves the right to cease to deal with the Agent.')}</li>
        </ol>

        <h2 data-anchor='anti-corruption'>I. {it.L('Anti-corruption policy')}</h2>
        <ol>
            <li>{it.L('The Agent promises to the Company that the Agent shall comply with, and the Agent\'s services will be performed in accordance with, any applicable anti-corruption laws.')}</li>
            <li>{it.L('This obligation encompasses the prohibition of unlawful payments or the granting of any form of unlawful benefits to public officials, business partners, employees, family members, or any other partners.')}</li>
            <li>{it.L('The Company shall have the right to suspend or terminate this agreement with immediate effect if the Company has reasonable suspicion that the Agent is undertaking any practices that are in breach of any applicable anti-corruption laws.')}</li>
        </ol>
        <h2 data-anchor='onboarding-policy'>J. {it.L('On-boarding policy')}</h2>
        <ol>
            <li>{it.L('The Agent shall submit an application including the following information:')}
                <ul className='bullet'>
                    <li>{it.L('Name, email address, and contact number')}</li>
                    <li>{it.L('Website URL (where applicable)')}</li>
                    <li>{it.L('A list of accepted payment methods')}</li>
                    <li>{it.L('The commissions to be charged on deposits and withdrawals')}</li>
                    <li>{it.L('Any other information as requested by the Company')}</li>
                </ul>
            </li>
            <li>{it.L('The information outlined in Paragraph 1 of this section shall be submitted to <a href="mailto:[_1]">[_1]</a>.', 'affiliates@binary.com')}</li>
            <li>{it.L('The application shall be reviewed and assessed by the Company\'s compliance and marketing departments. It is noted that, following and implementing the anti-money laundering policy and conducting due diligence in accordance with the law and regulations, the Company\'s compliance department shall request and collect all required information and documentation as per Section H.')}</li>
            <li>{it.L('The Company, exercising its absolute discretion, may accept or reject the Agent\'s application. Where the Agent\'s application is accepted, the Company shall include all relevant information, including but not limited to name, address, website URL (if available), email address, telephone number, commission rates, and payment methods used by the Agent, in the payment agent list which is disclosed on the Company\'s website, [_1]www.binary.com[_2].', `<a href="${it.url_for('new-account')}">`, '</a>')}</li>
        </ol>

        <h2 data-anchor='events-of-defaults'>K. {it.L('Events of Default')}</h2>
        <ol>
            <li>{it.L('Each of the following events constitutes an "Event of Default":')}
                <ul className='bullet'>
                    <li>{it.L('In case of the Agent\'s death, incapacity, or mental unsoundness')}</li>
                    <li>{it.L('Where the Agent becomes incapable to pay their debts as they fall due, or is bankrupt or insolvent, as defined under any and all applicable bankruptcy or insolvency law where the Agent is an individual')}</li>
                    <li>{it.L('Where the Agent acts in breach of any warranty, representation, or promise made under this agreement, and any information provided to the Company in connection with this agreement is, or becomes, untrue or misleading')}</li>
                    <li>{it.L('Where the Agent fails to comply with the Agent\'s obligations or fails to perform any of the Agent\'s duties or other provisions under this agreement and such failure continues for at least one business day after the receipt of the non-performance notice given by the Company')}</li>
                    <li>{it.L('Where any proceedings are involuntarily initiated against the Agent by any third parties who seek or propose liquidation, reorganisation, restructuring, an arrangement or composition, or a freeze or moratorium in relation to the Agent or the Agent\'s debts in accordance with the law')}</li>
                    <li>{it.L('Where any law-suit, action, or other legal or administrative proceedings in connection to this agreement are initiated for any execution, attachment or garnishment, or distress against the Agent or where an encumbrance takes possession of the entire or any part of the Agent\'s property, undertakings, or assets, whether tangible and intangible')}</li>
                    <li>{it.L('Where the Agent is dissolved or deregistered from any records of a formal register whatsoever; furthermore, where any procedure is initiated that is seeking, intending, or proposing the Agent\'s dissolution or deregistration from any records of a formal register')}</li>
                    <li>{it.L('Any event capable to have a material adverse effect on the Agent\'s ability to perform any of their duties and obligations in accordance with this agreement')}</li>
                </ul>
            </li>
            <li>{it.L('It is agreed and understood that the Company may unilaterally terminate this agreement if any of the events mentioned in the paragraphs above occurs')}</li>
        </ol>

        <h2 data-anchor='indemnification'>L. {it.L('Indemnification')}</h2>
        <ol>
            <li>{it.L('Subject to the law and the terms and conditions of this agreement, the Company shall not be liable to the Agent for any matter arising out of or in relation to this agreement.')}</li>
            <li>{it.L('The Company shall not be responsible or liable to the client for any fraudulent acts or omissions, negligence, misconduct, or wilful default made by the Agent. Likewise, the Company shall not be responsible or liable to the client if any terms and conditions of this agreement are breached by the Agent.')}</li>
            <li>{it.L('The Agent agrees to indemnify the Company for all and any losses that the Company may suffer arising out of, or in connection with, the Agent\'s fraudulent acts or omissions, negligence, misconduct, wilful default, or breach of this Agreement.')}</li>
            <li>{it.L('The Company shall not be responsible or liable for any advice on financial services provided by the Agent to any client.')}</li>
            <li>{it.L('The Company shall not perform any supervisory function regarding any financial services whatsoever provided by the Agent.')}</li>
            <li>{it.L('Subject to the law, neither the Company nor any of its directors, officers, managers, employees, or agents shall be liable to the Agent or client for any loss, damage, or debt whatsoever arising directly or indirectly out of, or in connection with, this agreement. The Agent agrees to indemnify the Company and its directors, officers, managers, employees, or agents from, and against, any and all liabilities, losses, damages, costs, and expenses, including all and any legal fees incurred arising out of the Agent\'s failure to comply with any and all of the Agent\'s obligations set forth in this agreement.')}</li>
        </ol>

        <h2 data-anchor='modification'>M. {it.L('Modification/amendment')}</h2>
        <p>{it.L('No modification or amendment of any or all clauses or provisions of this agreement shall be valid without the clear and unequivocal acceptance of such amendments by both Parties.')}</p>

        <h2 data-anchor='intellectual-property-rights'>N. {it.L('Intellectual property rights')}</h2>
        <ol>
            <li>{it.L('The Company is the sole owner of all rights, titles, or interests whatsoever in and to all [_1] electronic systems, including but not limited to any and all software, e-mail, and email management software, along with any modifications.', it.website_name)}</li>
            <li>{it.L('It is further noted that the Company shall be the sole owner of all rights, titles, or interests whatsoever of data and other information generated or produced and distributed by or through [_1] electronic systems and other electronic systems used by [_1], along with any modifications.', it.website_name)}</li>
            <li>{it.L('All [_1]\'s registered or unregistered proprietary rights, including but not limited to patents, trademarks, trade secrets, domain names, URL, pricing information or other proprietary rights materials, ideas, concepts, formats, suggestions, developments, arrangements, programmes, techniques, methodologies, knowhow, equipment, processes, procedures whatsoever shall solely remain with the Company.', it.website_name)}</li>
        </ol>

        <h2 data-anchor='force-majeure-event'>O. {it.L('Force majeure events')}</h2>
        <ol>
            <li>{it.L('No Party shall be deemed liable for a partial or complete failure to meet its obligations, under this agreement, in case of force majeure events, including but not limited to civil war, unrest, insurrection, international intervention, any governmental actions, exchange controls, nationalisations, devaluations, forfeitures, natural disasters, act of God, and other inevitable, unforeseeable, unanticipated, or unpredicted events that are not depending on the will of the Parties.')}</li>
            <li>{it.L('The Party that is not able to meet its obligations under this agreement due to force majeure events shall inform the other Party in writing within five business days after such an event has occurred. The Party shall be deprived of the right to be released from any responsibility, under this agreement, where it fails to duly notify the other Party on time.')}</li>
            <li>{it.L('Force majeure events must be confirmed by an authority or government authority of the Party\'s residence.')}</li>
            <li>{it.L('If force majeure events last for more than 30 business days, the Party not suffering force majeure events may terminate this agreement immediately.')}</li>
        </ol>

        <h2 data-anchor='confidentiality'>P. {it.L('Confidentiality')}</h2>
        <ol>
            <li>{it.L('The Agent shall treat all information related to the Company and the client, including but not limited to client\'s identity, financial status, trading, or transaction performance, as well as the Company\'s business plans, price points, ideas, concepts, formats, suggestions, developments, arrangements, programmes, techniques, methodologies, knowhow, equipment whatsoever, as confidential (hereinafter referred to as the "Confidential Information").')}</li>
            <li>{it.L('The Agent shall not produce any copies of any Confidential Information or any content based on the concepts contained within the Confidential Information for personal use or for distribution without the Company\'s request.')}</li>
            <li>{it.L('It is agreed that Confidential Information shall be considered as confidential even after the termination of the business relationship established under this agreement or any other agreement or arrangement between the Parties.')}</li>
            <li>{it.L('It is noted that immediately upon the termination of the relationship between the Company and the Agent, the Agent shall return to the Company any documents pertaining to the Company\'s business whatsoever which are in the Agent\'s possession.')}</li>
        </ol>

        <h2 data-anchor='termination'>Q. {it.L('Termination')}</h2>
        <p>{it.L('It is agreed and understood that any of the Parties may terminate this agreement by giving seven days written notice to the other Party.')}</p>
    </div>
);

export default PaymentAgents;
