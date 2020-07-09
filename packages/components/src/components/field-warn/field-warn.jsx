import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const FieldWarn = ({ message, className }) => <p className={classNames('dc-field-warn', className)}>{message}</p>;

FieldWarn.propTypes = {
    className: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.bool]),
};

export default FieldWarn;
