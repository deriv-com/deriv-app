import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TAdStatusProps = {
    is_active?: boolean;
};

const AdStatus = ({ is_active = false }: TAdStatusProps) => {
    return (
        <Text
            align='center'
            className={is_active ? 'ad-status--active' : 'ad-status--inactive'}
            color={is_active ? 'profit-success' : 'loss-danger'}
            line_height='s'
            size='xs'
            weight='bold'
        >
            {is_active ? <Localize i18n_default_text='Active' /> : <Localize i18n_default_text='Inactive' />}
        </Text>
    );
};

export default AdStatus;
