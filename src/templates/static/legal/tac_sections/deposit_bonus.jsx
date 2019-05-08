import React from 'react';

const DepositBonus = () => (
    <div>
        <h2 data-anchor='deposit-bonus'>{it.L('Deposit Bonus')}</h2>
        <p>{it.L('This bonus will be processed and credited to a client\'s account when:')}</p>
        <ol>
            <li>{it.L('The required minimum deposit has been made by the client AND')}</li>
            <li>{it.L('The client has reached a turnover that is 5 times the bonus amount')}</li>
        </ol>
        <p>{it.L('Both the deposit and the bonus amounts are clearly displayed when this type of promotion is available. E.g. Get $25 when you deposit $100. By way of example, if you choose to participate in a "Get $25 when you deposit $100" promotion, we will add an additional $25 to your account when you deposit $100 AND when you have purchased at least $125 worth of trades ($25 * 5= $125). The bonus will only be credited to your account when both of these conditions are met.')}</p>
        <p>{it.L('Once the bonus is credited to your account, you may withdraw the bonus and any winnings generated from it at any time.')}</p>
        <p>{it.L('Clients may utilise this bonus only when a real money account is opened.')}</p>
        <p>{it.L('This bonus is only available to new clients. Existing or former clients do not qualify. New clients are eligible for this type of bonus only once. This bonus is available only once per household.')}</p>
        <p>{it.L('This offer cannot be used in conjunction with any other offer.')}</p>
        <p>{it.L('The bonus will be added to the account when the required minimum deposit has been made via a single transaction. Clients who make multiple deposits in an attempt to accumulate the required deposit amount will not be eligible for this bonus.')}</p>
        <p>{it.L('The company reserves the right to cancel/prohibit the use of this promotion at its own discretion at any time.')}</p>
        <a id='free-bonus' href='javascript:;' />

        <h2 data-anchor='free-bonus'>{it.L('Free Bonus')}</h2>
        <ol>
            <li>{it.L('The bonus code can only be entered and activated upon account opening.')}</li>
            <li>{it.L('It will be released to your account upon approval.')}</li>
            <li>{it.L('This promotion is only available to new Clients. Existing or former Clients do not qualify. It is only available once to each Client.')}</li>
            <li>{it.L('This offer cannot be used in conjunction with any other offer.')}</li>
            <li>{it.L('You may withdraw the bonus amount once you have exceeded an account turnover of 25 times the bonus amount value.')}</li>
            <li>{it.L('Where an account is funded solely by means of a bonus code, the bonus amount plus any winnings cannot be withdrawn until you have exceeded an account turnover of 25 times the bonus amount value. The maximum amount of winnings allowed on such accounts shall be 25 times the amount of such bonus amount.')}</li>
            <li>{it.L('The company reserves the right to cancel/prohibit the use of this promotion at its own discretion at any time.')}</li>
        </ol>
    </div>
);

export default DepositBonus;
