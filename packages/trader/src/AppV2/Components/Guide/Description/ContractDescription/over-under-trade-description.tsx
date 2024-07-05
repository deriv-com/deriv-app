import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription } from 'AppV2/Utils/contract-description-utils';

const OverUnderTradeDescription = () => {
    const [over, under] = CONTRACT_LIST.OVER_UNDER.split('/');
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
        {
            type: 'video',
            text: over,
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
        {
            type: 'video',
            text: under,
        },
    ];
    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default OverUnderTradeDescription;
