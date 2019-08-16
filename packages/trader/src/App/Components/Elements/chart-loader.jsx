import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../templates/app/components/loading.jsx';

const ChartLoader = ({ is_dark, is_visible }) => (
    is_visible ?
        <div className='chart-container__loader'>
            <Loading theme={is_dark ? 'dark' : 'light'} />
        </div>
        : null
);

ChartLoader.propTypes = {
    is_dark   : PropTypes.bool,
    is_visible: PropTypes.bool,
};

export default ChartLoader;
