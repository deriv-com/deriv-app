import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const MultiplierTradeDescription = () => {
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
            text: <Localize i18n_default_text='Up' className='contract-type-info__heading' />,
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
            text: <Localize i18n_default_text='Down' className='contract-type-info__heading' />,
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
            text: <Localize i18n_default_text='Additional Information' className='contract-type-info__heading' />,
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
                    i18n_default_text='Your trade closes automatically if the <0>stop out</0> level is hit.'
                    components={[
                        <DefinitionPopover
                            term={STOP_OUT}
                            key={0}
                            id='multipliers-stop-out'
                            contract_type={CONTRACT_LIST.MULTIPLIERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
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
                        <DefinitionPopover
                            term={TAKE_PROFIT}
                            key={0}
                            id='multipliers-take-profit'
                            contract_type={CONTRACT_LIST.MULTIPLIERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={STOP_LOSS}
                            key={1}
                            id='multipliers-stop-loss'
                            contract_type={CONTRACT_LIST.MULTIPLIERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={DEAL_CANCELLATION}
                            key={2}
                            id='multipliers-deal-cancellation'
                            contract_type={CONTRACT_LIST.MULTIPLIERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
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
                        <DefinitionPopover
                            term={SLIPPAGE_RISK}
                            key={0}
                            id='multipliers-slippage-risk'
                            contract_type={CONTRACT_LIST.MULTIPLIERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default MultiplierTradeDescription;
