import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useResetVirtualBalance } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { IconToCurrencyMapper } from '../../constants/constants';
import { THooks } from '../../types';
import { CurrencySwitcherLoader } from '../Loaders';
import { Modal } from '../Modal';
import { TradingAccountsList } from '../TradingAccountsList';

type AccountActionButtonProps = {
    balance: THooks.ActiveTradingAccount['balance'];
    isDemo: THooks.ActiveTradingAccount['is_virtual'];
};

const AccountActionButton = ({ balance, isDemo }: AccountActionButtonProps) => {
    const history = useHistory();
    const { mutate: resetVirtualBalance } = useResetVirtualBalance();
    let buttonText = 'Deposit';
    if (isDemo && balance !== 10000) {
        buttonText = 'Reset Balance';
    } else if (isDemo) {
        return null;
    }

    return (
        <Button
            className='flex items-center justify-center border-solid h-1600 py-300 px-800 rounded-200 border-75 border-system-light-less-prominent-text'
            colorStyle='black'
            onClick={() => {
                if (isDemo) {
                    resetVirtualBalance();
                } else {
                    history.push('/cashier/deposit');
                }
            }}
            variant='secondary'
        >
            {buttonText}
        </Button>
    );
};

const CurrencySwitcher = () => {
    const { data: activeAccount, isSuccess } = useActiveTradingAccount();
    const isDemo = activeAccount?.is_virtual;
    const { show } = Provider.useModal();

    const iconCurrency = isDemo ? 'virtual' : activeAccount?.currency ?? 'virtual';

    if (!isSuccess) return <CurrencySwitcherLoader />;

    return (
        <div className='flex items-center justify-between w-full border-solid h-3600 p-800 rounded-400 border-75 border-system-light-active-background lg:w-auto lg:shrink-0 gap-800'>
            <div className='flex-none '>{IconToCurrencyMapper[iconCurrency].icon}</div>
            <div className='grow'>
                <Text
                    bold={isDemo}
                    className={isDemo ? 'text-status-light-information' : 'text-system-light-less-prominent-text'}
                    size='sm'
                >
                    {isDemo ? activeAccount.display_balance : IconToCurrencyMapper[iconCurrency].text}
                </Text>
                <Text bold={!isDemo} className={!isDemo ? 'text-status-light-success' : undefined} size='sm'>
                    {isDemo ? 'Demo' : activeAccount?.display_balance}
                </Text>
            </div>
            <div className='flex-none'>
                <AccountActionButton balance={activeAccount?.balance ?? 0} isDemo={isDemo ?? false} />
            </div>
            {!isDemo && (
                <StandaloneChevronDownBoldIcon
                    className='flex-none cursor-pointer'
                    onClick={() => {
                        show(
                            <Modal>
                                <Modal.Header title='Select account' titleClassName='text-[14px] lg:text-[16px]' />
                                <Modal.Content>
                                    <TradingAccountsList />
                                </Modal.Content>
                                <Modal.Footer className='grid-cols-1'>
                                    <Button
                                        className='py-900 rounded-200 border-sm border-system-light-less-prominent-text'
                                        colorStyle='black'
                                        fullWidth
                                        variant='secondary'
                                    >
                                        Add or manage account
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default CurrencySwitcher;
