import { Icon } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';
import { PlatformContext } from '@deriv/shared';
import PoaButton from 'Components/poa/poa-button';
import { PropTypes } from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';

export const Verified = ({ needs_poa, redirect_button, is_from_external }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const message = localize('Your proof of identity is verified');
    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={
                    is_appstore ? (
                        <Icon icon='IcPoaVerifiedDashboard' height={128} width={237} />
                    ) : (
                        <Icon icon='IcPoaVerified' size={128} />
                    )
                }
                className='account-management-dashboard'
            >
                {!is_from_external && redirect_button}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={
                is_appstore ? (
                    <Icon icon='IcPoaVerifiedDashboard' height={128} width={237} />
                ) : (
                    <Icon icon='IcPoaVerified' size={128} />
                )
            }
            className='account-management-dashboard'
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            {!is_from_external && (
                <React.Fragment>
                    <PoaButton />
                </React.Fragment>
            )}
        </IconMessageContent>
    );
};

Verified.propTypes = {
    has_poa: PropTypes.bool,
    is_description_enabled: PropTypes.bool,
    is_from_external: PropTypes.bool,
    needs_poa: PropTypes.bool,
    redirect_button: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default Verified;
