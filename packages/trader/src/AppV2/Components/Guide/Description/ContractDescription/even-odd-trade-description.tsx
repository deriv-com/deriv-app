import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';

const EvenOddTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { EXPIRY, EXIT_SPOT, PAYOUT } = getTerm();
    const [even, odd] = CONTRACT_LIST.EVEN_ODD.split('/');
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Even/Odd lets you predict if the last digit of the last tick’s price will be an even or odd number at contract <0>expiry</0> (<1>exit spot</1>).'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(EXPIRY)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(EXIT_SPOT)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Even' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the last digit of the exit spot is even (0, 2, 4, 6, or 8).'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'video', text: 'even' },
        { type: 'heading', text: <Localize i18n_default_text='Odd' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the last digit of the exit spot is odd (1, 3, 5, 7, or 9).' />
            ),
        },
        { type: 'video', text: 'odd' },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default EvenOddTradeDescription;
