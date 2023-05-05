import * as React from 'react';
import { Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import './nickname-form.scss';

const NicknameFormWrapper = ({ children }) => {
    const { general_store } = useStores();

    if (isMobile()) {
        return <div data-testid='mobile_nickname_form'>{children}</div>;
    }

    return (
        <Modal width='440px' is_open={general_store.should_show_popup}>
            {children}
        </Modal>
    );
};

export default observer(NicknameFormWrapper);
