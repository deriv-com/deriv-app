import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Checklist, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import './verification.scss';

const Verification = observer(() => {
    const { general_store } = useStores();

    if (!general_store.is_advertiser && general_store.poi_status === 'verified' && general_store.nickname) {
        return (
            <div className='p2p-blocked-user'>
                <Localize i18n_default_text='Your DP2P cashier has been blocked. Please contact customer support.' />
            </div>
        );
    }

    return (
        <div className='p2p-verification'>
            <Icon icon='IcCashierSendEmail' className='p2p-verification__icon' size={102} />
            <div className='p2p-verification__text'>
                <div className='p2p-verification__text-title'>
                    <Localize i18n_default_text='Please register with us!' />
                </div>
                <div className='p2p-verification__text-description'>
                    <Text as='p' size='xs' line_height='s' align='center'>
                        <Localize i18n_default_text='To use DP2P, you need to choose a display name (a nickname) and verify your identity.' />
                    </Text>
                </div>
            </div>
            <Checklist className='p2p-verification__checklist' items={general_store.getVerificationChecklist()} />
        </div>
    );
});

Verification.propTypes = {
    is_advertiser: PropTypes.bool,
};

export default Verification;
