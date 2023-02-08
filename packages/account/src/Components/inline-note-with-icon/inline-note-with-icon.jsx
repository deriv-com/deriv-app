import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Text } from '@deriv/components';

const InlineNoteWithIcon = ({ icon, message, title }) => {
    return (
        <div className='da-inline-note-with-icon'>
            <div>
                <Icon icon={icon} size={16} />
            </div>
            <Text as='p' size='xxxs' line_height='s'>
                <strong>{title}: </strong>
                {message}
            </Text>
        </div>
    );
};

InlineNoteWithIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default InlineNoteWithIcon;
