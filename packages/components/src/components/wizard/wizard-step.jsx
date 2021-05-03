import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Step = ({ children, className }) => <div className={classNames('wizard__main-step', className)}>{children}</div>;

Step.defaultProps = {
    children: [],
};

Step.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
};

export default Step;
