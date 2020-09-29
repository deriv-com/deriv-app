import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Step = ({ children, className }) => {
    return <div className={classNames('wizard__step', className)}>{children}</div>;
};

Step.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Step;
