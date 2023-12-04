import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const AsianTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='Asian options settle by comparing the last tick with the average spot over the period.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Asian Rise", you will win the payout if the last tick is higher than the average of the ticks.'
            key='2'
        />,
        <Localize
            i18n_default_text='If you select "Asian Fall", you will win the payout if the last tick is lower than the average of the ticks.'
            key='3'
        />,
        <Localize
            i18n_default_text="If the last tick is equal to the average of the ticks, you don't win the payout."
            key='4'
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

export default AsianTradeDescription;
