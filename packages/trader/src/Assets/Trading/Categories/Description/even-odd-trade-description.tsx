import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';
import DefinitionPopover from '../definition-popover';

const EvenOddTradeDescription = () => {
    const { EXPIRY, EXIT_SPOT, PAYOUT } = getTerm();

    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text={`Even/Odd lets you predict if the last digit of the last tick’s price will be an even or odd number at contract <0>expiry</0> (<1>exit spot</1>).`}
                    components={[
                        <DefinitionPopover
                            term={EXPIRY}
                            key={0}
                            id='even-odd-expiry'
                            contract_type={CONTRACT_LIST.EVEN_ODD}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                        <DefinitionPopover
                            term={EXIT_SPOT}
                            key={1}
                            id='even-odd-exit-spot'
                            contract_type={CONTRACT_LIST.EVEN_ODD}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Even' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the last digit of the exit spot is even (0, 2, 4, 6, or 8).'
                    components={[
                        <DefinitionPopover
                            term={PAYOUT}
                            key={0}
                            id='even-payout'
                            contract_type={CONTRACT_LIST.EVEN_ODD}
                        >
                            <span className='contract-type-info__content-definition' />
                        </DefinitionPopover>,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: 'even',
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Odd' className='contract-type-info__heading' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the last digit of the exit spot is odd (1, 3, 5, 7, or 9).' />
            ),
        },
        {
            type: 'video',
            text: 'odd',
        },
    ];

    return <React.Fragment>{getContractDescription(content, true)}</React.Fragment>;
};

export default EvenOddTradeDescription;
