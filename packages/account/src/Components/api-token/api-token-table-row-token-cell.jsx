import PropTypes from 'prop-types';
import * as React from 'react';
import { Clipboard, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const ApiTokenTableRowTokenCell = ({ token }) => {
    const [should_show_token, setShouldShowToken] = React.useState(false);

    const toggleTokenVisibility = () => {
        setShouldShowToken(!should_show_token);
    };

    return (
        <div className='da-api-token__clipboard-wrapper'>
            <Text as='p' color='prominent ' size='xs' line_height='m'>
                {should_show_token ? token : 'Ne_pokazhu_nichego '}
            </Text>
            <Clipboard
                className='da-api-token__clipboard'
                info_message={localize('Click here to copy token')}
                popover_props={{ relative_render: false, zIndex: 9999 }}
                success_message={localize('Token copied!')}
                text_copy={token}
            />
            <Icon
                icon={should_show_token ? 'IcPasswordEyeVisible' : 'IcPasswordEyeHide'}
                className='da-api-token__visibility-icon'
                onClick={toggleTokenVisibility}
                width={15}
            />
        </div>
    );
};

ApiTokenTableRowTokenCell.propTypes = {
    token: PropTypes.string.isRequired,
};

export default ApiTokenTableRowTokenCell;
