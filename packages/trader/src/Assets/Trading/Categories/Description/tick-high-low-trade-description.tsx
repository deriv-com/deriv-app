import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const TickHighLowTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "High Tick", you win the payout if the selected tick is the highest among the next five ticks.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Low Tick", you win the payout if the selected tick is the lowest among the next five ticks.'
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

export default TickHighLowTradeDescription;
