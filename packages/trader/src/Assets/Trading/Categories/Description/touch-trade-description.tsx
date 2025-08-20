import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const TouchTradeDescription = () => {
    const { PAYOUT, EXPIRY } = getTerm();

    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Touch/No Touch lets you predict if the market price will reach a set barrier at any time during the contract period.' />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Touch' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the market touches the barrier at any time before <1>expiry</1>.'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='touch-no-touch-payout'
                            contract_type={CONTRACT_LIST.TOUCH_NO_TOUCH}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXPIRY}
                            key={1}
                            id='touch-no-touch-expiry'
                            contract_type={CONTRACT_LIST.TOUCH_NO_TOUCH}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'touch',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='No Touch' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='Earn a payout if the market never touches the barrier before expiry.' />,
        },
        {
            type: 'video',
            text: 'no_touch',
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default TouchTradeDescription;
