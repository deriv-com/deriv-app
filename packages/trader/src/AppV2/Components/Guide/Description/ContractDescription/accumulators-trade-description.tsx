import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getTerm, getContractDescription } from 'AppV2/Utils/contract-description-utils';

const AccumulatorsTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { INDEX, STAKE, GROWTH_RATE, BARRIER_RANGE, PREVIOUS_SPOT_PRICE, PAYOUT, TAKE_PROFIT, SLIPPAGE_RISK } =
        getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Accumulators allow you to predict how much an <0>index</0> can move and potentially grow your <1>stake</1> exponentially at a fixed <2>growth rate</2>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(INDEX)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(STAKE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(GROWTH_RATE)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },

        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your <0>payout</0> is the sum of your initial stake and profit. It keeps growing as long as the spot price stays within a specified <1>barrier range</1> from the <2>previous spot price</2> at each interval.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT)}
                        />,

                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(BARRIER_RANGE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(PREVIOUS_SPOT_PRICE)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='If the spot price goes outside the range, you lose your stake and the trade is terminated.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='<0>Take profit</0>: Set a target payout to automatically close your contract and secure your gains (not available for ongoing trades).'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TAKE_PROFIT)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You can close your trade anytime. However, be aware of <0>slippage risk</0>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(SLIPPAGE_RISK)}
                        />,
                    ]}
                />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default AccumulatorsTradeDescription;
