import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ActionScreen, ButtonGroup, Dialog, Modal, SentEmailContent } from '@/components';
import { Category, MarketType, PlatformDetails, QueryStatus } from '@cfd/constants';
import { CFDSuccess, CreatePassword, EnterPassword } from '@cfd/screens';
import {
    useAccountStatus,
    useActiveTradingAccount,
    useCreateOtherCFDAccount,
    useDxtradeAccountsList,
} from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, useBreakpoint } from '@deriv/quill-design';
import DxTradePasswordIcon from '../../../../public/images/cfd/dxtrade-password.svg';

const DxtradePasswordModal = () => {
    const history = useHistory();
    const { isMobile } = useBreakpoint();
    const [password, setPassword] = useState('');
    const { data: getAccountStatus, isSuccess: accountStatusSuccess } = useAccountStatus();
    const { error, isLoading, isSuccess, mutate, status } = useCreateOtherCFDAccount();
    const { isSuccess: dxtradeAccountListSuccess } = useDxtradeAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;
    const { hide, show } = Provider.useModal();
    const accountType = activeTrading?.is_virtual ? Category.DEMO : Category.REAL;
    const dxtradePlatform = PlatformDetails.dxtrade.platform;

    const isDxtradePasswordNotSet = getAccountStatus?.is_dxtrade_password_not_set;

    const onSubmit = useCallback(() => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: MarketType.ALL,
                password,
                platform: dxtradePlatform,
            },
        });
    }, [mutate, accountType, password, dxtradePlatform]);

    const renderFooter = useMemo(() => {
        if (isSuccess) {
            if (accountType === Category.DEMO) {
                return (
                    <Button onClick={hide} size='lg'>
                        OK
                    </Button>
                );
            }
            return (
                <ButtonGroup>
                    <Button colorStyle='black' onClick={() => hide()} size='lg' variant='secondary'>
                        Maybe later
                    </Button>
                    <Button
                        onClick={() => {
                            hide();
                            history.push('cashier/transfer');
                        }}
                        size='lg'
                    >
                        Transfer funds
                    </Button>
                </ButtonGroup>
            );
        }

        if (!isDxtradePasswordNotSet) {
            return (
                <ButtonGroup>
                    <Button colorStyle='black' size='lg' variant='secondary'>
                        Forgot password?
                    </Button>
                    <Button disabled={!password || isLoading} isLoading={isLoading} onClick={onSubmit} size='lg'>
                        Add account
                    </Button>
                </ButtonGroup>
            );
        }

        return (
            <Button disabled={!password || isLoading} fullWidth isLoading={isLoading} onClick={onSubmit} size='lg'>
                {`Create ${PlatformDetails.dxtrade.title} password`}
            </Button>
        );
    }, [accountType, hide, history, isDxtradePasswordNotSet, isLoading, isSuccess, onSubmit, password]);

    const successComponent = useMemo(() => {
        const renderSuccessDescription = () => {
            return isDemo
                ? `Congratulations, you have successfully created your ${Category.DEMO} ${PlatformDetails.dxtrade.title} account.`
                : `Congratulations, you have successfully created your ${Category.REAL} ${PlatformDetails.dxtrade.title} account. To start trading, transfer funds from your Deriv account into this account.`;
        };
        if (isSuccess && dxtradeAccountListSuccess) {
            return (
                <CFDSuccess
                    description={renderSuccessDescription()}
                    platform={dxtradePlatform}
                    renderButtons={() => renderFooter}
                />
            );
        }
    }, [isSuccess, dxtradeAccountListSuccess, isDemo, dxtradePlatform, renderFooter]);

    const passwordComponent = useMemo(() => {
        if (!isSuccess && accountStatusSuccess) {
            return isDxtradePasswordNotSet ? (
                <CreatePassword
                    icon={<DxTradePasswordIcon />}
                    isLoading={isLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform={dxtradePlatform}
                />
            ) : (
                <EnterPassword
                    isLoading={isLoading}
                    marketType={MarketType.ALL}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() => show(<SentEmailContent platform={dxtradePlatform} />)}
                    password={password}
                    passwordError={error?.error?.code === 'PasswordError'}
                    platform={dxtradePlatform}
                />
            );
        }
    }, [
        isSuccess,
        accountStatusSuccess,
        isDxtradePasswordNotSet,
        isLoading,
        onSubmit,
        password,
        show,
        dxtradePlatform,
        error?.error?.code,
    ]);

    if (status === QueryStatus.ERROR && error?.error?.code !== 'PasswordError') {
        return <ActionScreen description={error?.error.message} title={error?.error?.code} />;
    }

    if (isMobile) {
        return (
            <Modal>
                <Modal.Content>
                    {successComponent}
                    {passwordComponent}
                </Modal.Content>
                <Modal.Footer>{renderFooter}</Modal.Footer>
            </Modal>
        );
    }
    return (
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                {successComponent}
                {passwordComponent}
            </Dialog.Content>
        </Dialog>
    );
};

export default DxtradePasswordModal;
