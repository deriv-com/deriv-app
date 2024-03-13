import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CurrencySwitcherLoader, Modal, TradingAccountsList } from '@/components';
import { IconToCurrencyMapper } from '@/constants';
import { useRegulationFlags } from '@/hooks';
import { AddOrManageAccount } from '@/modals';
import { useModal } from '@/providers';
import { THooks } from '@/types';
import { useActiveTradingAccount, useResetVirtualBalance } from '@deriv/api-v2';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { DemoCurrencySwitcherAccountInfo, RealCurrencySwitcherAccountInfo } from './CurrencySwitcherAccountInfo';

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
            color='black'
            onClick={() => {
                if (isDemo) {
                    resetVirtualBalance();
                } else {
                    history.push('/cashier/deposit');
                }
            }}
            variant='outlined'
        >
            {buttonText}
        </Button>
    );
};

const CurrencySwitcher = () => {
    const [isManageAccountOpen, setIsManageAccountOpen] = useState(false);
    const { data: activeAccount, isSuccess } = useActiveTradingAccount();
    const isDemo = activeAccount?.is_virtual;
    const { show, hide } = useModal();

    const { noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags();
    const onManageAccountClose = useCallback(() => setIsManageAccountOpen(false), []);

    const iconCurrency = isDemo ? 'virtual' : activeAccount?.currency ?? 'virtual';

    if (noRealCRNonEUAccount || noRealMFEUAccount) return null;

    if (!isSuccess) return <CurrencySwitcherLoader />;

    const { icon, text } = IconToCurrencyMapper[iconCurrency];

    return (
        <div className='flex items-center justify-between w-full gap-16 p-16 border-solid rounded-default border-1 border-system-light-active-background lg:w-auto lg:shrink-0'>
            <div className='flex-none '>{icon}</div>
            <div className='grow'>
                {isDemo ? (
                    <DemoCurrencySwitcherAccountInfo displayBalance={activeAccount?.display_balance} />
                ) : (
                    <RealCurrencySwitcherAccountInfo
                        currencyText={text}
                        displayBalance={activeAccount?.display_balance}
                    />
                )}
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
                                        color='black'
                                        isFullWidth
                                        onClick={() => {
                                            setIsManageAccountOpen(true);
                                            hide();
                                        }}
                                        variant='outlined'
                                    >
                                        Add or manage account
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        );
                    }}
                />
            )}
            <AddOrManageAccount isOpen={isManageAccountOpen} onClose={onManageAccountClose} />
        </div>
    );
};

export default CurrencySwitcher;
