import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const TurbosTradeDescription = () => {
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
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='turbos-payout'
                            contract_type={CONTRACT_LIST.TURBOS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={SPOT_PRICE}
                            key={1}
                            id='turbos-spot-price'
                            contract_type={CONTRACT_LIST.TURBOS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={BARRIER}
                            key={2}
                            id='turbos-barrier'
                            contract_type={CONTRACT_LIST.TURBOS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
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
                        <DefinitionPopover
                            term={PAYOUT_PER_POINT}
                            key={0}
                            id='turbos-payout-per-point'
                            contract_type={CONTRACT_LIST.TURBOS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXIT_SPOT}
                            key={1}
                            id='turbos-exit-spot'
                            contract_type={CONTRACT_LIST.TURBOS}
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
                    i18n_default_text='You make a profit only if your payout is more than your <0>stake</0>.'
                    components={[
                        <DefinitionPopover term={STAKE} key={0} id='turbos-stake' contract_type={CONTRACT_LIST.TURBOS}>
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
                    i18n_default_text={`You may sell your contract up to 15 seconds before <0>expiry</0>. If you do, we'll pay you the contract value.`}
                    components={[
                        <DefinitionPopover
                            term={EXPIRY}
                            key={0}
                            id='turbos-expiry'
                            contract_type={CONTRACT_LIST.TURBOS}
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
                <Localize i18n_default_text='If you set your duration in ticks, you cannot close the contract early.' />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default TurbosTradeDescription;
