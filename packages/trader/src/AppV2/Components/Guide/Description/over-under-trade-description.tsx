import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';

const OverUnderTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Over' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Over</0>”, you will win the payout if the last digit of the last tick is greater than your prediction.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Under' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Under</0>”, you will win the payout if the last digit of the last tick is less than your prediction.'
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

export default OverUnderTradeDescription;
