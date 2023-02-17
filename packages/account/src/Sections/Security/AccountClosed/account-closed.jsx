import React from 'react';
import { Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';

const AccountClosed = ({ logout }) => {
    const [is_modal_open, setModalState] = React.useState(true);
    const [timer, setTimer] = React.useState(10);
    const { is_appstore } = React.useContext(PlatformContext);

    React.useEffect(() => {
        window.history.pushState(null, null, '/');
        console.log('window.history', 'logout');
        logout();
        const handleInterval = setInterval(() => counter(), 1000);
        return () => {
            if (handleInterval) clearInterval(handleInterval);
        };
    }, [timer, is_modal_open, logout, counter]);

    const counter = React.useCallback(() => {
        if (timer > 0) {
            setTimer(timer - 1);
        } else {
            window.location.href = getStaticUrl('/', { is_appstore });
        }
    }, [is_appstore, timer]);

    return (
        <Modal
            is_open={is_modal_open}
            toggleModal={() => {
                setModalState(!is_modal_open);
            }}
        >
            <Text as='p' className='account-closed'>
                <Localize i18n_default_text='We’re sorry to see you leave. Your account is now closed.' /> {timer}
            </Text>
        </Modal>
    );
};

export default connect(({ client }) => ({
    logout: client.logout,
}))(AccountClosed);
