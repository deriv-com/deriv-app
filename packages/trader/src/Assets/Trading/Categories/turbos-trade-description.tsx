import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

export const TurbosTradeDescription = () => {
    const content = [
        {
            type: 'paragraph',
            text: localize(
                'Predict the market direction, size and also how confident you are that the spot price will not touch the barrier.'
            ),
        },
        {
            type: 'paragraph',
            text: localize(
                'If you select “Long”, you will earn a payout if the spot price never touches the barrier, that is the spot price is always above the barrier. Your payout will grow proportionally according to the distance between the market price and the barrier, with the condition that the spot didn’t cross the barrier at any time during the trade. If the spot price touches or breaches the barrier during the trade, then there won’t be a payout. Select a “Long” contract if you think the market will grow strongly without falling.'
            ),
        },
        {
            type: 'paragraph',
            text: localize(
                'If you select “Short”, you will earn a payout if the spot price never touches the barrier, that is the spot price is always below the barrier. Your payout will grow proportionally according to the distance between the market price and the barrier, with the condition that the spot didn’t cross the barrier at any time during the trade. If the spot price touches or breaches the barrier during the trade, then there won’t be a payout. Select a “Short” contract if you think the market will decay strongly without rising.'
            ),
        },
        {
            type: 'paragraph',
            text: localize(
                'Barrier is the level where if the spot price crosses this, then this option will go worthless. This is also used in the calculation of the payout per point. It is expressed in a distance from the spot. Select a further distance to have a lower chance of options getting worthless.'
            ),
        },
        {
            type: 'paragraph',
            text: localize(
                'We’ve limited the maximum payout for every contract, and it differs for every asset. Your contract will be closed automatically when the maximum payout is reached.'
            ),
        },
        {
            type: 'paragraph',
            text: localize('You will earn a profit if the payout is higher than the stake.'),
        },
        {
            type: 'paragraph',
            text: localize(
                'You can determine the expiry for your contract by setting the duration and you can also sell your contract early.'
            ),
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ type, text }, index) => (
                <Text as='p' key={index.toString() + type}>
                    {text}
                </Text>
            ))}
        </React.Fragment>
    );
};
