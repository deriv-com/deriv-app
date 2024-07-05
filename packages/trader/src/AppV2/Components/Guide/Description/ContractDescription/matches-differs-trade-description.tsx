import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription } from 'AppV2/Utils/contract-description-utils';

const MatchesDiffersTradeDescription = () => {
    const [matches, differs] = CONTRACT_LIST.MATCHES_DIFFERS.split('/');
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Matches' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Matches</0>”, you will win the payout if the last digit of the last tick is the same as your prediction.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: matches,
        },
        { type: 'heading', text: <Localize i18n_default_text='Differs' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Differs</0>”, you will win the payout if the last digit of the last tick is not the same as your prediction.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: differs,
        },
    ];
    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default MatchesDiffersTradeDescription;
