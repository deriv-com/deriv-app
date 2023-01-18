import React from 'react';
import { Icon, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import ApiTokenClipboard from './api-token-clipboard';

type TApiTokenTableRowTokenCell = {
    token: string;
    scopes: string[];
};

const HiddenPasswordDots = () => (
    <div className='da-api-token__pass-dot-container'>
        {[...Array(15)].map((el, index) => (
            <div key={index} className='da-api-token__pass-dot' />
        ))}
    </div>
);

const ApiTokenTableRowTokenCell = ({ token, scopes }: TApiTokenTableRowTokenCell) => {
    const [should_show_token, setShouldShowToken] = React.useState(false);

    const toggleTokenVisibility = () => {
        setShouldShowToken(prev_value => !prev_value);
    };

    return (
        <div className='da-api-token__clipboard-wrapper'>
            {should_show_token ? (
                <Text as='p' color='prominent ' size='xs' line_height='m'>
                    {token}
                </Text>
            ) : (
                <HiddenPasswordDots />
            )}
            <ApiTokenClipboard
                info_message={localize('Copy this token')}
                success_message={localize('Token copied!')}
                text_copy={token}
                scopes={scopes}
            />
            <Popover
                alignment='bottom'
                classNameBubble='dc-clipboard__popover'
                message={should_show_token ? localize('Hide this token') : localize('Show this token')}
            >
                <Icon
                    icon={should_show_token ? 'IcPasswordEyeVisible' : 'IcPasswordEyeHide'}
                    className='da-api-token__visibility-icon'
                    onClick={toggleTokenVisibility}
                    width={15}
                    custom_color='var(--text-prominent)'
                    data_testid='dt_toggle_visibility_icon'
                />
            </Popover>
        </div>
    );
};

export default ApiTokenTableRowTokenCell;
