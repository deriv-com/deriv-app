import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Modal }           from '@deriv/components';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';

const AccountSwitcherMobile = (props) => {
    const { disableApp, enableApp, is_visible, is_upgrade_enabled, toggle } = props;
    return (
        <Modal
            id='dt_account_switcher_modal'
            className='accounts-switcher'
            enableApp={enableApp}
            is_open={is_visible}
            disableApp={disableApp}
            has_close_icon={false}
            toggleModal={toggle}
            height='100%'
            width='calc(100vw - 42px)'
        >
            <div
                className={classNames(
                    'acc-switcher__wrapper',
                    'acc-switcher__wrapper--is-mobile')}
            >
                <AccountSwitcher
                    is_mobile
                    is_visible={true}
                    toggle={toggle}
                    is_upgrade_enabled={is_upgrade_enabled}
                />
            </div>
        </Modal>
    );
};

AccountSwitcherMobile.propTypes = {
    children        : PropTypes.any,
    onClose         : PropTypes.func,
    title           : PropTypes.string,
    visible         : PropTypes.bool,
    wrapperClassName: PropTypes.string,
};

export default AccountSwitcherMobile;
