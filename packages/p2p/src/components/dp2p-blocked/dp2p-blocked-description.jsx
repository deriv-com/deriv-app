import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from '../i18next';

const Dp2pBlockedDescription = () => {
    const { general_store } = useStores();

    const getBlockedDescription = () => {
        if (general_store.is_p2p_blocked_for_pa) {
            return (
                <Localize i18n_default_text='P2P transactions are locked. This feature is not available for payment agents.' />
            );
        } else if (general_store.is_high_risk && !general_store.is_blocked) {
            return <Localize i18n_default_text='To enable this feature you must complete the following:' />;
        }
        return (
            <Localize
                i18n_default_text='Please use <0>live chat</0> to contact our Customer Support team for help.'
                components={[
                    <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                ]}
            />
        );
    };

    return (
        <Text className='dp2p-blocked__description' align='center' color='prominent' line_height='m' size='xs'>
            {getBlockedDescription()}
        </Text>
    );
};

export default observer(Dp2pBlockedDescription);
