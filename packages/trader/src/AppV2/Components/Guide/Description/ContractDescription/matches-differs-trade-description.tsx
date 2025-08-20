import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';

const MatchesDiffersTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const [matches, differs] = CONTRACT_LIST.MATCHES_DIFFERS.split('/');
    const { EXPIRY, EXIT_SPOT, PAYOUT } = getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Matches/Differs lets you predict whether the last digit of the last tick’s price will match your chosen number at contract <0>expiry</0> (<1>exit spot</1>).'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(EXPIRY)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(EXIT_SPOT)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Matches' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the last digit of the exit spot matches your prediction.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'video', text: 'matches' },
        { type: 'heading', text: <Localize i18n_default_text='Differs' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the last digit of the exit spot differs from your prediction.' />
            ),
        },
        { type: 'video', text: 'differs' },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default MatchesDiffersTradeDescription;
