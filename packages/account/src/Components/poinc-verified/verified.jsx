import React from 'react';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { Icon } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PoiButton } from 'Components/poi-button/poi-button.jsx';
import IconMessageContent from 'Components/icon-message-content';
import { ContinueTradingButton } from 'Components/poa-continue-trading-button/continue-trading-button.jsx';

export const Verified = ({ is_description_enabled = true }) => {
    const { is_appstore } = React.useContext(PlatformContext);

    // need to be refactored for poinc, icon and button???

    const message = localize('Your proof of income is verified');

    return (
        <div
            className={classNames('account-management__container', {
                'account-management__container-dashboard': is_appstore,
            })}
        >
            <IconMessageContent
                message={message}
                icon={
                    <Icon icon='IcPoaVerified' size={128} className={is_appstore && 'account-management-dashboard'} />
                }
            >
                {!is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        </div>
    );
};

Verified.PropTypes = {
    is_description_disabled: PropTypes.bool,
};

export default Verified;
