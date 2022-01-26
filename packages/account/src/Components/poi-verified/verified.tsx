import React from 'react';
import { Icon } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa-button';
import IconMessageContent from 'Components/icon-message-content';

type VerifiedProps = {
    has_poa: boolean;
    is_description_enabled: boolean;
    redirect_button: unknown | boolean;
};

export const Verified = ({ needs_poa, redirect_button, is_from_external }: VerifiedProps) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const message = localize('Your proof of identity is verified');
    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={
                    is_dashboard ? (
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
                is_dashboard ? (
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
                    {redirect_button}
                </React.Fragment>
            )}
        </IconMessageContent>
    );
};

export default Verified;
