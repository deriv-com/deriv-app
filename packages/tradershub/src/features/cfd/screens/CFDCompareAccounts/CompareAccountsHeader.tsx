import React from 'react';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@/assets/svgs/ic-close-dark.svg';
import { useRegulationFlags } from '@/hooks';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Text } from '@deriv-com/ui';

const CompareAccountsHeader = () => {
    const history = useHistory();
    const { data: activeDerivTrading } = useActiveTradingAccount();
    const { isEU } = useRegulationFlags();

    const isDemo = activeDerivTrading?.is_virtual;

    const accountType = isDemo ? 'Demo' : 'real';
    const demoSuffix = isDemo ? 'demo ' : '';
    const headerTitle = isEU ? `Deriv MT5 CFDs ${accountType} account` : `Compare CFDs ${demoSuffix}accounts`;

    return (
        <div className='sticky flex items-center border-solid z-[999] border-b-1 py-0 px-16 top-0 h-50 border-system-light-secondary-background'>
            <div className='flex justify-center w-full'>
                <Text size='xl' weight='bold'>
                    {headerTitle}
                </Text>
            </div>
            <CloseIcon
                className='cursor-pointer'
                onClick={() => {
                    history.push('/traders-hub');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
