import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from '../i18next';

const Dp2pBlockedDescription = () => {
    const { general_store } = useStores();

    return (
        <Text className='dp2p-blocked__description' align='center' color='prominent' line_height='m' size='xs'>
            {general_store.is_high_risk_fully_authed_without_fa ? (
                <Localize i18n_default_text='To enable this feature you must complete the following:' />
            ) : (
                <Localize i18n_default_text='Please use live chat to contact our Customer Support team for help.' />
            )}
        </Text>
    );
};

export default observer(Dp2pBlockedDescription);
