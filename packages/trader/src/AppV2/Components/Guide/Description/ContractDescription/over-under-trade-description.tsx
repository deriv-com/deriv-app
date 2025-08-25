import React from 'react';
import { Localize } from '@deriv/translations';
import { getContractDescription, getTerm } from 'AppV2/Utils/contract-description-utils';

const OverUnderTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { EXIT_SPOT, EXPIRY, PAYOUT } = getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Over/Under lets you predict if the last digit of the <0>exit spot</0> at contract <1>expiry</1> will be over or under your chosen number.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(EXIT_SPOT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(EXPIRY)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Over' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the last digit of the exit spot is greater than your chosen number.'
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
        { type: 'video', text: 'over' },
        { type: 'heading', text: <Localize i18n_default_text='Under' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='Earn a payout if the last digit of the exit spot is less than your chosen number.' />
            ),
        },
        { type: 'video', text: 'under' },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default OverUnderTradeDescription;
