import React   from 'react';
import Loading from '../loading/loading.jsx';
import '../loading/loading.scss';

const ButtonLoading = (props) => {
    return (
        <Loading
            {...props}
            is_fullscreen={false}
            className='initial-loader--btn'
        />
    );
};

export default ButtonLoading;
