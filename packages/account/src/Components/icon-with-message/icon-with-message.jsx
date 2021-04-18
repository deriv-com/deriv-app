import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import { Icon, Text, Button } from '@deriv/components';
import { isMobile, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const IconWithMessage = ({ icon, message, has_button, toggleAccountsDialog }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    return (
        <div className={classNames('da-icon-with-message', { 'da-icon-with-message-full-width': is_dashboard })}>
            <Icon icon={icon} size={128} />
            <Text
                className='da-icon-with-message__text'
                as='p'
                color='general'
                size={isMobile ? 'xs' : 's'}
                line_height='m'
                weight='bold'
            >
                {message}
            </Text>
            {has_button && (
                <Button primary onClick={toggleAccountsDialog} className='account__demo-message-button'>
                    {localize('Add a real account')}
                </Button>
            )}
        </div>
    );
};

IconWithMessage.propTypes = {
    icon: PropTypes.string.isRequired,
    has_button: PropTypes.bool,
    message: PropTypes.string.isRequired,
    toggleAccountsDialog: PropTypes.func,
};

export default connect(({ ui }) => ({
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(IconWithMessage);
