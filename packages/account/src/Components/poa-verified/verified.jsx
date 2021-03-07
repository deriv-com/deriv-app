import React from 'react';
import { PropTypes } from 'prop-types';
import { Icon } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PoiButton } from 'Components/poi-button/poi-button.jsx';
import IconMessageContent from 'Components/icon-message-content';
import { ContinueTradingButton } from 'Components/poa-continue-trading-button/continue-trading-button.jsx';

export const Verified = ({ needs_poi, is_description_enabled = true }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    const message = localize('Your proof of address is verified');
    if (needs_poi) {
        return (
            <div className={is_dashboard && 'account-management__container-dashboard'}>
                <IconMessageContent
                    message={message}
                    text={localize('To continue trading, you must also submit a proof of identity.')}
                    icon={<Icon icon='IcPoaVerified' size={128} />}
                    className={is_dashboard && 'paaccount-management-dashboard'}
                >
                    <PoiButton />
                </IconMessageContent>
            </div>
        );
    }
    return (
        <div className={is_dashboard && 'account-management__container-dashboard'}>
            <IconMessageContent
                message={message}
                icon={
                    <Icon icon='IcPoaVerified' size={128} className={is_dashboard && 'account-management-dashboard'} />
                }
            >
                {!is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        </div>
    );
};

Verified.PropTypes = {
    needs_poi: PropTypes.bool,
    is_description_disabled: PropTypes.bool,
};

export default Verified;
