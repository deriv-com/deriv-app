import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const EndTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Ends Between", you win the payout if the exit spot is strictly higher than the Low barrier AND strictly lower than the High barrier.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "Ends Outside", you win the payout if the exit spot is EITHER strictly higher than the High barrier, OR strictly lower than the Low barrier.'
            key='2'
        />,
        <Localize
            i18n_default_text="If the exit spot is equal to either the Low barrier or the High barrier, you don't win the payout."
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

export default EndTradeDescription;
