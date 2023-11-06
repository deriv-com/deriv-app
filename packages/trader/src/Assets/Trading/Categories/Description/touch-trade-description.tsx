import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const TouchTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='If you select "Touch", you win the payout if the market touches the barrier at any time during the contract period.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "No Touch", you win the payout if the market never touches the barrier at any time during the contract period.'
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

export default TouchTradeDescription;
