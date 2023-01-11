import React from 'react';
import classNames from 'classnames';
import { Icon, Text, Button } from '@deriv/components';
import { isMobile, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { TPlatformContext } from 'Types';
import RootStore from 'Stores/index';

type TIconWithMessage = {
    icon: string;
    has_button?: boolean;
    has_real_account?: boolean;
    message: string;
    toggleAccountsDialog: (status?: boolean) => void;
    toggleShouldShowRealAccountsList: (value: boolean) => void;
};

const IconWithMessage = ({
    has_button,
    has_real_account,
    icon,
    message,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
}: TIconWithMessage) => {
    const { is_appstore }: Partial<TPlatformContext> = React.useContext(PlatformContext);

    return (
        <div className={classNames('da-icon-with-message', { 'da-icon-with-message-full-width': is_appstore })}>
            <Icon icon={icon} size={128} />
            <Text
                className='da-icon-with-message__text'
                as='p'
                color='general'
                size={isMobile() ? 'xs' : 's'}
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
                    data-testid='icon-with-message-button'
                >
                    {has_real_account ? localize('Switch to real account') : localize('Add a real account')}
                </Button>
            )}
        </div>
    );
};

export default connect(({ client, ui }: RootStore) => ({
    has_real_account: client.has_any_real_account,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
}))(IconWithMessage);
