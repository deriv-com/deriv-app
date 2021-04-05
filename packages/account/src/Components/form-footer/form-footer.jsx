import React from 'react';
import { PropTypes } from 'prop-types';
import { PlatformContext } from '@deriv/shared';
import classNames from 'classnames';

const FormFooter = ({ children, className }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <div
            className={classNames('account-form__footer', className, {
                'account-form__footer--dashboard': is_dashboard,
            })}
        >
            {children}
        </div>
    );
};

FormFooter.prototype = {
    children: PropTypes.object,
};

export default FormFooter;
