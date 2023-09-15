import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const TurbosTradeDescription = () => {
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='This product allows you to express a strong bullish or bearish view on an underlying asset.'
                    key='1'
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='For Long:' key='2' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you think the market price will rise continuously for a specific period, choose <0>Long</0>. You will get a payout at the expiry time if the market price doesn’t touch or cross below the barrier. Your payout will grow proportionally to the distance between the market price and the barrier if the barrier is not breached. You will start making a profit when the payout is higher than your stake. If the market price ever crosses the barrier, there won’t be a payout.'
                    components={[<Text key={0} as='span' weight='bold' size='xs' />]}
                    key='3'
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='For Short:' key='4' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you think the market price will drop continuously for a specific period, choose <0>Short</0>. You will get a payout at the expiry time if the market price doesn’t touch or cross above the barrier. Your payout will grow proportionally to the distance between the market price and the barrier if the barrier is not breached. You will start making a profit when the payout is higher than your stake. If the market price ever crosses the barrier, there won’t be a payout.'
                    components={[<Text key={0} as='span' weight='bold' size='xs' />]}
                    key='5'
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You can determine the expiry of your contract by setting the duration or end time.'
                    key='6'
                />
            ),
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ type, text }) =>
                type === 'heading' ? (
                    <Text as='h6' key={text.props.key} weight='bold' size='xs'>
                        {text}
                    </Text>
                ) : (
                    <Text as='p' key={text.props.key}>
                        {text}
                    </Text>
                )
            )}
        </React.Fragment>
    );
};

export default TurbosTradeDescription;
