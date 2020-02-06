import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './footer-actions.scss';

const FooterActions = ({ children, has_border }) => (
    <div className={classNames('footer-actions', { 'footer-actions--bordered': has_border })}>{children}</div>
);

FooterActions.propTypes = {
    children: PropTypes.node,
    has_border: PropTypes.bool,
};

export default FooterActions;
