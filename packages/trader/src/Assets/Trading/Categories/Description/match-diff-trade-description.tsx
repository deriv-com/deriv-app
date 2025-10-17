import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const MatchDiffTradeDescription = () => {
    const { EXPIRY, EXIT_SPOT, PAYOUT } = getTerm();

    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text={`Matches/Differs lets you predict whether the last digit of the last tick’s price will match your chosen number at contract <0>expiry</0> (<1>exit spot</1>).`}
                    components={[
                        <DefinitionPopover
                            term={EXPIRY}
                            key={0}
                            id='matches-differs-expiry'
                            contract_type={CONTRACT_LIST.MATCHES_DIFFERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXIT_SPOT}
                            key={1}
                            id='matches-differs-exit-spot'
                            contract_type={CONTRACT_LIST.MATCHES_DIFFERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Matches' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the last digit of the exit spot matches your prediction.'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='matches-differs-payout'
                            contract_type={CONTRACT_LIST.MATCHES_DIFFERS}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'matches',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Differs' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the last digit of the exit spot differs from your prediction.' />
            ),
        },
        {
            type: 'video',
            text: 'differs',
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default MatchDiffTradeDescription;
