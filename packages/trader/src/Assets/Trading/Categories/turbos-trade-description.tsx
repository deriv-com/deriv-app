import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Text } from '@deriv/components';

export const TurbosTradeDescription = () => {
    const content = [
        {
            type: 'paragraph',
            text: localize(
                'This product allows you to express a strong bullish or bearish view on an underlying asset.'
            ),
        },
        { type: 'heading', text: localize('For Long:') },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you think the market price will rise continuously for a specific period, choose <0>Long</0>. You will get a payout at the expiry time if the market price doesn’t touch or cross below the barrier. Your payout will grow proportionally to the distance between the market price and the barrier if the barrier is not breached. You will start making a profit when the payout is higher than your stake. If the market price ever crosses the barrier, there won’t be a payout.'
                    components={[<Text key={0} as='span' weight='bold' size='xs' />]}
                />
            ),
        },
        { type: 'heading', text: localize('For Short:') },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you think the market price will drop continuously for a specific period, choose <0>Short</0>. You will get a payout at the expiry time if the market price doesn’t touch or cross above the barrier. Your payout will grow proportionally to the distance between the market price and the barrier if the barrier is not breached. You will start making a profit when the payout is higher than your stake. If the market price ever crosses the barrier, there won’t be a payout.'
                    components={[<Text key={0} as='span' weight='bold' size='xs' />]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: localize('You can determine the expiry of your contract by setting the duration or end time.'),
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ type, text }, index) =>
                type === 'heading' ? (
                    <Text as='h6' key={index.toString() + text} weight='bold' size='xs'>
                        {text}
                    </Text>
                ) : (
                    <Text as='p' key={index}>
                        {text}
                    </Text>
                )
            )}
        </React.Fragment>
    );
};
