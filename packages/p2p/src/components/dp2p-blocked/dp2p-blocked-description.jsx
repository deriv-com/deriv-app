import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from '../i18next';

const Dp2pBlockedDescription = () => {
    const { general_store } = useStores();

    let blocked_description;

    if (general_store.is_high_risk_fully_authed_without_fa) {
        if (general_store.is_p2p_blocked_for_pa) {
            blocked_description = (
                <Localize i18n_default_text='P2P transactions are locked. This feature is not available for payment agents.' />
            );
        } else {
            blocked_description = (
                <Localize i18n_default_text='To enable this feature you must complete the following:' />
            );
        }
    } else if (general_store.is_p2p_blocked_for_pa) {
        blocked_description = (
            <Localize i18n_default_text='P2P transactions are locked. This feature is not available for payment agents.' />
        );
    } else {
        blocked_description = (
            <Localize
                i18n_default_text='Please use <0>live chat</0> to contact our Customer Support team for help.'
                components={[
                    <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                ]}
            />
        );
    }

    return (
        <Text className='dp2p-blocked__description' align='center' color='prominent' line_height='m' size='xs'>
            {blocked_description}
        </Text>
    );
};

export default observer(Dp2pBlockedDescription);
