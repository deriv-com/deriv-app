import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import AccountSwitcher from 'App/Containers/AccountSwitcher';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
import AccountInfoWrapper from './account-info-wrapper';
import AccountInfoIcon from './account-info-icon';

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
    is_mobile,
}) => {
    const currency_lower = currency?.toLowerCase();
    const { isDesktop } = useDevice();

    return (
        <div className='acc-info__wrapper'>
            {isDesktop && <div className='acc-info__separator' />}
            <AccountInfoWrapper
                is_disabled={is_disabled}
                disabled_message={acc_switcher_disabled_message}
                is_mobile={is_mobile}
            >
                <div
                    data-testid='dt_acc_info'
                    id='dt_core_account-info_acc-info'
                    className={classNames('acc-info', {
                        'acc-info--show': is_dialog_on,
                        'acc-info--is-virtual': is_virtual,
                        'acc-info--is-disabled': is_disabled,
                    })}
                    onClick={is_disabled ? undefined : () => toggleDialog()}
                >
                    <span className='acc-info__id'>
                        {isDesktop ? (
                            <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                        ) : (
                            (is_virtual || currency) && (
                                <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                            )
                        )}
                    </span>
                    <div className='acc-info__content'>
                        <div className='acc-info__account-type-header'>
                            <Text as='p' size='xxs' className='acc-info__account-type'>
                                {is_virtual ? localize('Demo') : localize('Real')}
                            </Text>
                            {is_disabled ? (
                                <Icon
                                    data_testid='dt_lock_icon'
                                    icon='IcLock'
                                    className='acc-info__select-arrow'
                                    size={12}
                                />
                            ) : (
                                <Icon
                                    data_testid='dt_select_arrow'
                                    icon='IcChevronDownBold'
                                    className='acc-info__select-arrow'
                                    size={12}
                                />
                            )}
                        </div>
                        {(typeof balance !== 'undefined' || !currency) && (
                            <div className='acc-info__balance-section'>
                                <p
                                    data-testid='dt_balance'
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
                            </div>
                        )}
                    </div>
                </div>
            </AccountInfoWrapper>
            <div className='acc-info__separator' />
            {isDesktop ? (
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
            ) : (
                <AccountSwitcherMobile
                    is_visible={is_dialog_on}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    toggle={toggleDialog}
                />
            )}
        </div>
    );
};

AccountInfo.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_dialog_on: PropTypes.bool,
    is_disabled: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_mobile: PropTypes.bool,
    loginid: PropTypes.string,
    toggleDialog: PropTypes.func,
};

export default AccountInfo;
