import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TPOIStatus } from 'Types';
import IconMessageContent from '../../../icon-message-content';
import PoaButton from '../../../poa/poa-button';
import { service_code } from '../../../../Sections/Verification/ProofOfIdentity/proof-of-identity-utils';
import ContinueTradingButton from '../../../poa/continue-trading-button';

export const Verified = ({ needs_poa, redirect_button, is_from_external, service }: TPOIStatus) => {
    const message =
        service === service_code.idv
            ? localize('ID verification passed')
            : localize('Your proof of identity is verified');

    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={<Icon icon='IcPoaVerified' size={128} data_testid='dt_IcPoaVerified' />}
                className='account-management-dashboard'
            >
                {!is_from_external && (redirect_button || <ContinueTradingButton />)}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={<Icon icon='IcPoaVerified' size={128} />}
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
