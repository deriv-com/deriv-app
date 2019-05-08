import React from 'react';

const OrderExecution = () => (
    <div>
        <h2 data-anchor='order-execution-policy'>{it.L('Order execution policy')}</h2>

        <h2 data-anchor='introduction'>{it.L('A. Introduction')}</h2>
        <p>
            {it.L('The terms \'the Company\' and \'[_1]\' shall denote', it.website_name)}&nbsp;
            <span data-show='-eucountry'>{it.L('Binary (V) Ltd,')}&nbsp;</span>
            <span data-show='-eucountry'>{it.L('Binary (FX) Ltd, or')}&nbsp;</span>
            <span>{it.L('Binary Investments (Europe) Ltd.')}</span>
        </p>

        <p>{it.L('The Company\'s order execution policy (the "Policy") sets out the overview and approach of how [_1] executes orders on behalf of the Company\'s clients.', it.website_name)}</p>
        <p>{it.L('The Policy is supplemented by Appendix A, which provides further details to the Company\'s considerations as they are related to differing asset classes. The accompanying Appendix A should be read in conjunction with this Policy.')}</p>

        <h2 data-anchor='scope'>{it.L('B. Scope')}</h2>
        <p>{it.L('This Policy applies to retail and professional clients of [_1] dealing in financial products offered by [_1].', it.website_name)}</p>

        <h2 data-anchor='definition-of-best-execution'>{it.L('C. Definition of best execution')}</h2>
        <p>{it.L('Best execution is the requirement to take all sufficient steps to obtain, when executing orders, the best possible result for the client taking into account price, costs, speed, likelihood of execution and settlement, size, nature, or any other consideration relevant (hereinafter referred to as the "Execution Factors") to the execution of the order.')}</p>

        <h2 data-anchor='client-instructions'>{it.L('D. Client instructions')}</h2>
        <p>{it.L('When the Company accepts an order from the client to open or close a transaction, or any other specific instructions in relation to the client\'s order, the Company will endeavour to follow the client\'s instructions as far as reasonably possible, acting in accordance with the Company\'s duty of best execution in accordance with the client\'s instructions. These specific instructions include, but are not limited to:')}</p>
        <ul>
            <li>a)&nbsp;{it.L('the venue at which the client\'s order will be executed;')}</li>
            <li>b)&nbsp;{it.L('the price at which the client\'s order will be executed;')}</li>
            <li>c)&nbsp;{it.L('the time at which the client\'s order will be executed; and')}</li>
            <li>d)&nbsp;{it.L('the timeframe or duration of the contract as defined by the client\'s order execution.')}</li>
        </ul>
        <p>{it.L('Where a particular venue has been specified in the client\'s instructions with respect to the execution of an order, the Company will not be responsible for the venue selection.')}</p>
        <p>{it.L('Where a particular time or timeframe has been specified in a client\'s instructions with respect to the execution of an order, regardless of the price available, the Company will endeavour to execute the order at the specified time or over the specified timeframe in the best possible manner after taking all sufficient steps. However, the Company will not be responsible for any consequences related to pricing that are resulted from the time or timeframe of the execution.')}</p>
        <p>{it.L('Aspects of a client order not affected by specific instructions are subject to the application of [_1]\'s order execution policy. In the absence of specific instructions from clients, the Company will exercise its own discretion in determining the factors that are required to be taken into account for the purpose of providing clients with best execution, paying regard to the execution criteria listed below:', it.website_name)}</p>
        <ul className='bullet'>
            <li>{it.L('the characteristics of the client')}</li>
            <li>{it.L('the characteristics of the order')}</li>
            <li>{it.L('the characteristics of financial instruments that are the subject of that order')}</li>
            <li>{it.L('the characteristics of the execution venues to which that order can be directed')}</li>
        </ul>

        <h2 data-anchor='best-execution-obligation'>{it.L('E. Best execution obligation')}</h2>
        <p>{it.L('[_1] owes the client a duty of best execution when executing orders on the client\'s behalf, i.e. when the client places a legitimate reliance on the Company to safeguard the client\'s interest in relation to the execution of the client\'s order.', it.website_name)}</p>
        <p>{it.L('In executing orders on the client\'s behalf, [_1] takes into consideration the following to achieve the best possible result for the client:', it.website_name)}</p>
        <ul className='bullet'>
            <li>{it.L('price - the price at which the transaction in relation to the client\'s order is executed')}</li>
            <li>{it.L('costs - the costs of executing client order, predominantly comprising of spread, i.e. the difference between the Company\'s bid and the Company\'s offer price')}</li>
            <li>{it.L('speed - the speed at which client order can be executed')}</li>
            <li>{it.L('likelihood of execution and settlement - the depth of liquidity of the market to which client order is related')}</li>
            <li>{it.L('size - the size of client order determined by the volume (number of lots)')}</li>
            <li>{it.L('any other consideration relevant to the execution of the transaction')}</li>
        </ul>
        <p>{it.L('The factors listed above are not listed in order of priority. Ordinarily, price will merit a high relative importance in obtaining the best possible result for the client. However, the relative importance of the listed factors above may change in accordance with:')}</p>
        <ul className='bullet'>
            <li>{it.L('the specific instructions that the Company receives from the client;')}</li>
            <li>{it.L('the market conditions of the financial instruments that client orders are related to, which includes the need for timely execution, availability of price improvement, liquidity of the market, size of client order, and the potential impact on total consideration.')}</li>
        </ul>
        <p>{it.L('The Company\'s determination of the relative importance of the execution factors may differ from the client\'s during certain circumstances, acting in the client\'s interest in accordance with the Company\'s obligation of best execution.')}</p>

        <h2 data-anchor='execution-venues'>{it.L('F. Execution venues')}</h2>
        <p>{it.L('[_1] offers Forex and contracts for differences via the hybrid model, i.e. dealing on own account (dealing desk – B-book) or partially hedging client orders with the Company\'s liquidity providers (no-dealing desk – A-book).', it.website_name)}</p>
        <p>{it.L('When the Company deals on own account (dealing desk), the Company acts as principal and not as an agent on the client\'s behalf and the Company therefore acts as the execution venue.')}</p>
        <p>{it.L('Whilst the Company acts as principal in respect of the client\'s orders, the Company also assesses the execution venues that the Company uses and upon which the Company places significant reliance to provide the best possible result for the execution of the client\'s orders. These venues typically consist of third-party investment firms, brokers, and/or liquidity providers.')}</p>
        <p>{it.L('[_1] assesses the choice of external execution venues regularly (at least once a year) with the intention of achieving a better result for the client based on the Company\'s best execution obligation.', it.website_name)}</p>
        <p>{it.L('When executing client orders using the A-book model, the Company directs the client\'s trade to one of its liquidity providers, namely:')}</p>
        <ul className='bullet'>
            <li>{it.L('GBE Brokers;')}</li>
            <li>{it.L('Invast Financial Services Pty Ltd;')}</li>
            <li>{it.L('FXOpen; or')}</li>
            <li>{it.L('CFH Clearing Limited.')}</li>
        </ul>

        <h2 data-anchor='order-handling'>{it.L('G. Order handling')}</h2>
        <p>{it.L('All client orders are processed on a first in, first out basis without any manual intervention. When executing client order, [_1] will seek to fill client order transaction as promptly as possible at the instructed price (or at a better price, if available). Exposure limits are established based on internal governance arrangements and risk management framework, which both commensurate with the size, nature, complexity, and risk profile of the Company\'s activities. These exposure limits are used as benchmarks to distinguish orders that are auto-accepted from orders that will be worked in the market with fill level passed on to the client.', it.website_name)}</p>

        <h2 data-anchor='monitoring-and-review'>{it.L('H. Monitoring and review')}</h2>
        <p>{it.L('The Company will monitor the effectiveness of the Company\'s order execution arrangements and order execution policy. The Company will assess from time to time whether the venues relied upon by the Company in pricing the Company\'s contracts on the client\'s behalf allow the Company to achieve best execution on a consistent basis or whether the Company needs to make changes to the Company\'s execution arrangements. The Company will also review the Company\'s order execution arrangements and order execution policy in respect of material changes either in respect of one of the Company\'s chosen pricing venues or what otherwise affects the Company\'s ability to continue to achieve best execution. Should there be any material changes to the Company\'s order execution arrangements or order execution policy, the Company will notify the client.')}</p>

        <h2 data-anchor='appendix-product-specific-policies'>{it.L('Appendix - Product specific policies')}</h2>

        <h2 data-anchor='spot-fx'>{it.L('A. Spot FX')}</h2>
        <p>{it.L('For features and trading illustration of Spot FX offered by [_1], refer to the Product disclosure statement. This policy is an appendix to, and should be read in conjunction with, the overarching [_1]\'s order execution policy.', it.website_name)}</p>
        <p>{it.L('[_1] provides the client with best execution by utilising a smart aggregation method when managing incoming orders. The smart aggregation method works by:', it.website_name)}</p>
        <ul className='bullet'>
            <li>{it.L('consolidating liquidity from several providers into a single stream of blended feed; and')}</li>
            <li>{it.L('intelligently routing incoming orders to different types of execution modes based on configurations and algorithms established using best execution factors.')}</li>
        </ul>
        <p>{it.L('By default, the intelligent order routing system ensures that the top of the book is always comprised of the best bid and offer rates quoted by the competing liquidity providers. However, during times of market illiquidity, this may change with likelihood of execution being the primary execution factor.')}</p>
        <p>{it.L('Depending on the level of risk that the Company is exposed to while acting as the client\'s counterparty, the Company acts largely in a principal capacity of the client\'s trades. As such, the execution venue will usually be [_1]. However, the Company may transmit the client\'s order to third-party liquidity providers, in which case the Company will determine the execution venue on the basis described above.', it.website_name)}</p>
        <p>{it.L('The execution venues are assessed, on a regular basis, as to whether they provide for the best possible result for the clients.')}</p>
    </div>
);

export default OrderExecution;
