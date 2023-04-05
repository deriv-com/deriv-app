import { TPlatformContext, TPoaStatusProps } from 'Types';

import { ContinueTradingButton } from 'Components/poa/continue-trading-button/continue-trading-button';
import { Icon } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';
import { PlatformContext } from '@deriv/shared';
import { PoiButton } from 'Components/poi/poi-button/poi-button';
import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';

export const Verified = ({ needs_poi, redirect_button }: TPoaStatusProps) => {
    const { is_appstore }: TPlatformContext = React.useContext(PlatformContext);

    const message = localize('Your proof of address is verified');
    if (needs_poi) {
        return (
            <div
                className={classNames('account-management__container', {
                    'account-management__container-dashboard': is_appstore,
                })}
            >
                <IconMessageContent
                    message={message}
                    text={localize('To continue trading, you must also submit a proof of identity.')}
                    icon={<Icon icon='IcPoaVerified' size={128} />}
                    className={classNames({ 'account-management-dashboard': is_appstore })}
                >
                    <PoiButton />
                </IconMessageContent>
            </div>
        );
    }
    return (
        <div
            className={classNames('account-management__container', {
                'account-management__container-dashboard': is_appstore,
            })}
        >
            <IconMessageContent
                message={message}
                icon={<Icon icon='IcPoaVerified' size={128} />}
                className={classNames({ 'account-management-dashboard': is_appstore })}
            >
                {redirect_button || <ContinueTradingButton />}
            </IconMessageContent>
        </div>
    );
};

export default Verified;
