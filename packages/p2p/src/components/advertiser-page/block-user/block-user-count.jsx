import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from '@deriv/components';
// import { useStores } from 'Stores';
import './block-user-count.scss';

const BlockUserCount = () => {
    return (
        <div className='block-user-count' style={{ display: 'flex', alignItems: 'center' }}>
            <Icon className='block-user-count__icon' icon='IcUserOutline' />
            12
        </div>
    );
};

export default observer(BlockUserCount);
