import React, { useState } from 'react';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Loading } from '@deriv/components';
import { useTransferBetweenAccounts } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TransferAmountTimer, TransferAmountInput, TransferAccountSelector, TransferMessageList } from './components';
import type { TInitialValues } from './types';
import './wallet-transfer.scss';

type TWalletTransferProps = {
    contentScrollHandler: React.UIEventHandler<HTMLDivElement>;
    is_wallet_name_visible: boolean;
    setIsWalletNameVisible: (value: boolean) => void;
};

const Divider = () => <div className='wallet-transfer__divider' />;

const WalletTransfer = observer(
    ({ contentScrollHandler, is_wallet_name_visible, setIsWalletNameVisible }: TWalletTransferProps) => {
        const { client } = useStore();
        const { is_switching } = client;
        const { active_wallet, isLoading: is_accounts_loading } = useTransferBetweenAccounts();
        const [timer_key, setTimerKey] = useState(0);

        if (is_accounts_loading || is_switching) {
            return <Loading is_fullscreen={false} />;
        }

        const initial_values: TInitialValues = {
            to_amount: 0,
            from_amount: 0,
            to_account: undefined,
            from_account: active_wallet,
        };

        return (
            <div className='wallet-transfer'>
                <Formik
                    enableReinitialize
                    initialValues={initial_values}
                    onSubmit={() => undefined}
                    validateOnBlur={false}
                >
                    {({ values, errors }) => {
                        const { to_account, to_amount } = values;
                        const is_error = Array.isArray(errors.from_amount) && errors.from_amount?.length > 0;

                        return (
                            <Form noValidate>
                                <div className='wallet-transfer__tiles-container'>
                                    <div
                                        className={classNames('wallet-transfer__tile', {
                                            'wallet-transfer__tile-disable-margin-bottom': is_error,
                                        })}
                                    >
                                        <TransferAmountInput field_name='from_amount' setTimerKey={setTimerKey} />
                                        <Divider />
                                        <TransferAccountSelector
                                            name='from_account'
                                            contentScrollHandler={contentScrollHandler}
                                            is_wallet_name_visible={is_wallet_name_visible}
                                            setIsWalletNameVisible={setIsWalletNameVisible}
                                        />
                                    </div>
                                    <TransferMessageList />
                                    <div className='wallet-transfer__tile'>
                                        <div className='tile__amount-with-timer'>
                                            <TransferAmountInput field_name='to_amount' setTimerKey={setTimerKey} />
                                            <TransferAmountTimer key={timer_key} />
                                        </div>
                                        <Divider />
                                        <TransferAccountSelector
                                            name='to_account'
                                            contentScrollHandler={contentScrollHandler}
                                            is_wallet_name_visible={is_wallet_name_visible}
                                            setIsWalletNameVisible={setIsWalletNameVisible}
                                        />
                                    </div>
                                </div>
                                <div className='wallet-transfer__transfer-button'>
                                    <Button
                                        primary
                                        large
                                        type='submit'
                                        disabled={!to_account || to_amount === 0 || is_error}
                                    >
                                        <Localize i18n_default_text='Transfer' />
                                    </Button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        );
    }
);

export default WalletTransfer;
