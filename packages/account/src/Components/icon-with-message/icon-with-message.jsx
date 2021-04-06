import PropTypes from 'prop-types';
import * as React from 'react';
import { Icon, Text } from '@deriv/components';

const IconWithMessage = ({ icon, message, more_content }) => {
    return (
        <div className='da-icon-with-message'>
            <Icon icon={icon} size={128} />
            <Text className='da-icon-with-message__text' as='p' color='general' size='s' line_height='m' weight='bold'>
                {message}
            </Text>
            {more_content}
        </div>
    );
};

IconWithMessage.propTypes = {
    icon: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default IconWithMessage;
