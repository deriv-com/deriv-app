import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const VanillaTradeDescription = () => {
    const { STRIKE_PRICE, EXPIRY, EXIT_SPOT, PAYOUT, PAYOUT_PER_POINT, CONTRACT_VALUE } = getTerm();

    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text={`Vanillas allow you to predict if the underlying asset’s price will be above or below the <0>strike price</0> at contract <1>expiry</1> (<2>exit spot</2>).`}
                    components={[
                        <DefinitionPopover
                            term={STRIKE_PRICE}
                            key={0}
                            id='vanillas-strike-price'
                            contract_type={CONTRACT_LIST.VANILLAS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXPIRY}
                            key={1}
                            id='vanillas-exit-spot'
                            contract_type={CONTRACT_LIST.VANILLAS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXIT_SPOT}
                            key={2}
                            id='vanillas-expiry'
                            contract_type={CONTRACT_LIST.VANILLAS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Call' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the exit spot is above the strike price at expiry.'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='vanillas-call-payout'
                            contract_type={CONTRACT_LIST.VANILLAS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'vanillas_call',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Put' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='Earn a payout if the exit spot is below the strike price at expiry.' />,
        },
        {
            type: 'video',
            text: 'vanillas_put',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Additional Information' className='contract-type-info__heading' />,
        },
        {
            type: 'badge',
            text: (
                <Localize
                    i18n_default_text='Payout = <0>Payout per point</0> × Difference between exit spot and strike price'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT_PER_POINT}
                            key={0}
                            id='vanillas-payout-per-point'
                            contract_type={CONTRACT_LIST.VANILLAS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='You make a profit only if the payout is greater than your stake.' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text={`You may sell your contract up to 60 seconds before expiry. If you do, we'll pay you the <0>contract value</0>.`}
                    components={[
                        <DefinitionPopover
                            term={CONTRACT_VALUE}
                            key={0}
                            id='vanillas-contract-value'
                            contract_type={CONTRACT_LIST.VANILLAS}
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

export default VanillaTradeDescription;
