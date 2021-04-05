import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import IconWithMessage from 'Components/icon-with-message';

const DemoMessage = ({ has_demo_icon, more_content }) => (
    <IconWithMessage
        icon={has_demo_icon ? 'IcPoaLockDemo' : 'IcPoaLock'}
        message={localize('This feature is not available for demo accounts.')}
        more_content={more_content}
    />
);

DemoMessage.propTypes = {
    has_demo_icon: PropTypes.bool,
    full_width: PropTypes.bool,
};

export default DemoMessage;
