import React from 'react';
import Loading from '../loading/loading';
import '../loading/loading.scss';

type TButtonLoadingProps = {
    [key: string]: React.ReactNode;
};

const ButtonLoading = (props: TButtonLoadingProps) => {
    return <Loading {...props} is_fullscreen={false} className='initial-loader--btn' />;
};

export default ButtonLoading;
