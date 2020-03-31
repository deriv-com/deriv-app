import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Div100vhContainer, Modal } from '@deriv/components';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';

const AccountSwitcherMobile = props => {
    const { disableApp, enableApp, is_visible, is_upgrade_enabled, toggle } = props;
    return (
        <Modal
            id='dt_account_switcher_modal'
            className='accounts-switcher'
            enableApp={enableApp}
            is_open={is_visible}
            is_vertical_top
            disableApp={disableApp}
            has_close_icon={false}
            toggleModal={toggle}
            height='auto'
            width='calc(100vw - 32px)'
        >
            <Div100vhContainer
                className={classNames('acc-switcher__wrapper', 'acc-switcher__wrapper--is-mobile')}
                max_autoheight_offset='48px'
            >
                <AccountSwitcher is_mobile is_visible={true} toggle={toggle} is_upgrade_enabled={is_upgrade_enabled} />
            </Div100vhContainer>
        </Modal>
    );
};

AccountSwitcherMobile.propTypes = {
    children: PropTypes.any,
    onClose: PropTypes.func,
    title: PropTypes.string,
    visible: PropTypes.bool,
    wrapperClassName: PropTypes.string,
};

export default AccountSwitcherMobile;
