import React from 'react';

const BIEL = () => (
    <div data-show='eucountry'>
        <h2 data-anchor='supplementary-terms-and-conditions-biel'>{it.L('Supplementary terms and conditions for Financial Products offered by Binary Investments (Europe) Ltd')}</h2>
        <p>{it.L('These supplementary terms and conditions (these "ST&Cs") apply solely to the Clients of Binary Investments (Europe) Ltd ("BIEL") and will govern the relationship between the Client and BIEL when trading Financial Products (as defined below) with BIEL.')}</p>
        <p>{it.L('Under these ST&Cs, the Client may enter into Transactions in the following investments and instruments, all of which are over-the-counter ("OTC") products:')}</p>
        <ol>
            <li>{it.L('Rolling Spot Forex')}</li>
            <li>{it.L('CFDs on commodities')}</li>
            <li>{it.L('CFDs on indices')}</li>
        </ol>
        <p>{it.L('The trading services described in this agreement are OTC. This means that one or more of the Underlying Instruments in which the Client transacts with BIEL, though quoted on an exchange, are not traded on an exchange when transacted through the electronic trading platform as described in this agreement.')}</p>
        <p>{it.L('The Client\'s trades will be carried out on an execution-only basis through our online platform.')}</p>
        <p>{it.L('The Company does not provide and is not authorised to provide investment advice. The Company will not make personal recommendations or advise on the merits of buying and/or selling in particular investments.')}</p>
        <p>{it.L('The Client acknowledges that any explanations, trading recommendations, independent investment research, market commentary, or any other information provided by BIEL is provided to the Client as marketing communication and/or educational material, for information purposes only, and does not construe any personal advice on the merits of investing.')}</p>

        <h2 data-anchor='risk-acknowledgement'>{it.L('Risk acknowledgement')}</h2>
        <p>{it.L('By entering into an agreement with BIEL, the Client understands that CFDs are highly speculative, complex products and carry a high degree of risk, especially those traded on Margin. Whilst the Client may generate profit and increase their capital, they may also expose themselves to losing the entire sum invested, and their loss may exceed their deposit. The products referred to in this agreement are not appropriate for everyone. The Client acknowledges that the trading services described in this agreement are designed for Clients who are knowledgeable and experienced in the types of Transactions described in this agreement, and the Client fully understands the associated risks before entering into this agreement with BIEL.')}</p>
        <p>{it.L('The Client acknowledges, recognises, and understands that')}</p>
        <ol>
            <li>{it.L('Because of the leverage effect, the Margin required in Margined Transactions, and price changes in the Underlying Instruments, the Client may suffer significant losses.')}</li>
            <li>{it.L('Transaction monitoring is the Client\'s responsibility in its entirety. The Company shall not conduct any monitoring of the Client\'s trades.')}</li>
            <li>{it.L('There are no guaranteed profits in investment trading.')}</li>
            <li>{it.L('Transactions in CFD instruments are traded outside a stock exchange or OTF or MTF.')}</li>
            <li>{it.L('The Client is not trading in the actual Underlying Instrument, or the actual foreign currency; all Transactions are settled in cash only.')}</li>
        </ol>
        <p>{it.L('The Client should not sign up to receive the trading services described in this agreement unless they understand the nature of these services and the associated risks.')}</p>

        <h2 data-anchor='provision-of-service'>{it.L('Provision of service')}</h2>
        <p>{it.L('Binary Investments (Europe) Ltd aggregates the Bid and Ask prices from a pool of liquidity providers to determine and offer the Client the best available price of the instrument. The Company is always the final counterparty to the Client\'s Transactions. The Company may execute Orders on behalf of its Clients, wherein the Company will act as a broker and pass on the Order to the liquidity provider for execution. Alternatively, the Company may also keep the Client\'s Order on its own account, wherein the Company will take the other side of the Client\'s trade. It is further noted that the Company may make a profit as a result of the Client\'s losses and vice-versa. Further details can be found under Conflicts of interest policy and Order execution policy.')}</p>
        <p>{it.L('The provision of the trading services described in this agreement utilises a third-party system acquired via a non-exclusive, non-transferable, non-sub-licensable, terminable licence from the third-party system provider/licensor (the "MT5 trading platform"). The Client acknowledges that, when providing trading services described in this agreement to the Client, BIEL may decide to change its third–party system provider/licensor and use a trading platform other than the MT5 trading platform. Hence, in such cases, BIEL may decide to use an entirely new third–party system provider/licensor (hereinafter referred to as the "new trading platform") or to introduce an additional third–party system provider/licensor (hereinafter referred to as the "additional trading platform").')}</p>
        <p>{it.L('If BIEL decides to introduce a new trading platform, it shall provide the Client with a relevant notice within 30 days before it introduces the new trading platform or the additional trading platform. In such a notice, BIEL will outline information including, but not limited to, features and operations of the new trading platform. Thus, using its backup database on the MT5 trading platform, BIEL shall integrate all data to the new trading platform, including but not limited to open trades, historical trades/data, and accounts.')}</p>

        <h2 data-anchor='account-management'>{it.L('Account management')}</h2>
        <ol>
            <li><strong>{it.L('Opening an MT5 Real Account')}</strong>
                <p>{it.L('To be able to trade OTC instruments available on the MT5 trading platform, the Client has to first')}</p>
                <ol>
                    <li>{it.L('Open a [_1] account through BIEL\'s website [_2]', it.website_name, `<a href=${it.url_for('new-account')} target="_blank">www.binary.com</a>`)}</li>
                    <li>
                        <p>{it.L('a. Access the MT5 trading platform through the direct link [_1] from BIEL\'s web interface, or', `<a href=${it.url_for('platforms')} target="_blank">https://www.binary.com/en/platforms.html</a>`)}</p>
                        <p>{it.L('b. Download and install the MT5 trading platform through the link [_1]', `<a href=${it.url_for('user/metatrader')} target="_blank">https://www.binary.com/en/user/metatrader.html</a>`)}</p>
                    </li>
                </ol>
            </li>
            <li><strong>{it.L('Payments & withdrawals')}</strong>
                <ol>
                    <li>{it.L('Funding of the MT5 Real Account')}
                        <p>{it.L('When the Client transfers their money to BIEL for trading purposes, the Client\'s funds are deposited in their [_1] account. If the Client chooses to trade FX and CFDs, the Client shall transfer funds from their [_1] account to their MT5 Real Account. Such a transfer shall not be regarded as a transfer from two different accounts but as a transfer of funds from the Client\'s centralised [_1] account to the MT5 Real Account. No fund transfers shall be made to any other account in the name of any third party.', it.website_name)}</p>
                        <p>{it.L('The Client agrees to comply with the following when making payments to BIEL:')}</p>
                        <ol>
                            <li>{it.L('Deposits and/or payments due are to be made in the currency chosen by the Client from the ones specified by BIEL from time to time.')}</li>
                            <li>{it.L('The Client is responsible for all third-party electronic transfer fees in respect of payments.')}</li>
                            <li>{it.L('Payments made to BIEL will only be deemed to have been received once BIEL receives cleared funds.')}</li>
                            <li>{it.L('The Client bears the responsibility of ensuring that payments made to BIEL are correctly received with the specified Client\'s account details.')}</li>
                        </ol>
                        <p>{it.L('There are no charges for transferring money from the Client\'s [_1] account to their MT5 Real Account.', it.website_name)}</p>
                    </li>
                    <li>{it.L('Transfer of funds from the MT5 Real Account')}
                        <p>{it.L('If the Client has a positive balance in their MT5 Real Account, they may transfer such balance from their MT5 Real Account into their [_1] account and then request a withdrawal as necessary for any amount available on their [_1] account. The Company may withhold, deduct, or refuse to make any such transfer or withdrawal, in whole or in part, if', it.website_name)}</p>
                        <ol>
                            <li>{it.L('The Client has Open Positions on the account that show a loss.')}</li>
                            <li>{it.L('Such a transfer would result in the Client\'s Account Equity dropping to less than zero.')}</li>
                            <li>{it.L('The requested transfer would reduce the Client\'s Account Balance to less than the Margin required for the Client\'s Open Positions.')}</li>
                            <li>{it.L('The Company reasonably considers that funds may be required to meet any current or future Margin Requirements on Open Positions due to the underlying market conditions.')}</li>
                            <li>{it.L('The Company reasonably determines that there is an unresolved dispute between the Company and the Client relating to the agreed terms and conditions.')}</li>
                            <li>{it.L('There is an amount outstanding from the Client to BIEL.')}</li>
                            <li>{it.L('BIEL is required to do so in accordance with any relevant law or regulation.')}</li>
                        </ol>
                        <p>{it.L('The Client\'s MT5 Real Account as well as all payments and withdrawals therefrom must be made in the same currency as maintained in the Client\'s [_1] account.', it.website_name)}</p>
                    </li>
                    <li>{it.L('Negative Balance Protection')}
                        <p>{it.L('When using the MT5 trading platform, all BIEL\'s clients will be provided with Margin monitoring functionality to protect the Clients from encountering negative balances when trading under normal market conditions. As a trader, the Client should always maintain the appropriate levels of Margin in their trading account as the recommended method of their own risk management.')}</p>
                        <p>{it.L('If the Client\'s usable Margin drops below 100%, a Margin Call mode will be triggered and maintained till the level of 50%. In the event that the Client\'s Margin Level is equal to, or drops below 50%, the Company will initiate the closing of the Client\'s current Open Positions, starting from the most unprofitable, until the required Margin Level is achieved. In such events, the positions will be automatically closed at the current market price at that point in time.')}</p>
                        <p>{it.L('In exceptional circumstances, where there is a price change in the underlying that is sufficiently large and sudden, gapping can occur. In such cases, the automatic Margin close-out protection might fail, causing the Client\'s Account Balance to fall below zero. For this purpose, a Negative Balance Protection mechanism has been introduced. Negative Balance Protection provides a \'backstop\' in case of extreme market conditions and ensures that the Client\'s maximum losses from trading CFDs, including all related costs, are limited to the balance available on the Client\'s CFD account. Therefore, the Client can never lose more money than the total sum invested for trading CFDs; if the Client\'s CFD account balance falls below zero, the Company will compensate the negative balance as soon as possible without any additional cost to the Client.')}</p>
                        <p>{it.L('Negative Balance Protection does not apply to the Clients categorised as Professional Traders, who can still lose more money than their available balance.')}</p>
                        <p>{it.L('The Company does not offer credit to its Clients. The Client acknowledges and agrees that they will not be dealing with the Company on credit.')}</p>
                    </li>
                </ol>
            </li>
            <li><strong>{it.L('Account closure')}</strong>
                <p>{it.L('If the Client wishes to withdraw funds from their MT5 Real Account and/or close their MT5 Real Account, the Client may notify the Company by contacting the helpdesk at [_1]. The Client\'s MT5 Real Account may be closed if the Client does not have any Open Positions and all amounts due to the Company have been settled.', '<a href="mailto:support@binary.com">support@binary.com</a>')}</p>
            </li>
        </ol>

        <h2 data-anchor='market-execution'>{it.L('Market execution')}</h2>
        <p>{it.L('On the MT5 trading platform, the Client will benefit from direct market access that gives the Client the opportunity to receive the best possible price in the market at a specified time, without having to use a dealing desk.')}</p>
        <p>{it.L('As a result, the Client\'s trades are executed at market as follows:')}</p>
        <ol>
            <li>{it.L('The price of the Client\'s chosen investment appears on the platform/on the Client\'s screen.')}</li>
            <li>{it.L('By clicking buy or sell, the Client\'s Order will be filled at the best possible price with either one of the Company\'s liquidity providers or on the Company\'s own books (according to the best streaming price at the time of the Client\'s Order placement).')}</li>
            <li>{it.L('When the Order hits the liquidity provider\'s server, or the Company\'s server in case the Order is taken on BIEL\'s own books, it is fulfilled.')}</li>
        </ol>
        <p>{it.L('The Client is advised to note that prices can change very quickly in the market, so the execution price may not necessarily be visible instantly once the Order has been filled.')}</p>
        <p>{it.L('The Client is also reminded that their internet connection can influence what price is displayed after the trade has been executed.')}</p>

        <h2 data-anchor='expert-advisors'>{it.L('Expert Advisors')}</h2>
        <p>{it.L('Expert Advisors, including any additional functions/plug-ins of trading operations provided by or developed using Expert Advisors, are applications developed using the MetaQuotes Language which can be used to analyse price charts and automate the Client\'s trades.')}</p>
        <p>{it.L('Expert Advisors, made available on the MT5 trading platform, are owned by MetaQuotes Software Corporation (the MT5 trading platform licensor) and shall remain the exclusive property of MetaQuotes Software Corporation.')}</p>
        <p>{it.L('The Company is an independent legal entity and is not affiliated with the MT5 trading platform. MT5 is not owned, controlled, or operated by the Company. Therefore, the Company does not provide any warranties related to any MT5 product or service and has not reviewed or verified any performance results that may be presented and/or described on this website in relation to MT5.')}</p>
        <p>{it.L('There are no restrictions to the use of Expert Advisors on the MT5 trading platform apart from unethical trading.')}</p>

        <p>{it.L('As an example, Expert Advisors might be able to be programmed for')}</p>
        <ol>
            <li>{it.L('Alerting Clients of a potential trading opportunity')}</li>
            <li>{it.L('Execution of trades automatically on their behalf')}</li>
            <li>{it.L('Managing of various aspects of online trading such as sending Orders to the platform')}</li>
            <li>{it.L('Automatic adjustments of Take Profit levels')}</li>
            <li>{it.L('Trailing stops')}</li>
            <li>{it.L('Stop Loss Orders')}</li>
        </ol>
        <p>{it.L('Before using the trading robots or Expert Advisors and forward trade, the Client should test it on a demo account.')}</p>
        <p>{it.L('Actual trading results may not correspond to optimised or back-tested results.')}</p>
        <p>{it.L('All software is to be used at the Client\'s own risk. The Company will not be liable for any financial losses incurred using a third-party software. The Company is not associated with the development of the automated trading software or the Expert Advisors because they are exclusively developed and supported by third parties and not by the Company. The Company does not receive any form of financial and/or other benefits from permitting Expert Advisors to be used.')}</p>
        <p>{it.L('The Client shall accept the risk of using any additional functions provided by the Expert Advisor on the MT5 trading platform. The Company has no responsibility for the outcome of such trading and reserves the right to accept or reject the use of such functions with absolute discretion.')}</p>
        <p>{it.L('Where such additional functions/plug-ins affect the reliability and/or smooth operation and/or orderly functioning of the MT5 trading platform, the Company has the right to immediately terminate its contractual relationship with its Clients by written notice.')}</p>
        <p>{it.L('By using the electronic trading system, including the MT5 trading platform, Clients accept full responsibility for using such platforms and for any Orders transmitted via such platforms.')}</p>
        <p>{it.L('The Company does not accept any liability for any inconsistencies or results related to the Clients utilising Expert Advisors on the MT5 trading platform. Clients are liable for their use of Expert Advisors and the trading activity they conduct. The Company takes a neutral position on the Clients\' use of Expert Advisors.')}</p>
        <p>{it.L('All unforeseen openings or closings of positions initiated by the Expert Advisor, whether relevant to system error or otherwise, are out of the scope of the Company\'s responsibility; hence the Company is not liable for such actions or results.')}</p>

        <h2 data-anchor='governing-law-and-jurisdiction'>{it.L('Governing law and jurisdiction')}</h2>
        <p>{it.L('These ST&Cs are to be governed by and construed in accordance with Maltese law, and the parties hereto agree to submit to the non-exclusive jurisdiction of the Maltese courts.')}</p>
    </div>
);

export default BIEL;
