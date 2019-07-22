import PropTypes from 'prop-types';

export const CommonPropTypes = {
    calendar_date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    isPeriodDisabled: PropTypes.func,
    selected_date   : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    updateSelected: PropTypes.func,
};
