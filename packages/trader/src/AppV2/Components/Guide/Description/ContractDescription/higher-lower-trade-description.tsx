import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';

const HigherLowerTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { EXPIRY, EXIT_SPOT, PAYOUT } = getTerm();
    const [higher, lower] = CONTRACT_LIST.HIGHER_LOWER.split('/');
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Higher/Lower lets you predict if the market price will end higher or lower than a set barrier at contract <0>expiry</0> (<1>exit spot</1>).'
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
        { type: 'heading', text: <Localize i18n_default_text='Higher' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the exit spot is strictly higher than the barrier.'
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
        { type: 'video', text: higher },
        { type: 'heading', text: <Localize i18n_default_text='Lower' /> },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='Earn a payout if the exit spot is strictly lower than the barrier.' />,
        },
        { type: 'video', text: lower },
        { type: 'heading', text: <Localize i18n_default_text='Additional Information' /> },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='If the exit spot is equal to the barrier, you don’t earn the payout.' />,
        },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default HigherLowerTradeDescription;
