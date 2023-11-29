import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const ResetTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Reset-Up”, you win the payout if the exit spot is strictly higher than either the entry spot or the spot at reset time.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Reset-Down”, you win the payout if the exit spot is strictly lower than either the entry spot or the spot at reset time.'
            key='2'
        />,
        <Localize
            i18n_default_text="If the exit spot is equal to the barrier or the new barrier (if a reset occurs), you don't win the payout."
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

export default ResetTradeDescription;
