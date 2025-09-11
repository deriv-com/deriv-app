import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const RiseFallTradeDescription = () => {
    const { ENTRY_SPOT, EXPIRY, PAYOUT } = getTerm();

    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Rise/Fall lets you predict if the market price will end higher or lower than the <0>entry spot</0> at contract <1>expiry</1>.'
                    components={[
                        <DefinitionPopover
                            term={ENTRY_SPOT}
                            key={0}
                            id='entry-spot-definition'
                            contract_type={CONTRACT_LIST.RISE_FALL}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXPIRY}
                            key={1}
                            id='expiry-definition'
                            contract_type={CONTRACT_LIST.RISE_FALL}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Rise' className='contract-type-info__heading' /> },

        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the exit spot is strictly higher than the entry spot.'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='payout-definition'
                            contract_type={CONTRACT_LIST.RISE_FALL}
                        >
                            <span id='payout-higher-lower' className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'rise',
        },
        { type: 'heading', text: <Localize i18n_default_text='Fall' className='contract-type-info__heading' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a payout if the exit spot is strictly lower than the entry spot.'
                    components={[]}
                />
            ),
        },
        {
            type: 'video',
            text: 'fall',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Allow equals' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='For <0>Rise</0>, earn if the exit spot is higher than or equal to the entry spot. For <1>Fall</1>, earn if the exit spot is lower than or equal to the entry spot.'
                    components={[
                        <span id='rise-fall-rise' className='contract-type-info__content-bold' key={0} />,
                        <span id='rise-fall-fall' className='contract-type-info__content-bold' key={1} />,
                    ]}
                />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default RiseFallTradeDescription;
