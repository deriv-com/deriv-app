import React from 'react';
import { Localize } from '@deriv/translations';
import { getTerm, getContractDescription } from 'AppV2/Utils/contract-description-utils';

const TurbosTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { PAYOUT, EXPIRY, BARRIER, PAYOUT_PER_POINT, SPOT_PRICE, EXIT_SPOT, STAKE } = getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text="Turbos allow you to predict the direction of the underlying asset's movements." />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Up' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the <1>spot price</1> never falls below the <2>barrier</2> during the contract period.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(SPOT_PRICE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(BARRIER)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'video', text: 'turbos_up' },
        { type: 'heading', text: <Localize i18n_default_text='Down' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the spot price never rises above the barrier during the contract period.' />
            ),
        },
        { type: 'video', text: 'turbos_down' },
        { type: 'heading', text: <Localize i18n_default_text='Additional Information' /> },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='If the barrier is breached at any time, your contract ends early.' />,
        },
        {
            type: 'badge',
            text: (
                <Localize
                    i18n_default_text='Payout = <0>Payout per point</0> × Distance between <1>exit spot</1> and barrier'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT_PER_POINT)}
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
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You make a profit only if your payout is more than your <0>stake</0>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(STAKE)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You may sell your contract up to 15 seconds before <0>expiry</0>. If you do, we’ll pay you the contract value.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(EXPIRY)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='If you set your duration in ticks, you cannot close the contract early.' />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default TurbosTradeDescription;
