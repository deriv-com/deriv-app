import PropTypes from 'prop-types';

const ChartLoader = ({ is_visible }) => (is_visible ? null : null);

ChartLoader.propTypes = {
    is_dark: PropTypes.bool,
    is_visible: PropTypes.bool,
};

export default ChartLoader;
