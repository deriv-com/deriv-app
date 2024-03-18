import React, { Fragment, memo, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { twMerge } from 'tailwind-merge';
import { CUSTOM_STYLES } from '@/helpers';
import { useCurrencies, useDisableFiatCurrencies, useQueryParams, useRegulationFlags } from '@/hooks';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Tab, Tabs, Text } from '@deriv-com/ui';
import CurrenciesForm from './CurrenciesForm';

const TabTypes = {
    0: 'CRYPTO',
    1: 'FIAT',
} as const;

/**
 * @name AddOrManageAccount
 * @description The AddOrManageAccount component is used to display the Add or manage account modal.
 * @param {boolean} props.isOpen - The isOpen prop is a boolean that determines if the modal is open.
 * @param {VoidFunction} props.onClose - The onClose prop is a function that closes the modal.
 * @returns {React.ReactNode}
 */
const AddOrManageAccount = () => {
    const { data: currencies, isLoading, allCryptoCurrenciesAreAdded, addedFiatCurrency } = useCurrencies();
    const disableFiatCurrencies = useDisableFiatCurrencies();
    const [activeTab, setActiveTab] = useState<'CRYPTO' | 'FIAT'>(TabTypes[0]);

    const { isModalOpen, closeModal } = useQueryParams();

    const { isEU } = useRegulationFlags();

    useEffect(() => {
        if (isEU) {
            setActiveTab(TabTypes[1]);
        }
    }, [isEU]);

    if (isLoading) return null;

    const handleClose = () => {
        setActiveTab(TabTypes[0]);
        closeModal();
    };

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isModalOpen('AddOrManageAccount')}
            onRequestClose={handleClose}
            style={CUSTOM_STYLES}
        >
            <div
                className={twMerge(
                    `bg-system-light-primary-background lg:max-h-[717px] lg:max-w-[1040px] h-screen w-screen lg:rounded-default flex flex-col overflow-hidden ${
                        isEU ? 'lg:h-auto' : ''
                    }`
                )}
            >
                <div className='flex items-center justify-between w-full p-16 border-b border-solid lg:px-24 border-b-system-light-secondary-background'>
                    <Text as='h3' className='text-lg' weight='bold'>
                        {isEU ? 'Manage account' : 'Add or manage account'}
                    </Text>
                    <StandaloneXmarkBoldIcon className='cursor-pointer' onClick={handleClose} />
                </div>
                {!isEU && (
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
                )}
                {activeTab === TabTypes[0] && (
                    <Fragment>
                        <div className='flex flex-col items-center mt-24 first'>
                            <Text as='p' className='text-lg' weight='bold'>
                                Choose your preferred cryptocurrency
                            </Text>
                            <Text as='p' className='text-sm'>
                                You can open an account for each cryptocurrency.
                            </Text>
                        </div>
                        <CurrenciesForm
                            allCryptoCurrenciesAreAdded={allCryptoCurrenciesAreAdded}
                            currencies={currencies?.CRYPTO ?? []}
                            isSubmitButtonDisabled={allCryptoCurrenciesAreAdded}
                            type={TabTypes[0]}
                        />
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
                        <CurrenciesForm
                            addedFiatCurrency={addedFiatCurrency}
                            currencies={currencies?.FIAT ?? []}
                            disableFiatCurrencies={disableFiatCurrencies}
                            isSubmitButtonDisabled={disableFiatCurrencies}
                            submitButtonLabel='Change currency'
                        />
                    </Fragment>
                )}
            </div>
        </ReactModal>
    );
};

export default memo(AddOrManageAccount);
