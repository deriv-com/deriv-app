import React from 'react';
import { Loading } from '@deriv/components';

const LoadingModal = props => (
    <div className='account-signup-loader'>
        <Loading {...props} is_fullscreen={false} />
    </div>
);

export default LoadingModal;
