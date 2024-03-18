import React, { FC } from 'react';
import AddIcon from '@/assets/svgs/add-icon.svg';
import { useQueryParams } from '@/hooks';
import { Text } from '@deriv-com/ui';

const GetMoreMT5Accounts: FC = () => {
    const { openModal } = useQueryParams();

    return (
        <div
            className='flex items-start w-full cursor-pointer'
            onClick={() => openModal('MT5AccountTypeModal')}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    openModal('MT5AccountTypeModal');
                }
            }}
            role='button'
            tabIndex={0}
        >
            <div className='flex items-center self-stretch flex-1 gap-16 p-16 border-dashed rounded-lg border-system-light-active-background border-1'>
                <div className='w-36 h-36'>
                    <AddIcon />
                </div>
                <div className='flex flex-col items-start flex-1'>
                    <div className='self-stretch'>
                        <Text weight='bold'>Get more</Text>
                    </div>
                    <div className='self-stretch'>
                        <Text size='sm'>Get more Deriv MT5 accounts under your preferred jurisdictions.</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetMoreMT5Accounts;
