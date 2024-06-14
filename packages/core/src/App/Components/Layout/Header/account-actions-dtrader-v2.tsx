import React from 'react';
// import { Button, Counter, DesktopWrapper, Icon, MobileWrapper, Popover } from '@deriv/components';
import { StandaloneBellRegularIcon } from '@deriv/quill-icons';
import { formatMoney, moduleLoader } from '@deriv/shared';
import { LoginButton } from './login-button.jsx';
import { SignupButton } from './signup-button.jsx';
import 'Sass/app/_common/components/account-switcher.scss';
import { Badge } from '@deriv-com/quill-ui';

const AccountInfo = React.lazy(() =>
    moduleLoader(
        () =>
            import(
                /* webpackChunkName: "account-info", webpackPreload: true */ 'App/Components/Layout/Header/account-info.jsx'
            )
    )
);

type TAccountActionsDTraderV2 = {
    acc_switcher_disabled_message?: string;
    account_type?: string;
    balance?: number | string;
    currency: string;
    is_acc_switcher_disabled?: boolean;
    is_eu?: boolean;
    disableApp: () => void;
    enableApp: () => void;
    is_acc_switcher_on?: boolean;
    is_logged_in?: boolean;
    is_virtual?: boolean;
    notifications_count: number;
    toggleAccountsDialog: (value?: boolean | undefined) => void;
};

const AccountActionsDTraderV2 = React.memo(
    ({
        acc_switcher_disabled_message,
        account_type,
        balance,
        currency,
        disableApp,
        enableApp,
        is_acc_switcher_on,
        is_acc_switcher_disabled,
        is_eu,
        is_logged_in,
        is_virtual,
        notifications_count,
        toggleAccountsDialog,
    }: TAccountActionsDTraderV2) => {
        if (is_logged_in) {
            return (
                <React.Fragment>
                    <React.Suspense fallback={<div />}>
                        <AccountInfo
                            acc_switcher_disabled_message={acc_switcher_disabled_message}
                            account_type={account_type}
                            balance={typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)}
                            is_disabled={is_acc_switcher_disabled}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_eu={is_eu}
                            is_virtual={is_virtual}
                            is_mobile
                            currency={currency}
                            is_dialog_on={is_acc_switcher_on}
                            toggleDialog={toggleAccountsDialog}
                        />
                    </React.Suspense>
                    {/* TODO: old functionality was in <ToggleNotifications />. Current version is just placeholder without functionality*/}
                    <div className='notifications__wrapper'>
                        {notifications_count ? (
                            <Badge
                                variant='notification'
                                position='top-right'
                                label={notifications_count.toString()}
                                color='danger'
                                size='sm'
                                contentSize='sm'
                            >
                                <StandaloneBellRegularIcon iconSize='md' className='notifications__icon' />
                            </Badge>
                        ) : (
                            <StandaloneBellRegularIcon iconSize='md' className='notifications__icon' />
                        )}
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <LoginButton className='acc-info__button' />
                <SignupButton className='acc-info__button' />
            </React.Fragment>
        );
    }
);

AccountActionsDTraderV2.displayName = 'AccountActionsDTraderV2';

export { AccountActionsDTraderV2 };
