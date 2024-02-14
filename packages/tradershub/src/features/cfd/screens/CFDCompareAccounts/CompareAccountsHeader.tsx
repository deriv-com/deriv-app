import React from 'react';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@/assets/svgs/ic-close-dark.svg';
import { Text } from '@deriv-com/ui';

type TCompareAccountsHeader = {
    isDemo?: boolean;
    isEuRegion?: boolean;
};

const CompareAccountsHeader = ({ isDemo, isEuRegion }: TCompareAccountsHeader) => {
    const history = useHistory();

    const headerTitle = isEuRegion
        ? `Deriv MT5 CFDs ${isDemo ? 'Demo' : 'real'} account`
        : `Compare CFDs ${isDemo ? 'demo ' : ''}accounts`;

    return (
        <div className='sticky flex items-center border-solid z-[999] border-b-2 py-0 px-10 top-0 h-50 bg-system-light-primary-background'>
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
