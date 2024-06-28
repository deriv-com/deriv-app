import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';

const EvenOddTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Even' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Even</0>”, you will win the payout if the last digit of the last tick is an even number (i.e. 2, 4, 6, 8, or 0).'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Odd' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Odd</0>”, you will win the payout if the last digit of the last tick is an odd number (i.e. 1, 3, 5, 7, or 9).'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
    ];
    return (
        <React.Fragment>
            {content.map(({ type, text }) =>
                type === 'heading' ? (
                    <Text key={text.props.i18n_default_text} bold size='md' className='description__heading'>
                        {text}
                    </Text>
                ) : (
                    <Text
                        as='p'
                        key={text.props.i18n_default_text}
                        size='sm'
                        className='description__paragraph'
                        color='quill-typography__color--prominent'
                    >
                        {text}
                    </Text>
                )
            )}
        </React.Fragment>
    );
};

export default EvenOddTradeDescription;
