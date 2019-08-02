import PropTypes from 'prop-types';

export const CommonPropTypes = {
    calendar_date   : PropTypes.object, // moment object
    isPeriodDisabled: PropTypes.func,
    selected_date   : PropTypes.number,
    updateSelected  : PropTypes.func,
};
