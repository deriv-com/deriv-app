import React from 'react';

const OrderExecution = () => (
    <div>
        <h2 data-anchor='summary-order-execution-policy'>{it.L('Summary of the order execution policy')}</h2>
        <p>{it.L('The Company has a general duty to conduct its business with the client honestly, fairly, and professionally and to act in the client\'s best interests when opening and closing Binary Options trades with the client.')}</p>
        <p>{it.L('More specifically, when the Company enters into a Binary Option trade with the client (each, a "Contract"), the Company has a duty to provide the client with \'best execution\'. Best execution means that the Company must take reasonable steps to obtain the best possible result for the client when executing a client order. This document provides a summary of the Company\'s best execution policy.')}</p>
        <p>{it.L('The client should note that the Company\'s duty to provide the client with best execution does not apply to any gambling products that the client places with the Company when there is no underlying financial market.')}</p>
        <p>{it.L('This policy applies to clients classified as retail or professional. Clients classified as eligible counterparties are outside the scope of this policy.')}</p>

        <h2 data-anchor='general'>{it.L('General')}</h2>
        <p>{it.L('The Company\'s order execution policy comprises a set of procedures that are designed to obtain the best possible execution result for the client, subject to and taking into account the following factors:')}</p>
        <ul>
            <li>{it.L('(a) The nature of the client\'s Contracts')}</li>
            <li>{it.L('(b) The priorities that the client has identified for the Company in relation to entering into those Contracts')}</li>
            <li>{it.L('(c) The practices relating to the market in question, with the aim of producing a result that provides, in the Company\'s view, the best balance across a range of sometimes conflicting factors')}</li>
        </ul>
        <p>{it.L('The Company\'s policy cannot provide a guarantee, however, that when entering into Contracts with the client, the price will always be better than one that is or might have been available elsewhere.')}</p>

        <h2 data-anchor='order-execution'>{it.L('Order execution')}</h2>
        <p>{it.L('The Company is licensed to deal in derivatives on its own account. Client orders will be executed by the Company and the Company will always be the client\'s sole execution venue for all of the trades a client makes in binary options. This means that the Company will always act as the client\'s counterparty, wherein it takes the other side of the client\'s trade. The clients should be aware that they are exposed to higher risks as all Binary Options contracts are traded on over-the-counter (OTC) markets, as opposed to regulated exchanges. This section of the policy will outline how the Company intends to comply with its best execution obligations.')}</p>

        <h2 data-anchor='classes-of-instruments'>{it.L('Classes of instruments')}</h2>
        <p>{it.L('The Company offers binary options through its online interactive platform.')}</p>
        <p>{it.L('A binary option is a contract in which one party undertakes to pay the other party a specified amount if the value of a given asset changes in a specific direction within a predetermined period. The three major underlying asset classes for binary options offered by the Company are')}</p>
        <ul className='bullet'>
            <li>{it.L('Forex')}</li>
            <li>{it.L('Indices')}</li>
            <li>{it.L('Commodities')}</li>
        </ul>

        <h2 data-anchor='best-execution-factors'>{it.L('Best execution factors')}</h2>
        <p>{it.L('In relation to Contracts that the client enters into with the Company, the Company acts as principal and not as agent on the client\'s behalf; therefore, the Company acts as the sole execution venue for the execution of the client\'s Contracts.')}</p>
        <p>{it.L('The Company will mainly ensure best execution for the client by giving due consideration to the market price when calculating the Company\'s bid/offer price for the underlying reference product to which the client\'s Contract relates. In order to ascertain the market price, the Company has access to a number of different data sources, which provide the Company with an objective view of the bids and offers available to arms\' length traders.')}</p>
        <p>{it.L('In the case of some Contracts, there may be no functioning or open market or exchange on which the reference product is traded at the time of the client order. In such cases, the Company sets out to determine a fair underlying price based on a number of factors, such as price movements on associated markets and other market influences and information about the client order.')}</p>
        <p>{it.L('The Company is required to take a number of factors into account when considering how to give the client best execution, specifically:')}</p>
        <ul>
            <li>
                {it.L('(a) Price and cost')}
                <p>{it.L('The Company has internally set appropriate controls and monitoring to verify that its aggregate return on various underlying options and durations is equal to its commission charge of 3 - 5%. Proper back-testing is conducted on a quarterly basis to certify that the Company\'s return does not exceed this set mark-up and hence ascertain continued fair prices to the clientele, whilst mitigating the Company\'s conflicts of interest.')}</p>
            </li>
            <li>
                {it.L('(b) Speed')}
                <p>{it.L('Due to the online nature of the business and instruments, there is a small delay between an order being entered and the same order being executed on the server. Any significant delay can have negative impacts on clients; therefore, the Company monitors the latency between the entering and execution of client orders. Should this delay exceed the established threshold, then the system administrators will be notified so that they can investigate any possible issue.')}</p>
            </li>
            <li>
                {it.L('(c) Likelihood of execution')}
                <p>{it.L('The Company strives to ensure that all the orders placed are executed; however, this is not always possible due to material difficulty or unusual circumstances. In any instance that the Company is aware of any material difficulty relevant to the proper execution of an order, it promptly informs the client of the issue.')}</p>
            </li>
            <li>
                {it.L('(d) Likelihood of settlement')}
                <p>{it.L('During volatile markets, the Company\'s trading platform runs across a high number of concurrent online users, high volumes of client orders, and a high number of imported price ticks.  As part of the Company\'s best execution delivery to its clients, the Company ensures that its platform runs smoothly under such stressed conditions and takes all reasonable steps to safeguard the continuity and regularity in the performance of investment activities.')}</p>
            </li>
            <li>
                {it.L('(e) Size and nature')}
                <p>{it.L('Orders will generally be auto-accepted if they do not take the Company over exposure limits and the client has enough remaining balance in their account. With every contract purchased, the Company has systems in place that automatically carry out a large exposure check, and, in case the new total exposure result is greater than or equal to 25% of the eligible capital, the contract cannot be sold to the client.')}</p>
            </li>
        </ul>

        <h2 data-anchor='specific-instructions'>{it.L('Specific instructions')}</h2>
        <p>{it.L('When the client gives the Company specific instructions, including (a) specifying the price of a Contract with the Company or (b) specifying the price at which a Contract is to be closed, then those instructions take precedence over other aspects of the Company\'s policy.')}</p>

        <h2 data-anchor='no-fiduciary-duty'>{it.L('No fiduciary duty')}</h2>
        <p>{it.L('The Company\'s commitment to provide the client with \'best execution\' does not mean that the Company owes the client any fiduciary responsibilities over and above the specific regulatory obligations placed upon the Company or as may be otherwise contracted between the Company and the client.')}</p>

        <h2 data-anchor='monitoring-and-review'>{it.L('Monitoring and review of this policy')}</h2>
        <p>{it.L('The Company will monitor the effectiveness of its order execution arrangements and order execution policy. The Company will assess from time to time whether the venues relied upon by the Company in pricing its Contracts on the client\'s behalf allow the Company to achieve best execution on a consistent basis or whether the Company needs to make changes to its execution arrangements. The Company will also review its order execution arrangements and order execution policy in respect of material changes, either regarding one of the Company\'s chosen pricing venues or what might otherwise affect the Company\'s ability to continue to achieve best execution. Should there be any material changes to the Company\'s order execution arrangements or order execution policy, the Company will notify the client.')}</p>
    </div>
);

export default OrderExecution;
