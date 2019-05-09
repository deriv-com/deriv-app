import React from 'react';

const Biel = () => (
    <div>
        <h2 data-anchor='supplementary-terms-and-conditions'>{it.L('Supplementary terms and conditions for Financial Products offered by Binary Investments (Europe) Ltd')}</h2>
        <p>{it.L('These supplementary terms and conditions (these "ST&Cs") apply solely to the clients of Binary Investments (Europe) Ltd ("BIEL") and will govern the relationship between clients and BIEL when trading Financial Products (as defined in the Key information documents [_1]here[_2]) with BIEL.', `<a href=${it.url_for('regulation#key_information_documents')}>`, '</a>')}</p>
        <p>{it.L('These ST&Cs form part of, and need to be read together with, the general terms and conditions relating to the use of [_1].', it.website_name)}</p>
        <p>{it.L('Clients should read these ST&Cs carefully as well as the Summary order execution policy and Summary conflicts policy, the applicable Contract details together with the Risk disclosure notice and any other documents that BIEL has supplied or in the future supplies to clients.')}</p>
        <p>{it.L('These ST&Cs begin to apply on the date BIEL opens the client\'s account, and, for any new versions after that, on the date BIEL notifies the client.')}</p>

        <h2 data-anchor='about-us-and-our-regulator'>{it.L('About BIEL and BIEL\'s regulator')}</h2>
        <p>{it.L('BIEL is a company established in Malta under registration number C70156 and having its registered office at Mompalao Building, Suite 2, Tower Road, Msida MSD1825, Malta.')}</p>
        <p>{it.L('BIEL is authorised and regulated by the Malta Financial Services Authority ("MFSA") under the Investment Services Act (Cap. 370, Laws of Malta) (the "Act") to carry on investment business. BIEL is authorised by the MFSA to deal on own account (i.e. offer and act as counterparty to trades) and to execute orders on behalf of other clients; both services are in relation to financial derivative products relating to foreign exchange, indices and other financial products or assets ("Financial Products"). BIEL is not authorised to and does not offer investment, financial, legal, tax, regulatory, and/or other types of advice or state an opinion in relation to a Transaction under any circumstances. Clients should get independent advice from an investment adviser if they have any doubts about dealing in financial products.')}</p>
        <p>{it.L('From time to time, BIEL may decide to provide the client with written or video information, which BIEL may publish on its website or provide to the client in any other manner. BIEL will endeavour to ensure the accuracy and completeness of this information, but it will not constitute independent investment research or investment advice provided by BIEL to the client.')}</p>
        <p>{it.L('In providing these services, BIEL is bound by the Act, any applicable regulations, by-laws, licence conditions, guidelines, exchange requirements, and other provisions or market practices (the "Rules"). In the event of conflict between these ST&Cs and the Rules, the latter should prevail.')}</p>

        <h2 data-anchor='restrictions'>{it.L('Restrictions')}</h2>
        <p>{it.L('Residents of countries that have been identified by the FATF as having strategic deficiencies shall be restricted from opening an account with Binary Investments (Europe) Ltd.')}</p>

        <h2 data-anchor='client-classification'>{it.L('Client classification')}</h2>
        <p>{it.L('Under the Rules, clients may be categorised into one of the following three categories:')}</p>
        <ul className='bullet'>
            <li>{it.L('Retail clients')}</li>
            <li>{it.L('Professional clients')}</li>
            <li>{it.L('Eligible counterparties')}</li>
        </ul>
        {/* Grammatical errors in the next para */}
        <p>{it.L('The level of protection offered and due to each client depends on the category to which each client is assigned. Retail clients benefit from the highest degree of protection. The Company will assess the Client\'s knowledge and experience versus the appropriateness of the requested service/investment product.')}</p>
        <ol>
            <li>
                <h4>{it.L('Retail clients')}</h4>
                <p>{it.L('Unless otherwise advised, BIEL shall treat a client as a retail client. Clients may also request, by writing to BIEL, to change the category in which they have been classified, and this may have an effect on the level of protection afforded to them. BIEL will assess the Client\'s knowledge and experience versus the appropriateness of the requested service/investment product.')}</p>
                <p>{it.L('Clients hereby declare that they are dealing with BIEL outside the scope of their economic or professional activity, and BIEL will therefore treat the client as an individual retail client for the purposes of EMIR compliance, unless advised otherwise.')}</p>
            </li>
            <li>
                <h4>{it.L('Professional clients')}</h4>
                <p>{it.L('If the client asks to be treated as a professional client, they need to meet certain specified quantitative and qualitative criteria. On the basis of the client\'s request to be categorised as professional, the Company undertakes an assessment of the client\'s expertise, knowledge, and experience to determine whether they fall within this category and whether they are able to make their own investment decisions and understand the risks involved. If the relevant criteria are not met, the Company reserves the right to choose whether to provide its services under this requested classification.')}</p>
                <p>{it.L('Professional clients are offered the possibility to request reclassification, and thus increase the level of regulatory protection afforded, at any time during the relationship.')}</p>
                <p>{it.L('BIEL shall not be obliged to provide professional clients with the following:')}
                    <ol>
                        <li>{it.L('Assessment of appropriateness of the requested service or product as BIEL assumes that the client appreciates the risks associated with such investment services and products offered by the Company')}</li>
                        <li>{it.L('Risk warnings and notices related to Transactions and investments in the proposed instruments')}</li>
                        <li>{it.L('Educational material')}</li>
                        <li>{it.L('Compensation under Investor Compensation Scheme')}</li>
                    </ol>
                </p>
            </li>
            <li>
                <h4>{it.L('Eligible counterparties')}</h4>
                <p>{it.L('When a client is classified as an Eligible Counterparty, BIEL shall not provide them with')}
                    <ol>
                        <li>{it.L('Best execution requirements')}</li>
                        <li>{it.L('Assessment of appropriateness of the requested service or product, as BIEL assumes that the client appreciates risk disclosures associated with the requested investment services and products offered by the Company')}</li>
                        <li>{it.L('Risk warnings and notices related to the client\'s Transactions')}</li>
                        <li>{it.L('Client reporting')}</li>
                        <li>{it.L('The Investor Compensation Scheme')}</li>
                    </ol>
                </p>
            </li>
        </ol>
        <p>{it.L('BIEL reserves the right to accept or refuse any requests for change in classification.')}</p>
        <p>{it.L('BIEL is entitled under the Rules to rely upon information provided by clients. Clients should ensure that they provide BIEL with accurate and complete information and notify BIEL in the event that any information supplied to BIEL changes. Clients should note that if they provide BIEL with inaccurate information, or if they fail to notify BIEL of any changes to information previously supplied by them, this may adversely affect the quality of the services that BIEL can provide.')}</p>
        <p>{it.L('Clients are also advised that their rights may be prejudiced if they provide the wrong information as the Company would not be in a position to act in their best interests.')}</p>

        <h2 data-anchor='appropriateness-test'>{it.L('Appropriateness test')}</h2>
        <p>{it.L('In the course of provision of services, BIEL shall, where applicable, conduct an appropriateness test in order to determine whether, in BIEL\'s view and on the basis of the information provided by the client, the client has the necessary knowledge and experience in the investment field to understand the risks involved in the specific type of product or service offered or demanded.')}</p>
        <p>{it.L('Where BIEL considers, on the basis of the information provided by the client that the client does not possess the knowledge and experience to appreciate the risks associated with an investment in the proposed instrument, BIEL will issue a warning to the client. Such a warning shall be displayed on the website.')}</p>
        <p>{it.L('Where BIEL does not manage to obtain sufficient information to assess the appropriateness of the product or service for the client, BIEL will similarly inform the client that BIEL is not in a position to assess appropriateness.')}</p>

        <h2 data-anchor='best-execution-policy'>{it.L('Best execution policy')}</h2>
        <p>{it.L('Subject to any specific instructions which may be provided by the client, when executing client orders, BIEL will take all reasonable steps to obtain the best possible results for the client. The best possible results will be determined in terms of total consideration, that is, the price of the instrument and the costs related to execution, which shall include all expenses incurred by the client that are directly related to the execution of the order.')}</p>
        <p>{it.L('Other best execution factors, such as speed of execution, likelihood of execution and settlement, size, nature, or any other considerations relevant to the execution of a particular order, may also be applied by BIEL in order to obtain the best possible results for the client.')}</p>
        <p>{it.L('Since BIEL exclusively deals on own account in Financial Products, this means that BIEL acts as the execution venue, and accordingly all transactions entered into with BIEL will be executed outside a regulated market (stock exchange) or multilateral trading facility.')}</p>
        <p>{it.L('The full version of BIEL\'s best execution policy is available on request.')}</p>

        <h2 data-anchor='clients-money'>{it.L('Clients\' money')}</h2>
        <p>{it.L('Monies deposited by clients with BIEL in advance of a trade or pending withdrawal is treated by BIEL as clients\' money. BIEL holds such monies in pooled or omnibus clients\' money bank accounts opened with banks or other institutions ("Institutions"), segregated from BIEL\'s own money. Such clients\' money bank accounts may be opened with EEA Institutions or Institutions outside the EEA. Where clients\' money is held with non-EEA Institutions, this means that such accounts will be subject to laws other than those of an EEA member state and clients\' rights may differ accordingly.')}</p>
        <p>{it.L('The Financial Products that BIEL offers to deal in are contracts entered into between clients and BIEL. Under these contracts and subject to the specific terms of the relevant contract, in consideration for the premium or price that clients pay BIEL, BIEL promises to pay clients a certain amount if the reference assets or measurements perform in a particular manner. These contracts accordingly are not instruments that BIEL holds on clients\' behalf and neither benefits from clients\' assets protection in the event of BIEL\'s insolvency. Similarly, the premium or price that clients pay to take out a trade is not held as clients\' money but as consideration for BIEL\'s undertaking to pay.')}</p>
        <p>{it.L('The client acknowledges and agrees to the following:')}
            <ul className='bullet'>
                <li>{it.L('The Company will not pay interest on the Client Money.')}</li>
                <li>{it.L('Where the Client\'s obligations to the Company are due and payable, the Company shall cease to treat as Client Money the amount equal to the amount of such obligations.')}</li>
                <li>{it.L('The Company may use the Client Money for the purposes of meeting obligations that are incurred by the Company in connection with the margining, guaranteeing, securing, transferring, adjusting, or settling of the client\'s dealings in derivatives.')}</li>
            </ul>
        </p>

        <h2 data-anchor='investor-compensation-scheme'>{it.L('Investor Compensation Scheme')}</h2>
        <p>{it.L('BIEL forms part of [_1]the Investor Compensation Scheme[_2] (the "Scheme"), which is a rescue fund for investors that are clients of failed investment firms licensed by the MFSA. The Scheme covers 90% of the Company\'s net liability to a client in respect of investments that qualify for compensation under the Investment Services Act subject to a maximum payment to any one person of €20,000. The Scheme is based on EC Directive 97/9.', '<a href="http://www.compensationschemes.org.mt" target="_blank" rel="noopener noreferrer">', '</a>')}</p>
        <p>{it.L('Cover is made available on the basis of the depositor rather than on the basis of the number of deposits, meaning that if an individual has multiple accounts, they will only be covered up to €20,000 on the global amount. Any other amount exceeding such a threshold is not protected and will thus have to be borne by the investor.')}</p>
        <p>{it.L('Professional clients and eligible counterparties do not fall within the scope of the Investor Compensation Scheme.')}</p>

        <h2 data-anchor='governing-law-and-jurisdiction'>{it.L('Governing law and jurisdiction')}</h2>
        <p>{it.L('These ST&Cs are to be governed by and construed in accordance with Maltese law and the parties hereto agree to submit to the non-exclusive jurisdiction of the Maltese courts.')}</p>
    </div>
);

export default Biel;
