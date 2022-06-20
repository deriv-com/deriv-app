import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import ApiTokenClipboard from './api-token-clipboard.jsx';

const ApiTokenTableRowTokenCell = ({ token }) => {
    const [should_show_token, setShouldShowToken] = React.useState(false);

    const toggleTokenVisibility = () => {
        setShouldShowToken(!should_show_token);
    };

    return (
        <div className='da-api-token__clipboard-wrapper'>
            <Text as='p' color='prominent ' size='xs' line_height='m'>
                {should_show_token ? token : '•'.repeat(22)}
            </Text>
            <ApiTokenClipboard
                className='da-api-token__clipboard'
                info_message={localize('Click here to copy token')}
                popover_props={{ relative_render: false, zIndex: 9999 }}
                success_message={localize('Token copied!')}
                text_copy={token}
            />
            <Popover
                alignment='bottom'
                classNameBubble={classNames('dc-clipboard__popover')}
                message={should_show_token ? 'Hide this token' : 'Show this token'}
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

ApiTokenTableRowTokenCell.propTypes = {
    token: PropTypes.string.isRequired,
};

export default ApiTokenTableRowTokenCell;
