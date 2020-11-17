import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Field = ({ message, className, type }) => (
    <div
        className={classNames('dc-field', className, {
            'dc-field--error': type === 'error',
            'dc-field--warn': type === 'warn',
        })}
    >
        {message}
    </div>
);

Field.propTypes = {
    className: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.bool]),
    type: PropTypes.string.isRequired,
};

export default Field;
