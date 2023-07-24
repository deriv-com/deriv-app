import React from 'react';
import { Icon } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';
import { TPlatformContext, TPOIStatus } from 'Types';
import { PlatformContext } from '@deriv/shared';
import PoaButton from 'Components/poa/poa-button';
import { localize } from '@deriv/translations';

export const Verified = ({ needs_poa, redirect_button, is_from_external }: TPOIStatus) => {
    const { is_appstore } = React.useContext<TPlatformContext>(PlatformContext);
    const message = localize('Your proof of identity is verified');

    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={
                    is_appstore ? (
                        <Icon
                            icon='IcPoaVerifiedDashboard'
                            height={128}
                            width={237}
                            data_testid='dt_IcPoaVerifiedDashboard'
                        />
                    ) : (
                        <Icon icon='IcPoaVerified' size={128} data_testid='dt_IcPoaVerified' />
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

export default Verified;
