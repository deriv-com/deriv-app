import PropTypes from 'prop-types';

export const CommonPropTypes = {
    calendar_date   : PropTypes.string,
    isPeriodDisabled: PropTypes.func,
    selected_date   : PropTypes.string,
    updateSelected  : PropTypes.func,
};
