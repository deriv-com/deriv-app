import React from 'react';
import { Localize } from '@deriv/translations';
import { getTerm, getContractDescription } from 'AppV2/Utils/contract-description-utils';

const MultipliersTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { STOP_OUT_LEVEL, TAKE_PROFIT, STOP_LOSS, DEAL_CANCELLATION, SLIPPAGE_RISK } = getTerm();
    const content = [
        {
            type: 'general',
            text: (
                <Localize i18n_default_text='Use multipliers to leverage your potential returns. Predict if the asset price will move upward (bullish) or downward (bearish). We’ll charge a commission when you open a multipliers trade.' />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Up' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select "<0>Up</0>", your total profit/loss will be the percentage increase in the underlying asset price, times the multiplier and stake, minus commissions.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: 'multipliers_up',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Down' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select "<0>Down</0>", your total profit/loss will be the percentage decrease in the underlying asset price, times the multiplier and stake, minus commissions.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: 'multipliers_down',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Additional Information' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your contract will be closed when the <0>stop out level</0> is reached.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(STOP_OUT_LEVEL)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Additional features are available to manage your positions: <0>Take profit</0>, <1>Stop loss</1> and <2>Deal cancellation</2> allow you to adjust your level of risk aversion.'
                    components={[
                        <button
                            className='description__content--definition quoted-button'
                            key={0}
                            onClick={() => onTermClick(TAKE_PROFIT)}
                        />,
                        <button
                            className='description__content--definition quoted-button'
                            key={1}
                            onClick={() => onTermClick(STOP_LOSS)}
                        />,
                        <button
                            className='description__content--definition quoted-button'
                            key={2}
                            onClick={() => onTermClick(DEAL_CANCELLATION)}
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
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='For entry spot, we use current-tick-execution mechanism, which is the latest asset price when the trade opening is processed by our servers.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='For exit spot, the latest asset price when the trade closure is processed by our servers.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Note: Deal cancellation is only available for Volatility Indices on Multipliers.' />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default MultipliersTradeDescription;
