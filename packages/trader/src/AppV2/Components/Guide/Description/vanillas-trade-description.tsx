import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import { TERM } from 'AppV2/Utils/trade-types-utils';

const VanillasTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Vanilla options allow you to predict an upward (bullish) or downward (bearish) direction of the underlying asset by purchasing a “Call” or a “Put”.' />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Call' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Call</0>”, you’ll earn a <1>payout</1> if the <2>final price</2> is above the <3>strike price</3> at <4>expiry</4>. Otherwise, you won’t receive a payout.'
                    components={[
                        <span className='description__content--bold' key={0} />,
                        <span
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(TERM.PAYOUT)}
                            onKeyDown={() => onTermClick(TERM.PAYOUT)}
                        />,
                        <span
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(TERM.FINAL_PRICE)}
                            onKeyDown={() => onTermClick(TERM.FINAL_PRICE)}
                        />,
                        <span
                            className='description__content--definition'
                            key={3}
                            onClick={() => onTermClick(TERM.STRIKE_PRICE)}
                            onKeyDown={() => onTermClick(TERM.STRIKE_PRICE)}
                        />,
                        <span
                            className='description__content--definition'
                            key={4}
                            onClick={() => onTermClick(TERM.EXPIRY)}
                            onKeyDown={() => onTermClick(TERM.EXPIRY)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Put' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Put</0>”, you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Additional Information' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your payout is equal to the <0>payout per point</0> multiplied by the difference between the final price and the strike price. You will only earn a profit if your payout is higher than your initial stake.'
                    components={[
                        <span
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.PAYOUT_PER_POINT)}
                            onKeyDown={() => onTermClick(TERM.PAYOUT_PER_POINT)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You may sell the contract up to 60 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
                    components={[
                        <span
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.CONTRACT_VALUE)}
                            onKeyDown={() => onTermClick(TERM.CONTRACT_VALUE)}
                        />,
                    ]}
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

export default VanillasTradeDescription;
