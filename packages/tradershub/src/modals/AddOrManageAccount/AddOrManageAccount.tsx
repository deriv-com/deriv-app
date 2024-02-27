import React, { Fragment, memo, useState } from 'react';
import ReactModal from 'react-modal';
import { CUSTOM_STYLES } from '@/helpers';
import { useCurrencies } from '@/hooks';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Tab, Tabs, Text } from '@deriv-com/ui';
import CurrenciesForm from './CurrenciesForm';

type TAddOrManageAccount = {
    isOpen: boolean;
    onClose: VoidFunction;
};

const TabTypes = {
    0: 'CRYPTO',
    1: 'FIAT',
} as const;

/**
 * @name AddOrManageAccount
 * @description The AddOrManageAccount component is used to display the Add or manage account modal.
 * @param {TAddOrManageAccount} props - The props of the component.
 * @param {boolean} props.isOpen - The isOpen prop is a boolean that determines if the modal is open.
 * @param {VoidFunction} props.onClose - The onClose prop is a function that closes the modal.
 * @returns {React.ReactNode}
 */
const AddOrManageAccount = ({ isOpen, onClose }: TAddOrManageAccount) => {
    const { data: currencies, isLoading } = useCurrencies();
    const [activeTab, setActiveTab] = useState<'CRYPTO' | 'FIAT'>(TabTypes[0]);

    if (isLoading) return null;

    const handleClose = () => {
        setActiveTab(TabTypes[0]);
        onClose();
    };

    return (
        <ReactModal ariaHideApp={false} isOpen={isOpen} onRequestClose={handleClose} style={CUSTOM_STYLES}>
            <div className='bg-system-light-primary-background lg:max-h-[717px] lg:max-w-[1040px] h-screen w-screen lg:rounded-default flex flex-col overflow-hidden'>
                <div className='flex items-center justify-between w-full px-16 py-16 border-b border-solid lg:px-24 border-b-system-light-secondary-background'>
                    <Text as='h3' className='text-lg' weight='bold'>
                        Add or manage account
                    </Text>
                    <StandaloneXmarkBoldIcon className='cursor-pointer' onClick={handleClose} />
                </div>
                <Tabs
                    TitleFontSize='sm'
                    className='lg:w-[35%]'
                    onChange={idx => setActiveTab(TabTypes[idx as keyof typeof TabTypes])}
                    variant='secondary'
                    wrapperClassName='flex justify-center'
                >
                    <Tab title='Cryptocurrencies' />
                    <Tab title='Fiat currenciess' />
                </Tabs>
                {activeTab === TabTypes[0] && (
                    <Fragment>
                        <div className='flex flex-col items-center mt-24'>
                            <Text as='p' className='text-lg' weight='bold'>
                                Choose your preferred cryptocurrency
                            </Text>
                            <Text as='p' className='text-sm'>
                                You can open an account for each cryptocurrency.
                            </Text>
                        </div>
                        <CurrenciesForm currencies={currencies?.CRYPTO ?? []} />
                    </Fragment>
                )}
                {activeTab === TabTypes[1] && (
                    <Fragment>
                        <div className='flex flex-col items-center mt-24'>
                            <Text as='p' className='text-lg' weight='bold'>
                                Change your currency
                            </Text>
                            <Text as='p' className='text-sm'>
                                Choose the currency you would like to trade with.
                            </Text>
                        </div>
                        <CurrenciesForm currencies={currencies?.FIAT ?? []} submitButtonLabel='Change currency' />
                    </Fragment>
                )}
            </div>
        </ReactModal>
    );
};

export default memo(AddOrManageAccount);
