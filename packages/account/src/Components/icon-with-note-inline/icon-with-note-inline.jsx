import PropTypes from 'prop-types';
import * as React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';

const IconWithNoteInline = ({ icon, message }) => {
    return (
        <div className='da-icon-with-note-inline'>
            <div className='da-icon-with-note-inline_icon'>
                <Icon icon={icon} size={16} />
            </div>
            <div>
                <Localize i18n_default_text={`<strong>Note: </strong>${message}`} />
            </div>
        </div>
    );
};

IconWithNoteInline.propTypes = {
    icon: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default IconWithNoteInline;
