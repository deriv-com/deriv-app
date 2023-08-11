import React from 'react';
import { Icon, Text } from '@deriv/components';
import { PlatformContext, isNavigationFromP2P, isNavigationFromDerivGO } from '@deriv/shared';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa/poa-button';
import { ContinueTradingButton } from 'Components/poa/continue-trading-button/continue-trading-button';
import IconMessageContent from 'Components/icon-message-content';
import { TPlatformContext, TPOIStatus } from 'Types';
import classNames from 'classnames';

export const UploadComplete = ({
    needs_poa,
    redirect_button,
    is_from_external,
    is_manual_upload = false,
}: TPOIStatus) => {
    const { is_appstore } = React.useContext<TPlatformContext>(PlatformContext);
    const message = localize('Your documents were submitted successfully');
    const description = is_manual_upload
        ? localize('We’ll review your documents and notify you of its status within 1 - 3 working days.')
        : localize('We’ll review your documents and notify you of its status within 5 minutes.');

    const is_redirected_from_platform = isNavigationFromP2P() || isNavigationFromDerivGO();

    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                text={description}
                icon={
                    is_appstore ? (
                        <Icon icon='IcPoiVerifiedDashboard' width={273} height={128} />
                    ) : (
                        <Icon icon='IcPoiVerified' size={128} />
                    )
                }
                className={classNames({ 'account-management-dashboard': is_appstore })}
            >
                {!is_from_external && (redirect_button || (!is_redirected_from_platform && <ContinueTradingButton />))}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={
                is_appstore ? (
                    <Icon icon='IcPoiVerifiedDashboard' width={273} height={128} />
                ) : (
                    <Icon icon='IcPoiVerified' size={128} />
                )
            }
            className={classNames({ 'account-management-dashboard': is_appstore })}
        >
            <React.Fragment>
                <div className='account-management__text-container'>
                    <Text align='center' size='xs' as={is_appstore ? 'span' : 'p'}>
                        {description}
                    </Text>
                    <Text align='center' size='xs' as={is_appstore ? 'span' : 'p'}>
                        {localize('You must also submit a proof of address.')}
                    </Text>
                </div>
                <PoaButton />
            </React.Fragment>
            {!is_from_external && redirect_button}
        </IconMessageContent>
    );
};

export default UploadComplete;
