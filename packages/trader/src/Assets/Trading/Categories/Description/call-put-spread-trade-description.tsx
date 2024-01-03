import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const CallPutSpreadTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text={'Spread Up'} /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Win maximum payout if the exit spot is higher than or equal to the upper barrier.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between exit spot and lower barrier.' />
            ),
        },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='No payout if exit spot is below or equal to the lower barrier.' />,
        },
        { type: 'heading', text: <Localize i18n_default_text='Spread Down' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Win maximum payout if the exit spot is lower than or equal to the lower barrier.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between upper barrier and exit spot.' />
            ),
        },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='No payout if exit spot is above or equal to the upper barrier.' />,
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ type, text }) =>
                type === 'heading' ? (
                    <Text as='h2' key={text.props.i18n_default_text} weight='bold' size='xs'>
                        {text}
                    </Text>
                ) : (
                    <Text as='p' key={text.props.i18n_default_text}>
                        {text}
                    </Text>
                )
            )}
        </React.Fragment>
    );
};

export default CallPutSpreadTradeDescription;
