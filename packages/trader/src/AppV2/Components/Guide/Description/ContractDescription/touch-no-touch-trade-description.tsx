import React from 'react';
import { Localize } from '@deriv/translations';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';

const TouchNoTouchTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { PAYOUT, EXPIRY } = getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Touch/No Touch lets you predict if the market price will reach a set barrier at any time during the contract period.' />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Touch' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the market touches the barrier at any time before <1>expiry</1>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(EXPIRY)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'video', text: 'touch' },
        { type: 'heading', text: <Localize i18n_default_text='No Touch' /> },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='Earn a payout if the market never touches the barrier before expiry.' />,
        },
        { type: 'video', text: 'no_touch' },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default TouchNoTouchTradeDescription;
