import * as React from 'react';
import classNames from 'classnames';
import { Icon, Text, Button } from '@deriv/components';
import { isMobile, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

type IconWithMessageProps = {
    icon: string;
    has_button: boolean;
    message: string;
    toggleAccountsDialog: () => void;
};

const IconWithMessage = ({
    has_button,
    has_real_account,
    icon,
    message,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
}: IconWithMessageProps) => {
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
                <Button
                    primary
                    onClick={() => {
                        toggleShouldShowRealAccountsList(true);
                        toggleAccountsDialog();
                    }}
                    className='account__demo-message-button'
                >
                    {has_real_account ? localize('Switch to real account') : localize('Add a real account')}
                </Button>
            )}
        </div>
    );
};

export default connect(({ client, ui }) => ({
    has_real_account: client.has_any_real_account,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
}))(IconWithMessage);
