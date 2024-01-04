import React, { FC } from 'react';
import { Provider } from '@deriv/library';
import { Text } from '@deriv/quill-design';
import AddIcon from '../../../../public/images/add-icon.svg';
import { MT5AccountTypeModal } from '../../modals';

const GetMoreMT5Accounts: FC = () => {
    const { show } = Provider.useModal();

    return (
        <div
            className='flex items-start w-full cursor-pointer lg:w-1/3'
            onClick={() => show(<MT5AccountTypeModal />)}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    show(<MT5AccountTypeModal />);
                }
            }}
            role='button'
            tabIndex={0}
        >
            <div className='flex items-center self-stretch flex-1 border-dashed rounded-lg p-800 border-system-light-active-background gap-800 border-75'>
                <div className='w-12 h-12'>
                    <AddIcon />
                </div>
                <div className='flex flex-col items-start flex-1'>
                    <div className='self-stretch'>
                        <Text bold size='md'>
                            Get more
                        </Text>
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
