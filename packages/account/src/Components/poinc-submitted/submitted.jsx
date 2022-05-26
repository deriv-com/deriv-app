import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import classNames from 'classnames';
import { PlatformContext } from '@deriv/shared';
import { ContinueTradingButton } from 'Components/poa-continue-trading-button/continue-trading-button.jsx';
// import PoiButton from 'Components/poi-button';
import IconMessageContent from 'Components/icon-message-content';

export const Submitted = ({ is_description_enabled = true }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const message = localize('Your proof of income was submitted successfully');

    // need to be refactored

    return (
        <div
            className={classNames('account-management__container', {
                'account-management__container-dashboard': is_appstore,
            })}
        >
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<Icon icon='IcPoaVerified' size={128} />}
                full_width={is_appstore}
            >
                {!is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        </div>
    );
};
