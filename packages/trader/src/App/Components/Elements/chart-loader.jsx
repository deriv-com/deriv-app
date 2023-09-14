import PropTypes from 'prop-types';
import React from 'react';
import Loading from '_common/components/loading';

const ChartLoader = ({ is_dark, is_visible }) =>
    is_visible ? (
        <div className='chart-container__loader'>
            <Loading theme={is_dark ? 'dark' : 'light'} data_testid='dt_barspinner' />
        </div>
    ) : null;

ChartLoader.propTypes = {
    is_dark: PropTypes.bool,
    is_visible: PropTypes.bool,
};

export default ChartLoader;
