import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';

const TouchNoTouchTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Touch' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Touch</0>”, you win the payout if the market touches the barrier at any time during the contract period.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='No Touch' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>No Touch</0>”, you win the payout if the market never touches the barrier at any time during the contract period.'
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

export default TouchNoTouchTradeDescription;
