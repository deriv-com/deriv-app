import React from 'react';
import { Text } from '@deriv/quill-design';
import { useModal } from '../../../../components/ModalProvider';
import AddIcon from '../../../../public/images/add-icon.svg';
import { MT5AccountTypeModal } from '../../modals';

const GetMoreMT5Accounts: React.FC = () => {
    const { show } = useModal();

    return (
        <div
            className='flex items-start cursor-pointer w-full lg:w-1/3'
            onClick={() => show(<MT5AccountTypeModal />)}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    show(<MT5AccountTypeModal />);
                }
            }}
            role='button'
            tabIndex={0}
        >
            <div className='flex p-800 items-center self-stretch rounded-lg border-system-light-active-background flex-1 gap-800 border-75 border-dashed'>
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
