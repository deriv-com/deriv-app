import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Modal } from '@deriv/components';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';

type AccountSwitcherMobileProps = {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
    visible: boolean;
    wrapperClassName: string;
};

const AccountSwitcherMobile = (props: AccountSwitcherMobileProps) => {
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

export default AccountSwitcherMobile;
