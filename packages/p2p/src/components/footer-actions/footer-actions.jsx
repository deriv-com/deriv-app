import React    from 'react';
import classNames from 'classnames';
import './footer-actions.scss';

const FooterActions = ({ children, has_border }) => (
    <div className={classNames('footer-actions', { 'footer-actions--bordered': has_border })}>
        { children }
    </div>
);

export default FooterActions;
