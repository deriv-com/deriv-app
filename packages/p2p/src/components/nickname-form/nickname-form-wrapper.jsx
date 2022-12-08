import * as React from 'react';
import { Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStore } from '@deriv/stores';
import './nickname-form.scss';

const NicknameFormWrapper = ({ children }) => {
    const {
        modules: { p2p_store },
    } = useStore();
    const { general_store } = p2p_store;

    if (isMobile()) {
        return (
            <div className='dp2p-nickname__container' data-testid='mobile_nicknme_form'>
                {children}
            </div>
        );
    }

    return (
        <Modal className='dp2p-nickname__container' width='440px' is_open={general_store.should_show_popup}>
            {children}
        </Modal>
    );
};

export default observer(NicknameFormWrapper);
