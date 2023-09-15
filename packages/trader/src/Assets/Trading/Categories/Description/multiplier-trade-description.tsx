import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const MultiplierTradeDescription = () => {
    const about_section = [
        <Localize
            i18n_default_text='Predict the market direction and select either “Up” or “Down” to open a position. We will charge a commission when you open a position.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select “Up”, you will earn a profit by closing your position when the market price is higher than the entry spot.'
            key='2'
        />,
        <Localize
            i18n_default_text='If you select “Down”, you will earn a profit by closing your position when the market price is lower than the entry spot.'
            key='3'
        />,
        <Localize
            i18n_default_text='Your profit is the percentage change in market price times your stake and the multiplier of your choice.'
            key='4'
        />,
        <Localize
            i18n_default_text='The stop-out level on the chart indicates the price at which your potential loss equals your entire stake. When the market price reaches this level, your position will be closed automatically. This ensures that your loss does not exceed the amount you paid to purchase the contract.'
            key='5'
        />,
        <Localize i18n_default_text='These are optional parameters for each position that you open:' key='6' />,
    ];
    const multipliers_params_section = [
        {
            type: 'list_item',
            text: (
                <Localize
                    i18n_default_text='If you select “Take profit” and specify an amount that you’d like to earn, your position will be closed automatically when your profit is more than or equals to this amount. Your profit may be more than the amount you entered depending on the market price at closing.'
                    key='7'
                />
            ),
        },
        {
            type: 'list_item',
            text: (
                <Localize
                    i18n_default_text='If you select “Stop loss” and specify an amount to limit your loss, your position will be closed automatically when your loss is more than or equals to this amount. Your loss may be more than the amount you entered depending on the market price at closing.'
                    key='8'
                />
            ),
        },
        {
            type: 'list_item',
            text: (
                <Localize
                    i18n_default_text='If you select “Deal cancellation”, you’ll be able to cancel your trade within a chosen time frame should the market move against your favour. We’ll charge a small fee for this, but we’ll return your stake amount without profit or loss. If the stop-out amount is reached before the deal cancellation expires, your position will be cancelled automatically and we’ll return your stake amount without profit or loss.'
                    key='9'
                />
            ),
        },
        { type: 'paragraph', text: <Localize i18n_default_text='While “Deal cancellation” is active:' key='10' /> },
    ];
    const deal_cancellation_section = [
        <Localize
            i18n_default_text='“Stop loss” is deactivated and will only be available when “Deal cancellation” expires.'
            key='11'
        />,
        <Localize
            i18n_default_text='“Take profit” cannot be updated. You may update it only when “Deal cancellation” expires.'
            key='12'
        />,
    ];
    const closing_section = [
        <Localize
            i18n_default_text='The entry spot is the market price when your contract is processed by our servers.'
            key='13'
        />,
        <Localize i18n_default_text='The exit spot is the market price when the contract is closed.' key='14' />,
    ];

    return (
        <React.Fragment>
            {about_section.map(paragraph => (
                <Text as='p' key={paragraph.props.i18n_default_text}>
                    {paragraph}
                </Text>
            ))}
            <ul>
                {multipliers_params_section.map(({ type, text }) =>
                    type === 'list_item' ? (
                        <Text as='li' key={text.props.i18n_default_text}>
                            {text}
                        </Text>
                    ) : (
                        <Text as='p' key={text.props.i18n_default_text}>
                            {text}
                        </Text>
                    )
                )}
                <ul>
                    {deal_cancellation_section.map(paragraph => (
                        <Text as='li' key={paragraph.props.i18n_default_text}>
                            {paragraph}
                        </Text>
                    ))}
                </ul>
            </ul>
            {closing_section.map(paragraph => (
                <Text as='p' key={paragraph.props.i18n_default_text}>
                    {paragraph}
                </Text>
            ))}
        </React.Fragment>
    );
};

export default MultiplierTradeDescription;
