import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const CfdPasswordModalInfo = () => {
    return (
        <div className='cfd-password-modal-info'>
            <Icon icon={'IcInfoLight'} />
            <Text size='xxxs'>
                <Localize
                    i18n_default_text='You are adding your Deriv MT5 Zero spread account under Deriv (BVI) Ltd, regulated by the British Virgin
            Islands Financial Services Commission (licence no. SIBA/L/18/1114).'
                />
            </Text>
        </div>
    );
};

export default CfdPasswordModalInfo;
