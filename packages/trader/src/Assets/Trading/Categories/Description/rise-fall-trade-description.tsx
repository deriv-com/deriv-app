import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const RiseFallTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.'
            key='2'
        />,
        <Localize
            i18n_default_text='If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".'
            key='3'
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

export default RiseFallTradeDescription;
