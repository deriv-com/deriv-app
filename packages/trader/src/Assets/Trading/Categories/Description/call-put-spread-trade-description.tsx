import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const CallPutSpreadTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text={'Spread Up'} /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Win maximum payout if the exit spot is higher than or equal to the upper barrier.'
                    key='1'
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between exit spot and lower barrier.'
                    key='2'
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='No payout if exit spot is below or equal to the lower barrier.' key='3' />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Spread Down' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Win maximum payout if the exit spot is lower than or equal to the lower barrier.'
                    key='4'
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between upper barrier and exit spot.'
                    key='5'
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='No payout if exit spot is above or equal to the upper barrier.' key='6' />
            ),
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ type, text }) =>
                type === 'heading' ? (
                    <Text as='h2' key={text.props.key} weight='bold' size='xs'>
                        {text}
                    </Text>
                ) : (
                    <Text as='p' key={text.props.key}>
                        {text}
                    </Text>
                )
            )}
        </React.Fragment>
    );
};

export default CallPutSpreadTradeDescription;
