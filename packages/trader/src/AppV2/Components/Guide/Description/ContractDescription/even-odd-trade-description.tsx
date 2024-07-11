import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription } from 'AppV2/Utils/contract-description-utils';

const EvenOddTradeDescription = () => {
    const [even, odd] = CONTRACT_LIST.EVEN_ODD.split('/');
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
        {
            type: 'video',
            text: even,
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
        {
            type: 'video',
            text: odd,
        },
    ];
    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default EvenOddTradeDescription;
