import React from 'react';
import Loading, { TLoadingProps } from '../loading/loading';
import '../loading/loading.scss';

const ButtonLoading = (
    props: Omit<TLoadingProps, 'is_fullscreen' | 'className' | 'is_slow_loading' | 'status' | 'theme'>
) => {
    return <Loading {...props} is_fullscreen={false} className='initial-loader--btn' />;
};

export default ButtonLoading;
