import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const TouchNoTouchTradeDescription = () => {
    const [touch, no_touch] = CONTRACT_LIST['TOUCH/NO TOUCH'].split('/');
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
        {
            type: 'video',
            text: touch,
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
        {
            type: 'video',
            text: no_touch.split(' ').join('_'),
        },
    ];
    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default TouchNoTouchTradeDescription;
