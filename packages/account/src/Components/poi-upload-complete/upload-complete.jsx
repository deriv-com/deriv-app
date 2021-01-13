import React from 'react';
import { PropTypes } from 'prop-types';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import ContinueTradingButton from 'Components/poa-continue-trading-button';
import PoaButton from 'Components/poa-button';
import IconMessageContent from 'Components/icon-message-content';

const UploadComplete = ({ has_poa, is_description_enabled, redirect_button, is_dashboard }) => {
    const message = localize('Your proof of identity was submitted successfully');
    if (has_poa) {
        return (
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={
                    is_dashboard ? (
                        <Icon icon='IcPoiVerifiedDashboard' width={273} height={128} />
                    ) : (
                        <Icon icon='IcPoiVerifiedDashboard' size={128} />
                    )
                }
            >
                {is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={
                is_dashboard ? (
                    <Icon icon='IcPoiVerifiedDashboard' width={273} height={128} />
                ) : (
                    <Icon icon='IcPoiVerifiedDashboard' size={128} />
                )
            }
            className='account-management-dashboard'
        >
            {is_description_enabled && (
                <React.Fragment>
                    <div className='account-management__text-container'>
                        <Text align='center' size='xs' as='p'>
                            {localize('Your document is being reviewed, please check back in 1-3 days.')}
                        </Text>
                        <Text align='center' size='xs' as='p'>
                            {localize('You must also submit a proof of address.')}
                        </Text>
                    </div>
                    <PoaButton />
                </React.Fragment>
            )}
            {redirect_button}
        </IconMessageContent>
    );
};

UploadComplete.protoTypes = {
    is_dashboard: PropTypes.bool,
    is_description_enabled: PropTypes.bool,
    has_poa: PropTypes.bool,
    redirect_button: PropTypes.object,
};

export default UploadComplete;
