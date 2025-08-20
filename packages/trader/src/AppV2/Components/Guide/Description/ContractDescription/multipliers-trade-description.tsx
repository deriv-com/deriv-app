import React from 'react';
import { Localize } from '@deriv/translations';
import { getTerm, getContractDescription } from 'AppV2/Utils/contract-description-utils';

const MultipliersTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { STOP_OUT, TAKE_PROFIT, STOP_LOSS, DEAL_CANCELLATION, SLIPPAGE_RISK } = getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Multipliers let you amplify your potential profit or loss by applying a multiplier to the asset price movement.' />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Up' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a profit if the asset price rises above the entry price at the time you close the trade.' />
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
                <Localize i18n_default_text='Earn a profit if the asset price falls below the entry price at the time you close the trade.' />
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
                <Localize i18n_default_text='A fixed commission is charged when you open a Multipliers trade. The amount varies by asset class and market volatility.' />
            ),
        },
        {
            type: 'badge',
            text: (
                <Localize i18n_default_text='Profit/loss = (% of price difference × multiplier × stake) – commission' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your trade closes automatically if the <0>stop out level</0> is hit.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(STOP_OUT)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You can manage risk with features like <0>take profit</0>, <1>stop loss</1>, and <2>deal cancellation</2> (when available).'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TAKE_PROFIT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(STOP_LOSS)}
                        />,
                        <button
                            className='description__content--definition'
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
                    i18n_default_text='You can close your trade anytime. However, be aware that <0>slippage risk</0> may affect your final return.'
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

export default MultipliersTradeDescription;
