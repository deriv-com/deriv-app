import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const VanillaTradeDescription = ({ onClick }: { onClick: React.MouseEventHandler<HTMLSpanElement> }) => {
    const content = [
        <Localize
            i18n_default_text='Vanilla options allow you to predict an upward (bullish) or downward (bearish) direction of the underlying asset by purchasing a "Call" or a "Put".'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select <0>"Call"</0>, you’ll earn a <1>payout</1> if the <1>final price</1> is above the <1>strike price</1> at <1>expiry</1>. Otherwise, you won’t receive a payout.'
            components={[
                <strong key={0} />,
                <span className='contract-type-info__content-definition' onClick={onClick} key={1} />,
            ]}
            key='2'
        />,
        <Localize
            i18n_default_text='If you select <0>"Put"</0>, you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
            components={[<strong key={0} />]}
            key='3'
        />,
        <Localize
            i18n_default_text='Your payout is equal to the <0>payout per point</0> multiplied by the difference between the final price and the strike price. You will only earn a profit if your payout is higher than your initial stake.'
            components={[<span className='contract-type-info__content-definition' onClick={onClick} key={0} />]}
            key='4'
        />,
        <Localize
            i18n_default_text='You may sell the contract up until 60 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
            components={[<span className='contract-type-info__content-definition' onClick={onClick} key={0} />]}
            key='5'
        />,
    ];
    return (
        <React.Fragment>
            {content.map(paragraph => (
                <Text as='p' key={paragraph.props.key}>
                    {paragraph}
                </Text>
            ))}
        </React.Fragment>
    );
};

export default VanillaTradeDescription;
