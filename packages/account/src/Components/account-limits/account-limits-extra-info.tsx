import * as React from 'react';
import { Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

type AccountLimitsExtraInfoProps = {
    message: string;
};

const AccountLimitsExtraInfo = ({ message, ...props }: AccountLimitsExtraInfoProps) => {
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
            is_bubble_hover_enabled
            message={message}
            zIndex={9999}
            {...props}
        />
    );
};

export default AccountLimitsExtraInfo;
