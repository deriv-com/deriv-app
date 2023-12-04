import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const HighLowTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Higher", you win the payout if the exit spot is strictly higher than the barrier.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Lower", you win the payout if the exit spot is strictly lower than the barrier.'
            key='2'
        />,
        <Localize i18n_default_text="If the exit spot is equal to the barrier, you don't win the payout." key='3' />,
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

export default HighLowTradeDescription;
