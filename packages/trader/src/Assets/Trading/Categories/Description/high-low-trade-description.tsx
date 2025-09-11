import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const HighLowTradeDescription = () => {
    const { EXPIRY, EXIT_SPOT, PAYOUT } = getTerm();

    const higher_lower_content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Higher/Lower lets you predict if the market price will end higher or lower than a set barrier at contract <0>expiry</0> (<1>exit spot</1>).'
                    components={[
                        <DefinitionPopover
                            term={EXPIRY}
                            key={0}
                            id='higher-lower-expiry'
                            contract_type={CONTRACT_LIST.HIGHER_LOWER}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXIT_SPOT}
                            key={1}
                            id='higher-lower-exit-spot'
                            contract_type={CONTRACT_LIST.HIGHER_LOWER}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Higher' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the exit spot is strictly higher than the barrier.'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='higher-lower-payout'
                            contract_type={CONTRACT_LIST.HIGHER_LOWER}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'higher',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Lower' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='Earn a payout if the exit spot is strictly lower than the barrier.' />,
        },
        {
            type: 'video',
            text: 'lower',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Additional Information' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text={`If the exit spot is equal to the barrier, you don't earn the payout.`} />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(higher_lower_content, true)}</React.Fragment>;
};

export default HighLowTradeDescription;
