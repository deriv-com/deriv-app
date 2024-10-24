import { Popover, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';

type TAccountLimitsExtraInfo = {
    message: string;
    should_display_in_info_tooltip?: boolean;
    className?: string;
};

const AccountLimitsExtraInfo = ({
    message,
    should_display_in_info_tooltip = false,
    ...props
}: TAccountLimitsExtraInfo) => {
    const { isDesktop } = useDevice();
    if (!isDesktop && !should_display_in_info_tooltip) {
        return (
            <Text color='less-prominent' line_height='s' size='xxxs'>
                {message}
            </Text>
        );
    }

    return (
        <Popover
            data_testid='dt_acc_limits_popover'
            alignment={isDesktop ? 'right' : 'top'}
            className='da-account-limits__popover'
            icon='info'
            is_bubble_hover_enabled
            message={message}
            zIndex='9999'
            {...props}
        />
    );
};

export default AccountLimitsExtraInfo;
