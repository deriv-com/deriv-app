import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, Icon, MobileWrapper, Popover } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile.jsx';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';

const AccountInfoWrapper = ({ is_disabled, disabled_message, children }) =>
    is_disabled && disabled_message ? (
        <Popover alignment='bottom' message={disabled_message} zIndex={99999}>
            {children}
        </Popover>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );

const AccountInfoIcon = ({ is_virtual, currency }) => (
    <Icon
        icon={`IcCurrency-${is_virtual ? 'virtual' : currency || 'Unknown'}`}
        className={`acc-info__id-icon acc-info__id-icon--${is_virtual ? 'virtual' : currency}`}
        size={24}
    />
);

const AccountInfo = ({
    acc_switcher_disabled_message,
    balance,
    currency,
    disableApp,
    enableApp,
    is_dialog_on,
    is_virtual,
    toggleDialog,
    is_disabled,
}) => {
    const currency_lower = currency.toLowerCase();
    return (
        <div className='acc-info__wrapper'>
            <div className='acc-info__separator' />
            <AccountInfoWrapper is_disabled={is_disabled} disabled_message={acc_switcher_disabled_message}>
                <div
                    id='dt_core_account-info_acc-info'
                    className={classNames('acc-info', {
                        'acc-info--show': is_dialog_on,
                        'acc-info--is-virtual': is_virtual,
                        'acc-info--is-disabled': is_disabled,
                    })}
                    onClick={is_disabled ? undefined : () => toggleDialog()}
                >
                    <span className='acc-info__id'>
                        <DesktopWrapper>
                            <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                        </DesktopWrapper>
                        <MobileWrapper>
                            {(is_virtual || currency) && (
                                <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                            )}
                        </MobileWrapper>
                    </span>
                    {(typeof balance !== 'undefined' || !currency) && (
                        <p
                            className={classNames('acc-info__balance', {
                                'acc-info__balance--no-currency': !currency && !is_virtual,
                            })}
                        >
                            {!currency ? (
                                <Localize i18n_default_text='No currency assigned' />
                            ) : (
                                `${balance} ${getCurrencyDisplayCode(currency)}`
                            )}
                        </p>
                    )}
                    {is_disabled ? (
                        <Icon icon='IcLock' />
                    ) : (
                        <Icon icon='IcChevronDownBold' className='acc-info__select-arrow' />
                    )}
                </div>
            </AccountInfoWrapper>
            <MobileWrapper>
                <AccountSwitcherMobile
                    is_visible={is_dialog_on}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    toggle={toggleDialog}
                />
            </MobileWrapper>
            <DesktopWrapper>
                <CSSTransition
                    in={is_dialog_on}
                    timeout={200}
                    classNames={{
                        enter: 'acc-switcher__wrapper--enter',
                        enterDone: 'acc-switcher__wrapper--enter-done',
                        exit: 'acc-switcher__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='acc-switcher__wrapper'>
                        <AccountSwitcher is_visible={is_dialog_on} toggle={toggleDialog} />
                    </div>
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

AccountInfo.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    is_dialog_on: PropTypes.bool,
    is_disabled: PropTypes.bool,
    is_virtual: PropTypes.bool,
    loginid: PropTypes.string,
    toggleDialog: PropTypes.func,
};

export default AccountInfo;
