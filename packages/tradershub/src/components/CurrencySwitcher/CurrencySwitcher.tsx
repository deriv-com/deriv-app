import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useResetVirtualBalance } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { IconToCurrencyMapper } from '../../constants/constants';
import { THooks } from '../../types';
import { ModalStepWrapper } from '../ModalStepWrapper';
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
    const { data: activeAccount } = useActiveTradingAccount();
    const isDemo = activeAccount?.is_virtual;
    const { show } = Provider.useModal();

    const iconCurrency = isDemo ? 'virtual' : activeAccount?.currency ?? 'virtual';

    const renderButton = () => {
        return (
            <Button
                className='py-900 rounded-200 border-sm border-system-light-less-prominent-text'
                colorStyle='black'
                fullWidth
                variant='secondary'
            >
                Add or manage account
            </Button>
        );
    };

    return (
        <div className='flex items-center justify-between border-solid h-3600 p-800 rounded-400 border-75 border-system-light-active-background w-full sm:w-auto sm:shrink-0 gap-800'>
            <div className='flex-none '>{IconToCurrencyMapper[iconCurrency].icon}</div>
            <div className='grow text-left'>
                <Text bold={!isDemo} className={!isDemo ? 'text-status-light-success' : undefined} size='sm'>
                    {isDemo ? 'Demo' : activeAccount?.display_balance}
                </Text>
                <Text
                    bold={isDemo}
                    className={isDemo ? 'text-status-light-information' : 'text-system-light-less-prominent-text'}
                    size='sm'
                >
                    {isDemo ? activeAccount.display_balance : IconToCurrencyMapper[iconCurrency].text}
                </Text>
            </div>
            <div className='flex-none'>
                <AccountActionButton balance={activeAccount?.balance ?? 0} isDemo={isDemo ?? false} />
            </div>
            {!isDemo && (
                <StandaloneChevronDownBoldIcon
                    className='cursor-pointer flex-none'
                    onClick={() => {
                        show(
                            <ModalStepWrapper renderFooter={renderButton} title='Select account'>
                                <TradingAccountsList />
                            </ModalStepWrapper>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default CurrencySwitcher;
