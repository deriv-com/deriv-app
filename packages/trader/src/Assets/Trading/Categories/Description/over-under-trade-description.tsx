import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const OverUnderTradeDescription = () => {
    const { EXIT_SPOT, EXPIRY, PAYOUT } = getTerm();

    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Over/Under lets you predict if the last digit of the <0>exit spot</0> at contract <1>expiry</1> will be over or under your chosen number.'
                    components={[
                        <DefinitionPopover
                            term={EXIT_SPOT}
                            key={0}
                            id='over-under-exit-spot'
                            contract_type={CONTRACT_LIST.OVER_UNDER}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXPIRY}
                            key={1}
                            id='over-under-expiry'
                            contract_type={CONTRACT_LIST.OVER_UNDER}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Over' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the last digit of the exit spot is greater than your chosen number.'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='over-payout'
                            contract_type={CONTRACT_LIST.OVER_UNDER}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'over',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Under' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the last digit of the exit spot is less than your chosen number.' />
            ),
        },
        {
            type: 'video',
            text: 'under',
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default OverUnderTradeDescription;
