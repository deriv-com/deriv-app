import React from 'react';
import classNames from 'classnames';
import { Icon, Text, Button } from '@deriv/components';
import { isMobile, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TIconWithMessage = {
    icon: string;
    has_button?: boolean;
    message: string;
};

const IconWithMessage = observer(({ has_button, icon, message }: TIconWithMessage) => {
    const { client, ui } = useStore();
    const { has_any_real_account: has_real_account } = client;
    const { toggleAccountsDialog, toggleShouldShowRealAccountsList } = ui;
    const { is_appstore } = React.useContext(PlatformContext);

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
});

export default IconWithMessage;
