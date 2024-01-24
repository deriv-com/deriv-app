import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useResetVirtualBalance } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { IconToCurrencyMapper } from '../../constants/constants';
import useRegulationFlags from '../../hooks/useRegulationFlags';
import { THooks } from '../../types';
import { CurrencySwitcherLoader } from '../Loaders';
import { Modal } from '../Modal';
import { TradingAccountsList } from '../TradingAccountsList';
import { useUIContext } from '../UIProvider';

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
    const { getUIState } = useUIContext();

    const accountType = getUIState('accountType');

    const regulation = getUIState('regulation');

    const { noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags(regulation, accountType);

    const iconCurrency = isDemo ? 'virtual' : activeAccount?.currency ?? 'virtual';

    if (noRealCRNonEUAccount || noRealMFEUAccount) return null;

    if (!isSuccess) return <CurrencySwitcherLoader />;

    const DemoCurrencySwitcherAccountInfo = () => (
        <Fragment>
            <Text bold className='font-light text-system-light-less-prominent-text' size='sm'>
                Demo
            </Text>
            <Text bold className='text-status-light-information' size='sm'>
                {activeAccount?.display_balance}
            </Text>
        </Fragment>
    );

    const RealCurrencySwitcherAccountInfo = () => (
        <Fragment>
            <Text bold className='text-status-light-success' size='sm'>
                {activeAccount?.display_balance}
            </Text>
            <Text className='text-system-light-less-prominent-text' size='sm'>
                {IconToCurrencyMapper[iconCurrency].text}
            </Text>
        </Fragment>
    );

    return (
        <div className='flex items-center justify-between w-full border-solid h-3600 p-800 rounded-400 border-75 border-system-light-active-background lg:w-auto lg:shrink-0 gap-800'>
            <div className='flex-none '>{IconToCurrencyMapper[iconCurrency].icon}</div>
            <div className='grow'>
                {isDemo ? <DemoCurrencySwitcherAccountInfo /> : <RealCurrencySwitcherAccountInfo />}
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
