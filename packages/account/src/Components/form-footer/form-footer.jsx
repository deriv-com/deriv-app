import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';

const FormFooter = ({ children, is_dashboard }) => (
    <div
        className={classNames('account-form__footer', {
            'account-form__footer--dashboard': is_dashboard,
        })}
    >
        {children}
    </div>
);

FormFooter.prototype = {
    children: PropTypes.object,
    is_dashboard: PropTypes.bool,
};

export default FormFooter;
