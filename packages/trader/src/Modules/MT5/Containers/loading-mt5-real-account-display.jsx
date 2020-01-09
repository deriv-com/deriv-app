import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../templates/_common/components/loading.jsx';

const LoadingMT5RealAccountDisplay = ({ loading }) => {
    return loading && (
        <div className='mt5-real-accounts-display'>
            <Loading />
        </div>
    );
};

LoadingMT5RealAccountDisplay.propTypes = {
    loading: PropTypes.bool,
};

export default LoadingMT5RealAccountDisplay;
