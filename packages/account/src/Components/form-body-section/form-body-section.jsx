import React from 'react';
import { PropTypes } from 'prop-types';
import { Text } from '@deriv/components';

const FormBodySection = ({ children, has_side_note, side_note }) => {
    if (has_side_note) {
        return (
            <div className='account-form__section'>
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
