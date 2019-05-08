import React from 'react';

const BIEL = () => (
    <div data-show='eucountry'>
        <h2 data-anchor='supplementary-terms-and-conditions-biel'>{it.L('Supplementary Terms and Conditions for Financial Products Offered by Binary Investments (Europe) Ltd')}</h2>
        <p>{it.L('These Supplementary Terms and Conditions (these "ST&Cs") apply solely to clients ("you") of Binary Investments (Europe) Ltd ("BIEL", "we" or "us") and will govern the relationship between you and us when trading Financial Products (as defined below) with us.')}</p>
        <p>{it.L('Under these Terms, you may enter into transactions in the following investments and instruments, all of which are Over-the-Counter (“OTC”) products:')}</p>
        <ol>
            <li>{it.L('Rolling Spot Forex;')}</li>
            <li>{it.L('CFDs on commodities; and/or')}</li>
            <li>{it.L('CFDs on indices.')}</li>
        </ol>
        <p>{it.L('The trading services described in this Agreement are OTC. This means that one or more of the underlying instruments in which you transact with us, though quoted on an exchange, are not traded on an exchange when transacted through the Electronic Trading Platform as described in this Agreement.')}</p>
        <p>{it.L('Your trades will be carried out on an execution-only basis through our online platform.')}</p>
        <p>{it.L('The Company does not provide and is not authorised to provide investment advice. The Company will not make personal recommendations or advise on the merits of buying and/or selling in particular investments.')}</p>
        <p>{it.L('You acknowledge that any explanation, trading recommendations, independent investment research, market commentary or any other information provided by the Company, is provided to you as marketing communication and/or educational material, for information purposes only, and does not construe any personal advice on the merits of investing.')}</p>

        <h2 data-anchor='about-us-and-our-regulator'>{it.L('About Us and Our Regulator')}</h2>
        <p>{it.L('BIEL is a company established in Malta under registration number C70156 and having its registered office at W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta.')}</p>
        <p>{it.L('We are authorised and regulated by the Malta Financial Services Authority ("MFSA") under the Investment Services Act (Cap. 370, Laws of Malta) (the "Act") to carry on investment business. We are authorised by the MFSA to deal on own account (i.e. offer and act as counterparty to trades) and to execute orders on behalf of other persons, both services are in relation to financial derivative products relating to foreign exchange, indices and other financial products or assets ("Financial Products"). We are not authorised to and do not offer or provide investment advice or any other investment services other than those described above. Should you feel that you require investment advice or investment services other than those described above then you should contact an independent financial advisor or firm.')}</p>
        <p>{it.L('In providing these services, we are bound by the Act, any applicable regulations, by-laws, licence conditions, guidelines, exchange requirements and other provisions or market practices (the "Rules"). In the event of conflict between these ST&Cs and the Rules, the latter should prevail.')}</p>

        <h2 data-anchor='restrictions'>{it.L('Restrictions')}</h2>
        <p>{it.L('Residents of countries which have been identified by the FATF as having strategic deficiencies shall be restricted from opening an account with Binary Investments (Europe) Ltd.')}</p>

        <h2 data-anchor='risk-acknowledgement'>{it.L('Risk Acknowledgement')}</h2>
        <p>{it.L('By entering into an agreement with us, you understand that CFDs are highly speculative, complex products and carry a high degree of risk, especially those traded on margin. Whilst you may generate profit and increase your capital, you may also expose yourself to losing the entire sum invested and your loss may exceed your deposit. The products attaching this Agreement are not appropriate for everyone. You acknowledge that the trading services described in this Agreement are designed for clients who are knowledgeable and experienced in the types of transactions described in this Agreement and you fully understand the associated risks before entering into this Agreement with us.')}</p>
        <p>{it.L('As a Client and Trader, you acknowledge, recognise and understand that:')}</p>
        <ol>
            <li>{it.L('Because of the leverage effect, the Margin required in Margined Transactions and price changes in the Underlying Instruments, you may suffer significant losses;')}</li>
            <li>{it.L('Transaction monitoring is your responsibility in its entirety. The Company shall not conduct any monitoring of your trades entered into by you;')}</li>
            <li>{it.L('There are no guaranteed profits in investment trading;')}</li>
            <li>{it.L('Transactions in CFD instruments are traded outside a stock exchange or OTF or MTF;')}</li>
            <li>{it.L('You are not trading in the actual underlying instrument, or the actual foreign currency; all transactions are settled in cash only.')}</li>
        </ol>
        <p>{it.L('You should not sign up to receive the trading services described in this Agreement unless you understand their nature and the associated risks.')}</p>

        <h2 data-anchor='provision-of-service'>{it.L('Provision of Service')}</h2>
        <p>{it.L('The Company, under no circumstances shall provide Investment and/or Financial and/or Legal and/or Tax and/or Regulatory and/or other Investment advice or state an opinion in relation to a Transaction. From time to time, we may decide to provide you with written or video information, which we may publish on our website or provide to you in any other manner. We will endeavor to ensure the accuracy and completeness of this information but it will not constitute independent investment research or investment advice provided by us to you.')}</p>
        <p>{it.L('Binary Investments (Europe) Ltd aggregates the bid and ask prices from a pool of liquidity providers to determine and offer you the best available price of the instrument. The Company is always the final counterparty to your Transactions. The Company may execute orders on behalf of its clients, wherein the Company will act as a broker and pass on the order to the liquidity provider for execution. Alternatively, the Company may also keep the client\'s order on its own account, wherein the Company will take the other side of the client\'s trade. It is further noted that the Company may make a profit as a result of your losses and vice-versa. For further details please refer to our Conflicts of Interest Policy and Order Execution Policy.')}</p>
        <p>{it.L('The provision of the trading services described in this Agreement utilises a third-party system acquired via a non-exclusive, non-transferable, non-sub-licensable, terminable licence from the third-party system provider/licensor (the "MT5 Trading Platform"). You acknowledge that when providing trading services, described in this Agreement to you, we may decide to change our third–party system provider/licensor and use a different Trading Platform, other than the MT5 Trading Platform. Hence, in such cases we may decide to use an entirely new third–party system provider/licensor (hereinafter referred to as the “new Trading Platform”) or to introduce an additional third–party system provider/licensor (hereinafter referred to as the “additional Trading Platform”).')}</p>
        <p>{it.L('If we decide to introduce a new Trading Platform, we shall provide you with a relevant notice within 30 days before we introduce the new Trading Platform or the additional Trading Platform. In such a notice, we will outline information including but not limited to features and operations of the new Trading Platform. Thus, using our backup database on the MT5 Trading Platform we shall integrate all data to the new Trading Platform, including but not limited to open trades, historical trades/data, and Accounts.')}</p>

        <h2 data-anchor='account-management'>{it.L('Account Management')}</h2>
        <ol>
            <li><strong>{it.L('Opening an MT5 Real Account')}</strong>
                <p>{it.L('To be able to trade OTC instruments available on the MT5 Trading Platform, you have to first:')}</p>
                <ol>
                    <li>{it.L('Open a [_1] account through our website [_2]; and', it.website_name, `<a href=${it.url_for('new-account')} target="_blank">www.binary.com</a>`)}</li>
                    <li>
                        <p>{it.L('a) Access the MT5 Trading Platform through the direct link [_1] from our web interface; or', `<a href=${it.url_for('platforms')} target="_blank">https://www.binary.com/en/platforms.html</a>`)}</p>
                        <p>{it.L('b) Download and install the MT5 Trading Platform through the link [_1]', `<a href=${it.url_for('user/metatrader')} target="_blank">https://www.binary.com/en/user/metatrader.html</a>`)}</p>
                    </li>
                </ol>
            </li>
            <li><strong>{it.L('Client Classification')}</strong>
                <ol>
                    <li>{it.L('Under the applicable regulations, the Company classifies its clients into three categories: Retail Clients, or Professional Clients, or Eligible Counterparties. Each category is assigned a different level of regulatory protection.')}</li>
                    <li>{it.L('The Company shall treat each applicant as a Retail Client at the time of Account opening, unless the Client requests to be treated as a Professional Client.  However, if the Client satisfies the definition of an Eligible Counterparty, the Company may treat the Client as such, following a mutual agreement.')}</li>
                    <ol>
                        <li>{it.L('Retail Clients')}
                            <p>{it.L('As a Retail Client, you are provided with a higher degree of regulatory protection than a Professional Client or an Eligible Counterparty, since the latter are considered to be more experienced, knowledgeable and sophisticated, with the ability to assess their own risk.')}</p>
                            <p>{it.L('The Company will assess your knowledge and experience versus the appropriateness of the requested service/investment product.')}</p>
                            <p>{it.L('BIEL forms part of the Investor Compensation Scheme (the "Scheme") which is a rescue fund for investors that are clients of failed investment firms licensed by the MFSA. The Scheme covers 90% of the Company\'s net liability to a client in respect of investments which qualify for compensation under the Investment Services Act subject to a maximum payment to any one person of €20,000. The Scheme is based on EC Directive 97/9.')}</p>
                            <p>{it.L('Cover is made available on the basis of the depositor rather than on the basis of the number of deposits, meaning that if an individual has multiple accounts he will only be covered as to €20,000 on the global amount. Any other amount exceeding such threshold is not protected and will thus have to be borne by the investor.')}</p>
                        </li>
                        <li>{it.L('Professional Clients')}
                            <p>{it.L('If you ask to be treated as a Professional Client, you need to meet certain specified quantitative and qualitative criteria. On the basis of your request to be categorised as Professional, the Company undertakes an assessment of your expertise, knowledge and experience to determine whether you fall within this Category and whether you are able to make your own investment decisions and understand the risks involved. If the relevant criteria are not met, the Company reserves the right to choose whether to provide its services under this requested classification.')}</p>
                            <p>{it.L('Professional Clients are offered the possibility to request reclassification, and thus increase the level of regulatory protection afforded, at any time during the relationship.')}</p>
                            <p>{it.L('The Company shall not be obliged to provide Professional Clients with the following:')}</p>
                            <ol>
                                <li>{it.L('Assessment of appropriateness of the requested service or product as we assume that you appreciate the risks associated with such investment services and products offered by the Company;')}</li>
                                <li>{it.L('risk warnings and notices related to transactions and investments in the proposed instruments;')}</li>
                                <li>{it.L('educational material;')}</li>
                                <li>{it.L('compensation under Investor Compensation Scheme.')}</li>
                            </ol>
                        </li>
                        <li>{it.L('Eligible Counterparties')}
                            <p>{it.L('When you are classified as an Eligible Counterparty we shall not provide you with:')}</p>
                            <ol>
                                <li>{it.L('Best Execution Requirements;')}</li>
                                <li>{it.L('Assessment of appropriateness of the requested service or product as we assume that you appreciate risk disclosures associated with the requested investment services and products offered by the Company; ')}</li>
                                <li>{it.L('risk warnings and notices related to your transactions;')}</li>
                                <li>{it.L('Client Reporting;')}</li>
                                <li>{it.L('The Investors Compensation Scheme.')}</li>
                            </ol>
                        </li>
                    </ol>
                </ol>
            </li>
            <li><strong>{it.L('Assessment of Appropriateness')}</strong>
                <p>{it.L('Before the provision of our services, we conduct an appropriateness test for our Retail Clients, in accordance with our Regulatory obligations and in order to determine whether, on the basis of the Regulatory Criteria and information provided by you, you have the necessary skills, knowledge, expertise and experience in the investment field to understand the risks involved in the specific type of product or service requested.')}</p>
                <p>{it.L('The Company shall assume that the information provided by the client is accurate and complete. The Company shall bear no responsibility if such information is inaccurate and/or incomplete.')}</p>
                <p>{it.L('You should get independent advice from an investment adviser if you have any doubts about dealing in margined products.')}</p>
            </li>
            <li><strong>{it.L('Payments & Withdrawals')}</strong>
                <ol>
                    <li>{it.L('Funding of MT5 Real Account')}
                        <p>{it.L('When you transfer your money to us for trading purposes, your funds are deposited in your [_1] account. If you choose to trade FX and CFDs you shall transfer funds from your [_1] account to your MT5 Real Account. Such transfer shall not be regarded as a transfer from two different Accounts but as a transfer of funds from your centralised [_1] account to the MT5 Real Account. No fund transfers shall be made to any other Account in the name of any third party.', it.website_name)}</p>
                        <p>{it.L('As our Client, you agree to comply with the following when making payments to the Company:')}</p>
                        <ol>
                            <li>{it.L('Deposits and/or payments due are to be made in the currency chosen by you from the ones specified by the Company from time to time;')}</li>
                            <li>{it.L('You are responsible for all third-party electronic transfer fees in respect of payments;')}</li>
                            <li>{it.L('Payments made to the Company will only be deemed to have been received once the Company receives cleared funds; ')}</li>
                            <li>{it.L('You bear the responsibility of ensuring that payments made to the Company are correctly received with the specified Client\'s Account details.')}</li>
                        </ol>
                        <p>{it.L('There are no charges for transferring money from your [_1] account to your MT5 Real Account.', it.website_name)}</p>
                    </li>
                    <li>{it.L('Transfer of Funds from the MT5 Real Account')}
                        <p>{it.L('If you have a positive balance in your MT5 Real Account, you may transfer such balance from your MT5 Real Account into your [_1] account and then request a withdrawal as necessary for any amount available on your [_1] account. The Company may withhold, deduct or refuse to make any such transfer or withdrawal, in whole or in part, if:', it.website_name)}</p>
                        <ol>
                            <li>{it.L('You have Open Positions on the Account showing a loss;')}</li>
                            <li>{it.L('Such transfer would result in your Account Equity being less than zero; ')}</li>
                            <li>{it.L('The requested transfer would reduce your Account balance to less than the Margin required for your Open Positions;')}</li>
                            <li>{it.L('The Company reasonably considers that funds may be required to meet any current or future Margin Requirements on Open Positions due to the underlying market conditions;')}</li>
                            <li>{it.L('The Company reasonably determines that there is an unresolved dispute between the Company and the Client relating to the agreed Terms and Agreements;')}</li>
                            <li>{it.L('There is any amount outstanding from you to us; and/or')}</li>
                            <li>{it.L('We are required to do so in accordance with any relevant Law or Regulation.')}</li>
                        </ol>
                        <p>{it.L('Your MT5 Real Account as well as all payments and withdrawals therefrom must be made in the same currency as maintained in your [_1] account.', it.website_name)}</p>
                    </li>
                    <li>{it.L('Negative Balance Protection')}
                        <p>{it.L('When using the MT5 Trading Platform, all our clients will be provided with margin monitoring functionality to protect you from encountering negative balances when trading under normal market conditions. As a trader, you should always, and at all times maintain the appropriate levels of margin in your trading account as the recommended method of your own risk management.')}</p>
                        <p>{it.L('If your usable margin drops below 100%, a margin call mode will be triggered and maintained till the level of 50%. In the event that your margin level is equal to, or drops below 50%, the Company will initiate the closing of your current open positions, starting from the most unprofitable until the required margin level is achieved. In such events, the positions will be automatically closed at the current market price at that point in time.')}</p>
                        <p>{it.L('In exceptional circumstances, where there is a price change in the underlying that is sufficiently large and sudden, gapping can occur. In such cases, the automatic margin close-out protection might fail, causing your account balance to fall below zero. For this purpose, a Negative Balance Protection mechanism has been introduced. Negative Balance Protection provides a "backstop" in case of extreme market conditions and ensures that your maximum losses from trading CFDs, including all related costs, are limited to the balance available on your CFD account. Therefore, you can never lose more money than the total sum invested for trading CFDs; if your CFD account balance falls below zero, the Company will compensate the negative balance as soon as possible without any additional cost to you.')}</p>
                        <p>{it.L('Negative Balance Protection does not apply to clients categorized as professional traders, who can still lose more money than their available balance.')}</p>
                        <p>{it.L('The Company does not offer credit to its clients. You acknowledge and agree that you will not be dealing with us on credit.')}</p>
                    </li>
                </ol>
            </li>
            <li><strong>{it.L('Account Closure')}</strong>
                <p>{it.L('If you wish to withdraw funds from your MT5 Real Account and/or close your MT5 Real Account, you may notify us by contacting our helpdesk at [_1]. Your MT5 Real Account may be closed if you do not have any Open Positions and all amounts due to us have been settled.', '<a href="mailto:support@binary.com">support@binary.com</a>')}</p>
            </li>
        </ol>

        <h2 data-anchor='market-execution'>{it.L('Market Execution')}</h2>
        <p>{it.L('On the MT5 Trading Platform, you will benefit from Direct Market Access that gives you the opportunity to receive the best possible price in the market at a specified time, without having to use a dealing desk.')}</p>
        <p>{it.L('As a result, your trades are executed at market as follows:')}</p>
        <ol>
            <li>{it.L('The price of your chosen investment appears on the platform/on your screen;')}</li>
            <li>{it.L('By clicking buy or sell, your order will be filled at the best possible price with either one of our liquidity providers or on our own books (according to the best streaming price at the time of your order placement);')}</li>
            <li>{it.L('When the order hits the liquidity provider\'s server, or our server in case the order is taken on our own books, it is fulfilled.')}</li>
        </ol>
        <p>{it.L('Please be advised that prices can change very quickly in the market, so the execution price may not necessarily be visible instantly once the order has been filled.')}</p>
        <p>{it.L('Also consider that your internet connection can influence what price is displayed after the trade has been executed.')}</p>

        <h2 data-anchor='expert-advisors'>{it.L('Expert Advisors')}</h2>
        <p>{it.L('Expert Advisors, including any additional functions/plug-ins of trading operations provided by or developed using Expert Advisors, are applications developed using the MetaQuotes Language which can be used to analyse price charts and automate your trades.')}</p>
        <p>{it.L('Expert Advisors made available on the MT5 Trading Platform, are owned by MetaQuotes Software Corporation (the MT5 Trading Platform Licensor) and shall remain the exclusive property of MetaQuotes Software Corporation.')}</p>
        <p>{it.L('The Company is an independent legal entity and is not affiliated with the MT5 Trading Platform. MT5 is not owned, controlled, or operated by the Company. Therefore, the Company does not provide any warranties related to any MT5 product or service and has not reviewed or verified any performance results that may be presented and/or described on this website in relation to MT5.')}</p>
        <p>{it.L('There are no restrictions to the use of Expert Advisors on the MT5 Trading Platform apart from unethical trading.')}</p>

        <p>{it.L('As an example, Expert Advisors might be able to be programmed for:')}</p>
        <ol>
            <li>{it.L('alerting Clients of a potential trading opportunity;')}</li>
            <li>{it.L('execution of trades automatically on their behalf;')}</li>
            <li>{it.L('managing of various aspects of online trading such as sending orders to the platform;')}</li>
            <li>{it.L('automatic adjustments of take profit levels;')}</li>
            <li>{it.L('trailing stops; and')}</li>
            <li>{it.L('stop loss orders.')}</li>
        </ol>
        <p>{it.L('The Client, before using the trading robots or Expert Advisors and forward trade, should test it on a demo Account. ')}</p>
        <p>{it.L('Please note that actual trading results may not correspond to optimized or back-tested results.')}</p>
        <p>{it.L('All software is to be used at your own risk. The Company will not be liable for any financial losses incurred using a third-party software. The Company is not associated with the development of the automated trading software or the Expert Advisors because they are exclusively developed and supported by third parties and not by the Company. The Company does not receive any form of financial and/or other benefits from permitting Expert Advisors to be used.')}</p>
        <p>{it.L('The Client shall accept the risk of using any additional functions provided by the Expert Advisor on the MT5 Trading Platform. The Company has no responsibility for the outcome of such trading and reserves the right to accept or reject the use of such functions with absolute discretion.')}</p>
        <p>{it.L('Where such additional functions/plug-ins affect the reliability and/or smooth operation and/or orderly functioning of the MT5 Trading Platform, the Company has the right to immediately terminate its contractual relationship with its Clients by written notice.')}</p>
        <p>{it.L('By using the electronic trading system, including the MT5 Trading Platform, Clients accept full responsibility for the use of such platforms and for any orders transmitted via such platforms.')}</p>
        <p>{it.L('The Company does not accept any liability for any inconsistencies or results related to Clients utilizing Expert Advisors on the MT5 Trading Platform. Clients are liable for their use of Expert Advisors and the trading activity they conduct. The Company takes a neutral position on Clients\' use of Expert Advisors.')}</p>
        <p>{it.L('All unforeseen openings or closings of positions initiated by the Expert Advisor, whether relevant to system error or otherwise, are out of the scope of the Company\'s responsibility hence the Company is not liable for such actions or results.')}</p>

        <h2 data-anchor='clients-money'>{it.L('Clients\' Money')}</h2>
        <p>{it.L('The Company treats the money deposited or earned as a result of profitable transactions by the client as \'Client Money\' and in accordance with the Control of Assets Rules. Client Money is held in accounts segregated and designated as clients\' monies accounts, clearly separated from the Company\'s money.')}</p>
        <p>{it.L('The client acknowledges and agrees that:')}</p>
        <ol>
            <li>{it.L('The Company will not pay interest on the Client Money;')}</li>
            <li>{it.L('Where the Client\'s obligations to the Company are due and payable, the Company shall cease to treat as Client Money the amount equal to the amount of such obligations;')}</li>
            <li>{it.L('The Company may use the Client Money for the purposes of meeting obligations incurred by the Company in connection with the margining, guaranteeing, securing, transferring, adjusting or settling of your dealings in derivatives.')}</li>
        </ol>

        <h2 data-anchor='complaints'>{it.L('Complaints')}</h2>
        <p>{it.L('The Company ensures that complaints received will be investigated thoroughly and fairly. You may submit your complaint by sending an email to [_1].', '<a href="mailto:complaints@binary.com">complaints@binary.com</a>')}</p>
        <p>{it.L('Binary Investments (Europe) Ltd shall review your complaint and provide you with the outcome of the investigation as promptly as possible, and at most within 15 days of the submission date. If we are unable to provide you with the final response within this time, due to an ongoing investigation of your complaint, we shall inform you of that fact and the anticipated timeframe to resolve the issue.')}</p>
        <p>{it.L('If your complaint relates to the outcome of an investment or transaction and remains unresolved, it will turn into a dispute. Before contacting the Office of the Arbiter, we strongly recommend trying to resolve your concern with us.')}</p>
        <p>{it.L('Should you be unsatisfied with our response, you can also escalate your complaint to the Office of the Arbiter for Financial Services, who is independent from us. Complaints to the Arbiter for Financial Services should always be made in a prescribed form and addressed to the:')}</p>
        <address>
            <p>
                Office of the Arbiter for Financial Services<br />
                1st floor, St Calcedonius Square<br />
                Floriana FRN1530<br />
                Malta
            </p>

            <p>
                {it.L('Telephone')}: +356 (or 00356) 2124 9245<br />
                {it.L('E-mail')}: <a href='mailto:complaint.info@financialarbiter.org.mt'>complaint.info@financialarbiter.org.mt</a><br />
                {it.L('Website')}: <a href='http://financialarbiter.org.mt/en/Pages/Home.aspx' target='_blank' rel='noopener noreferrer'>http://financialarbiter.org.mt/en/Pages/Home.aspx</a>
            </p>
        </address>

        <h2 data-anchor='governing-law-and-jurisdiction'>{it.L('Governing law and jurisdiction')}</h2>
        <p>{it.L('These ST&Cs are to be governed by and construed in accordance with Maltese law and the parties hereto agree to submit to the non-exclusive jurisdiction of the Maltese courts.')}</p>
    </div>
);

export default BIEL;
