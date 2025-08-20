import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';

const RiseFallTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { ENTRY_SPOT, EXPIRY, PAYOUT } = getTerm();
    const [rise, fall] = CONTRACT_LIST.RISE_FALL.split('/');
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Rise/Fall lets you predict if the market price will end higher or lower than the <0>entry spot</0> at contract <1>expiry</1>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(ENTRY_SPOT)}
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
        { type: 'heading', text: <Localize i18n_default_text='Rise' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the exit spot is strictly higher than the entry spot.'
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
        {
            type: 'video',
            text: rise,
        },
        { type: 'heading', text: <Localize i18n_default_text='Fall' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the exit spot is strictly lower than the entry spot.' />
            ),
        },
        {
            type: 'video',
            text: fall,
        },
        { type: 'heading', text: <Localize i18n_default_text='Allow equals' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='For <0>Rise</0>, earn if the exit spot is higher than or equal to the entry spot.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='For <0>Fall</0>, earn if the exit spot is lower than or equal to the entry spot.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
    ];
    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default RiseFallTradeDescription;
