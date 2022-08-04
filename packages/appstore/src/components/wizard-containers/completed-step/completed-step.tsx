import React from 'react';
import { Text } from '@deriv/ui';
import { localize } from '@deriv/translations';
import WalletCard from 'Components/wallet';
import './completed-step.scss';

type CompletedStepProps = {
    selected_wallet: string;
};

const CompletedStep = ({ selected_wallet }: CompletedStepProps) => {
    return (
        <>
            {selected_wallet && (
                <div className='completed-step'>
                    <Text className='completed-step__title' bold type='paragraph-1'>
                        {localize('Your USD wallet is ready!')}
                    </Text>
                    <Text className='completed-step__desc' bold={false} type='paragraph-2'>
                        {localize('Now, feel free to add an app and link it with this wallet.')}
                    </Text>
                    <div className='completed-step__wallet'>
                        <WalletCard size='large' wallet_name={selected_wallet} balance='0.00' />
                    </div>
                </div>
            )}
        </>
    );
};

export default CompletedStep;
