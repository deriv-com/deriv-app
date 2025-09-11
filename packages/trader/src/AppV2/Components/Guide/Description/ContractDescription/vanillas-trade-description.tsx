import React from 'react';
import { Localize } from '@deriv/translations';
import { getTerm, getContractDescription } from 'AppV2/Utils/contract-description-utils';

const VanillasTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const { PAYOUT, STRIKE_PRICE, EXPIRY, PAYOUT_PER_POINT, CONTRACT_VALUE, EXIT_SPOT } = getTerm();
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Vanillas allow you to predict if the underlying asset’s price will be above or below the <0>strike price</0> at contract <1>expiry</1> (<2>exit spot</2>).'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(STRIKE_PRICE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(EXPIRY)}
                        />,
                        <button
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(EXIT_SPOT)}
                        />,
                    ]}
                />
            ),
        },
        { type: 'heading', text: <Localize i18n_default_text='Call' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Earn a <0>payout</0> if the exit spot is above the strike price at expiry.'
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
        { type: 'video', text: 'vanillas_call' },
        { type: 'heading', text: <Localize i18n_default_text='Put' /> },
        {
            type: 'paragraph',
            text: <Localize i18n_default_text='Earn a payout if the exit spot is below the strike price at expiry.' />,
        },
        { type: 'video', text: 'vanillas_put' },
        { type: 'heading', text: <Localize i18n_default_text='Additional Information' /> },
        {
            type: 'badge',
            text: (
                <Localize
                    i18n_default_text='Payout = <0>Payout per point</0> × Difference between exit spot and strike price'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(PAYOUT_PER_POINT)}
                        />,
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
                    i18n_default_text='You may sell your contract up to 60 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(CONTRACT_VALUE)}
                        />,
                    ]}
                />
            ),
        },
    ];

    return <React.Fragment>{getContractDescription(content)}</React.Fragment>;
};

export default VanillasTradeDescription;
