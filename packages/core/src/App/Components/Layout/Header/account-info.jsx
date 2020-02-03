import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';

const AccountInfo = ({ balance, currency, is_dialog_on, is_upgrade_enabled, is_virtual, toggleDialog }) => (
    <div className='acc-info__wrapper'>
        <div className='acc-info__separator' />
        <div
            className={classNames('acc-info', {
                'acc-info--show': is_dialog_on,
                'acc-info--is-virtual': is_virtual,
            })}
            onClick={toggleDialog}
        >
            <span className='acc-info__id'>
                <Icon
                    icon={`IcCurrency-${is_virtual ? 'virtual' : currency || 'Unknown'}`}
                    className={`acc-info__id-icon acc-info__id-icon--${is_virtual ? 'virtual' : currency}`}
                    size={24}
                />
            </span>
            {typeof balance !== 'undefined' && (
                <p className='acc-info__balance'>
                    <span
                        className={classNames('symbols', { [`symbols--${(currency || '').toLowerCase()}`]: currency })}
                    />
                    {!currency && <Localize i18n_default_text='No currency assigned' />}
                    {currency && balance}
                </p>
            )}
            <Icon icon='IcChevronDownBold' className='acc-info__select-arrow' />
        </div>
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
                <AccountSwitcher
                    is_visible={is_dialog_on}
                    toggle={toggleDialog}
                    is_upgrade_enabled={is_upgrade_enabled}
                />
            </div>
        </CSSTransition>
    </div>
);

AccountInfo.propTypes = {
    account_type: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    is_dialog_on: PropTypes.bool,
    is_upgrade_enabled: PropTypes.bool,
    is_virtual: PropTypes.bool,
    loginid: PropTypes.string,
    toggleDialog: PropTypes.func,
};

export default AccountInfo;
