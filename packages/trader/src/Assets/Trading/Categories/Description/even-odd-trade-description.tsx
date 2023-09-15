import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const EvenOddTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Even", you will win the payout if the last digit of the last tick is an even number (i.e., 2, 4, 6, 8, or 0).'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Odd", you will win the payout if the last digit of the last tick is an odd number (i.e., 1, 3, 5, 7, or 9).'
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

export default EvenOddTradeDescription;
