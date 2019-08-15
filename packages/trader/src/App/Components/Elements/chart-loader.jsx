import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../templates/_common/components/loading.jsx';

const ChartLoader = ({ is_visible }) => (
    is_visible ?
    <div className='chart-container__loader'>
        <Loading theme='chart-loader' />
    </div>
    : null
);

ChartLoader.propTypes = {
    is_visible: PropTypes.bool,
};

export default ChartLoader;
