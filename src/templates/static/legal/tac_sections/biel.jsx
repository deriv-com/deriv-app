import React from 'react';

const Biel = () => (
    <div>
        <h2 data-anchor='supplementary-terms-and-conditions'>{it.L('Supplementary Terms and Conditions for Financial Products Offered by Binary Investments (Europe) Ltd ')}</h2>
        <p>{it.L('These Supplementary Terms and Conditions (these "ST&Cs") apply solely to clients ("you") of Binary Investments (Europe) Ltd ("BIEL", "we" or "us") and will govern the relationship between you and us when trading Financial Products (as defined in the Key Information documents [_1]here[_2]) with us.', `<a href=${it.url_for('regulation#key_information_documents')}>`, '</a>')}</p>
        <p>{it.L('These ST&Cs form part of and need to be read together with the General Terms and Conditions relating to the use of [_1].', it.website_name)}</p>
        <p>{it.L('You should read these ST&Cs carefully as well as the Summary of the Order Execution Policy and Summary of the Conflicts Policy, the applicable Contract Details together with the Risk Disclosure Notice and any other documents that we have supplied or in the future do supply to you.')}</p>
        <p>{it.L('These ST&Cs begin to apply on the date we open your account, and, for any new versions after that, on the date we notify you.')}</p>

        <h2 data-anchor='about-us-and-our-regulator'>{it.L('About Us and Our Regulator')}</h2>
        <p>{it.L('BIEL is a company established in Malta under registration number C70156 and having its registered office at W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta.')}</p>
        <p>{it.L('We are authorised and regulated by the Malta Financial Services Authority ("MFSA") under the Investment Services Act (Cap. 370, Laws of Malta) (the "Act") to carry on investment business.  We are authorised by the MFSA to deal on own account (i.e. offer and act as counterparty to trades) and to execute orders on behalf of other clients, both services are in relation to financial derivative products relating to foreign exchange, indices and other financial products or assets ("Financial Products"). We are not authorised to and do not offer or provide investment advice or any other investment services other than those described above. Should you feel that you require investment advice or investment services other than those described above then you should contact an independent financial advisor or firm.')}</p>
        <p>{it.L('In providing these services, we are bound by the Act, any applicable regulations, bye-laws, licence conditions, guidelines, exchange requirements and other provisions or market practices (the "Rules"). In the event of conflict between these ST&Cs and the Rules, the latter should prevail.')}</p>

        <h2 data-anchor='restrictions'>{it.L('Restrictions')}</h2>
        <p>{it.L('Residents of countries which have been identified by the FATF as having strategic deficiencies shall be restricted from opening an account with Binary Investments (Europe) Ltd.')}</p>

        <h2 data-anchor='client-classification'>{it.L('Client Classification')}</h2>
        <p>{it.L('Under the Rules, clients may be categorised into one of the following three categories:')}</p>
        <ul className='bullet'>
            <li>{it.L('Retail Clients')}</li>
            <li>{it.L('Professional Clients')}</li>
            <li>{it.L('Eligible Counterparty')}</li>
        </ul>
        <p>{it.L('The level of protection offered and due to each client depends on the category to which each client is assigned. Retail Clients benefit from the highest degree of protection.')}</p>
        <p>{it.L('Unless otherwise advised, we shall treat you as a Retail Client. You may also request by writing to us to change the category in which you have been classified and this may have an effect on the level of protection afforded to you. Professional Clients do not fall within the scope of the Investor Compensation Scheme. We reserve the right to accept or refuse any such request for change in classification.')}</p>
        <p>{it.L('Notwithstanding the above, you hereby declare that you are dealing with us outside the scope of your economic or professional activity and we will therefore treat you as an individual retail client for the purposes of EMIR compliance, unless advised otherwise.')}</p>
        <p>{it.L('We are entitled under the Rules to rely upon information provided by you. You should ensure that you provide us with accurate and complete information and notify us in the event that any information supplied to us changes. You should note that if you provide us with inaccurate information, or if you fail to notify us of any changes to information previously supplied by you, this may adversely affect the quality of the services that we can provide.')}</p>

        <h2 data-anchor='appropriateness-test'>{it.L('Appropriateness Test')}</h2>
        <p>{it.L('In the course of provision of services we shall, where applicable, conduct an appropriateness test in order to determine whether, in our view and on the basis of the information provided by you, you have the necessary knowledge and experience in the investment field to understand the risks involved in the specific type of product or service offered or demanded.')}</p>
        <p>{it.L('Where we consider, on the basis of the information provided by you that you do not possess the knowledge and experience to appreciate the risks associated with an investment in the proposed instrument, we will issue a warning to you.  Such a warning shall be displayed on the website.')}</p>
        <p>{it.L('Where we do not manage to obtain sufficient information to assess the appropriateness of the product or service for you, we will similarly inform you that we are not in a position to assess appropriateness.')}</p>

        <h2 data-anchor='best-execution-policy'>{it.L('Best Execution Policy')}</h2>
        <p>{it.L('Subject to any specific instructions which may be provided by you, when executing client orders, we will take all reasonable steps to obtain the best possible results for you. The best possible results will be determined in terms of total consideration, that is, the price of the instrument and the costs related to execution which shall include all expenses incurred by you that are directly related to the execution of the order.')}</p>
        <p>{it.L('Other best execution factors such as speed of execution, likelihood of execution and settlement, size, nature or any other considerations relevant to the execution of a particular order may also be applied by us in order to obtain the best possible results for you.')}</p>
        <p>{it.L('Since we exclusively deal on own account in Financial Products this means that we act as the execution venue and accordingly all transactions entered into with us will be executed outside a regulated market (stock exchange) or multilateral trading facility.')}</p>
        <p>{it.L('The full version of our best execution policy is available on request.')}</p>

        <h2 data-anchor='clients-money'>{it.L('Clients\' Money')}</h2>
        <p>{it.L('Monies deposited by you with us in advance of a trade or pending withdrawal is treated by us as clients\' money. We hold such monies in pooled or omnibus clients\' money bank accounts opened with banks or other institutions ("Institutions"), segregated from our own money. Such clients\' money bank accounts may be opened with EEA Institutions or Institutions outside the EEA. Where clients money is held with non-EEA Institutions this means that such accounts will be subject to laws other than those of an EEA member state and your rights may differ accordingly.')}</p>
        <p>{it.L('The Financial Products that we offer to deal in are contracts entered into between you and us. Under these contracts and subject to the specific terms of the relevant contract, in consideration for the premium or price that you pay us, we promise to pay you a certain amount if the reference assets or measurements perform in a particular manner. These contracts accordingly are not instruments that we hold on your behalf and neither benefit from clients\' assets protection in the event of our insolvency. Similarly the premium or price that you pay to take out a trade is not held as clients\' money but as consideration for our undertaking to pay.')}</p>

        <h2 data-anchor='investor-compensation-scheme'>{it.L('Investor Compensation Scheme')}</h2>
        <p>{it.L('BIEL forms part of [_1]the Investor Compensation Scheme[_2] (the "Scheme") which is a rescue fund for investors that are clients of failed investment firms licensed by the MFSA. The Scheme covers 90% of the Company\'s net liability to a client in respect of investments which qualify for compensation under the Investment Services Act subject to a maximum payment to any one person of €20,000. The Scheme is based on EC Directive 97/9.', '<a href="http://www.compensationschemes.org.mt" target="_blank" rel="noopener noreferrer">', '</a>')}</p>
        <p>{it.L('Cover is made available on the basis of the depositor rather than on the basis of the number of deposits, meaning that if an individual has multiple accounts he will only be covered as to €20,000 on the global amount. Any other amount exceeding such threshold is not protected and will thus have to be borne by the investor.')}</p>

        <h2 data-anchor='governing-law-and-jurisdiction'>{it.L('Governing law and jurisdiction')}</h2>
        <p>{it.L('These ST&Cs are to be governed by and construed in accordance with Maltese law and the parties hereto agree to submit to the non-exclusive jurisdiction of the Maltese courts.')}</p>
    </div>
);

export default Biel;
