import React from 'react';

const RiskDisclaimer = () => (
    <div>
        <h2 data-anchor='risk-disclaimer'>{it.L('Risk Disclaimer')}</h2>
        <p>{it.L('This notice provides you with information about the risks associated with investment contracts, which you may invest in through services provided to you through [_1].', it.website_name)}</p>
        <p>{it.L('Binary Group members are sometimes referred to collectively as "[_1]", "us" or "we".', it.website_name)}</p>
        <p>{it.L('This notice does not explain all of the risks involved in investments or similar products or how such risks relate to your personal circumstances. It is important that you fully understand the risks involved before making a decision to enter into any product with us. If you are in any doubt about the risks involved, you should seek professional advice.')}</p>
        <p>{it.L('If you choose to enter into a Contract with us, it is important that you remain aware of the risks involved, that you have adequate investment resources to bear such risks and that you monitor your positions carefully.')}</p>

        <h2 data-anchor='general-risks'>{it.L('General Risks')}</h2>
        <p />

        <h4>{it.L('No Advice')}</h4>
        <p>{it.L('Our services are provided on an execution only basis. We do not provide investment advice in relation to our products or services. We sometimes provide factual information or research recommendations about a market, information about transaction procedures and information about the potential risks involved and how those risks may be minimised. However, any decision to use our products or services is made by you.')}</p>
        <p>{it.L('You are responsible for managing your tax and legal affairs including making any regulatory filings and payments and complying with applicable laws and regulations. We do not provide any regulatory, tax or legal advice. If you are in any doubt as to the tax treatment or liabilities of any products available through [_1], you may wish to seek independent advice.', it.website_name)}</p>

        <h4>{it.L('Appropriateness')}</h4>
        <p>{it.L('Investment Products to EEA Residents are provided by Binary Investments (Europe) Ltd ("BIEL") which is authorised and regulated by the Malta Financial Services Authority under the Malta Investment Services Act to deal on own account in Investment Products.')}</p>
        <p>{it.L('Before we open an account for you to trade or invest in Investment Products with BIEL, we are required to make an assessment of whether the Investment Products or services you have chosen are appropriate for you, and to warn you if, on the basis of the information you provide to us, any such product or service is not appropriate. Any decision to open an account and to use our products or services is yours. It is your responsibility to understand the risks involved with our products or services.')}</p>
        <p>{it.L('During our application process, we may ask you for information about your background, experience as well your investment assets and earnings. We do not monitor on your behalf whether the amount of money you have sent to us or your profits or losses are consistent with that information. It is up to you to assess whether your investment resources are adequate for your investment activity with us and your risk appetite in the products and services you use.')}</p>

        <h4>{it.L('Need to Monitor Positions')}</h4>
        <p>{it.L('It is important that you monitor all of your positions closely. It is your responsibility to monitor your positions and during the period that you have any open Contracts, you should always have the ability to access your Accounts.')}</p>

        <div data-show='eucountry'>
            <h4>{it.L('Default')}</h4>
            <p>{it.L('Since BIEL is a member of the Malta Investor Compensation Scheme, you are covered for the first €20,000 of any claim you may have in the unlikely event of BIEL suffering an investment default and not being able to meet its obligations. This protection is available only to retail clients. Neither professional clients nor eligible counterparties can benefit from this protection.')}</p>
        </div>

        <h2 data-anchor='contract-risks'>{it.L('Contract Risks')}</h2>
        <p>{it.L('You should not trade or invest in Binary Options unless you know and understand the features risks involved and you may lose all the money invested.')}</p>
        <p>{it.L('"Binary" or "digital" options are options that pay a pre-determined, fixed amount, depending on whether or not an event occurs at the time the Binary Option expires. Binary Options can have only one of two possible outcomes and allow you to take a simple "Yes or No" approach. Like traditional options, Binary Options are based on an underlying asset such as currencies, commodities, or indices, however one of the most significant differences from traditional options, among others, is that there can be only two outcomes for the option, either the client is paid the return upon the occurrence of the event, or the client loses the investment amount as determined in each option.')}</p>
        <p>{it.L('Trading in Binary Options is speculative and involves a high degree of risk that can result in the loss of your entire investment. Therefore, trading in Binary Options is appropriate only for persons that understand and are willing to assume the economic, legal and other risks involved in such transactions. You should be satisfied that Binary Options trading is suitable for you in light of your investment circumstances and attitude towards risk before trading. You should not engage in speculative Binary Options trading unless you understand the basic aspects of such trading and its risks. If you are in any doubt as to whether Binary Option trading is appropriate and suitable for you, please seek independent advice from a investment consulting professional. [_1] does not provide such advice. It is your responsibility, taking into account your personal circumstances and investment resources, to take particular care and make careful considerations independently, both prior to applying to engage in Binary Options with [_1], as well as prior to making any individual order. Where you do not understand the risks involved in applying for a trading account with [_1] or in making any individual order, you should seek advice and consultation from an independent investment advisor. If you continue to not understand the risks involved in trading in Binary Options, you should not trade at all.', it.website_name)}</p>
        <p>{it.L('You are advised that the Binary Options offered by [_1] are not traded under the rules of any recognised, designated or regulated exchange. Consequently, engaging in Binary Options trading may expose you to substantially greater risks than investments which are so traded.', it.website_name)}</p>
        <p>{it.L('You are warned of the following additional risks:')}</p>
        <p>{it.L('Derivative investment instruments such as Binary Options and related markets can be highly volatile. The prices of the underlying instrument which a Binary Option refers to may fluctuate rapidly and over wide ranges and may reflect unforeseeable events or changes in conditions, none of which can be controlled by you or [_1].', it.website_name)}</p>
        <p>{it.L('[_1] makes efforts that the quoted prices of each underlying asset that a Binary Option refers to will be reasonably related to the actual prices of such asset available in the market. [_1] makes no warranty, expressed or implied, that the quoted prices represent prevailing market prices.', it.website_name)}</p>
        <p>{it.L('[_1] may have access to information that is not available to you, may have acquired trading positions at prices that are not available to you, and may have interests different from your interests. [_1] does not undertake any obligation to provide you with market or other information we possess, nor to alter or refrain from our own trading.', it.website_name)}</p>
        <p>{it.L('Information of the previous performance of any underlying instrument or asset does not guarantee its current and/or future performance. Past performance is not a reliable indicator of future results.')}</p>

        <h2 data-anchor='risks-of-investment-products'>{it.L('Risks of Investment Products')}</h2>
        <p>{it.L('Investing or trading in Contracts exposes you to the performance of the underlying or reference instrument or asset to which the Binary Contract refers including foreign exchange, indices and commodities each of which have their own features and risks.')}</p>
        <p>{it.L('<strong>Exchange Rate Risk</strong>: Exchange rates between foreign currencies can change rapidly due to a wide range of economic, political and other conditions, exposing you to risk of exchange rate losses in addition to the inherent risk of loss from trading the underlying investment product. If you deposit funds in a currency to trade Contracts denominated in a different currency, your gains or losses on the underlying investment therefore may be affected by changes in the exchange rate between the currencies.')}</p>
        <p>{it.L('<strong>Other Risks</strong>: There are other risks that relate to trading investment products and trading foreign currencies that cannot be described in detail in this document. Generally, however, securities, options and currency transactions involve exposure to a combination of the following risk factors: market risk, credit risk, settlement risk, liquidity risk, operational risk and legal risk. For example, there can be serious market disruptions if economic or political or other unforeseen events locally or overseas affect the market. In addition to these types of risk there may be other factors such as accounting and tax treatment issues that you should consider.')}</p>

        <h2 data-anchor='market-opinions'>{it.L('Market Opinions')}</h2>
        <p>{it.L('All opinions, news, research, analysis, prices or other information contained on this website are provided as general market commentary and do not constitute investment advice. [_1] will not accept liability for any loss or damage, including but without limitation to, any loss of profit that may arise directly or indirectly from use of or reliance on such information.', it.website_name)}</p>

        <h2 data-anchor='internet-trading-risks'>{it.L('Internet Trading Risks')}</h2>
        <p>{it.L('There are risks associated with utilizing an Internet-based deal execution trading system, including but not limited to the failure of hardware, software and Internet connection. Since [_1] does not control signal power, its reception or routing via Internet, configuration of your equipment or reliability of its connection, we cannot be responsible for communication failures, distortions or delays when trading via the Internet.', it.website_name)}</p>

        <h2 data-anchor='accuracy-of-information'>{it.L('Accuracy of Information')}</h2>
        <p>{it.L('The content on this website is subject to change at any time without notice and is provided for the sole purpose of assisting traders in making independent investment decisions. [_1] has taken reasonable measures to ensure the accuracy of the information on the website.', it.website_name)}</p>

        <h2 data-anchor='costs-and-charges'>{it.L('Costs and Charges')}</h2>
        <p>{it.L('Our costs and charges for depositing and withdrawing money are set out [_1]here[_2]. Please be aware of all costs and charges that apply to you because they will affect your profitability.', `<a href="${it.url_for('cashier/payment_methods')}">`, '</a>')}</p>
    </div>
);

export default RiskDisclaimer;
