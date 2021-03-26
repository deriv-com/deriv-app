import PropTypes from 'prop-types';
import * as React from 'react';
import { Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const AccountLimitsExtraInfo = ({ message, ...props }) => {
    if (isMobile()) {
        return (
            <Text color='less-prominent' line_height='s' size='xxxs'>
                {message}
            </Text>
        );
    }

    return (
        <Popover
            alignment='right'
            className='da-account-limits__popover'
            icon='info'
            message={message}
            zIndex={9999}
            {...props}
        />
    );
};

AccountLimitsExtraInfo.propTypes = {
    message: PropTypes.string.isRequired,
};

export default AccountLimitsExtraInfo;
