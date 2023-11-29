import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const LbCallTradeDescription = () => {
    const content = [
        <Localize
            i18n_default_text='By purchasing the "Close-to-Low" contract, you\&apos;ll win the multiplier times the difference between the close and low over the duration of the contract.'
            key='1'
        />,
        <Localize
            i18n_default_text='The high is the highest point ever reached by the market during the contract period.'
            key='2'
        />,
        <Localize
            i18n_default_text='The low is the lowest point ever reached by the market during the contract period.'
            key='3'
        />,
        <Localize
            i18n_default_text='The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
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

export default LbCallTradeDescription;
