import React from 'react';
import { PropTypes } from 'prop-types';
import { isMobile, PlatformContext } from '@deriv/shared';
import classNames from 'classnames';

const FormFooter = ({ children }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <div
            className={classNames('account-form__footer', {
                'account-form__footer--dashboard': is_dashboard && !isMobile(),
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
