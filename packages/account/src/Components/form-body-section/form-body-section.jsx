import React from 'react';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { Text } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';

const FormBodySection = ({ children, has_side_note, side_note }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    if (has_side_note) {
        return (
            <div className={classNames('account-form__section', { 'account-form__section--dashboard': is_dashboard })}>
                <div className='account-form__section-side-note'>
                    {typeof side_note === 'string' ? <Text size='xxs'>{side_note}</Text> : side_note}
                </div>
                <div className='account-form__section-content'>{children}</div>
            </div>
        );
    }
    return children;
};
FormBodySection.prototype = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_side_note: PropTypes.bool,
    side_note: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
export default FormBodySection;
