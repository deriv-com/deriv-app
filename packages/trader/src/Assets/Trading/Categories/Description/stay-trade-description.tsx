import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const StayTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Stays Between", you win the payout if the market stays between (does not touch) either the High barrier or the Low barrier at any time during the contract period'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Goes Outside", you win the payout if the market touches either the High barrier or the Low barrier at any time during the contract period.'
            key='2'
        />,
    ];
    return (
        <React.Fragment>
            {content.map(paragraph => (
                <Text as='p' key={paragraph.props.i18n_default_text}>
                    {paragraph}
                </Text>
            ))}
        </React.Fragment>
    );
};

export default StayTradeDescription;
