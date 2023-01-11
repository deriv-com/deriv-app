import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PlatformContext } from '@deriv/shared';
import { TPlatformContext, TPoaStatusProps } from 'Types';
import { ContinueTradingButton } from 'Components/poa/continue-trading-button/continue-trading-button';
import PoiButton from 'Components/poi/poi-button';
import IconMessageContent from 'Components/icon-message-content';

export const Submitted = ({ needs_poi, is_description_enabled = true }: TPoaStatusProps) => {
    const { is_appstore }: TPlatformContext = React.useContext(PlatformContext);
    const message = localize('Your proof of address was submitted successfully');
    if (needs_poi) {
        return (
            <div
                className={classNames('account-management__container', {
                    'account-management__container-dashboard': is_appstore,
                })}
            >
                <IconMessageContent
                    message={message}
                    icon={<Icon icon='IcPoaVerified' size={128} />}
                    full_width={is_appstore}
                >
                    <div className='account-management__text-container'>
                        <Text align='center' size='xs' as='p'>
                            {localize('Your document is being reviewed, please check back in 1-3 days.')}
                        </Text>
                        <Text align='center' size='xs' as='p'>
                            {localize('You must also submit a proof of identity.')}
                        </Text>
                    </div>
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
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<Icon icon='IcPoaVerified' size={128} />}
                full_width={is_appstore}
            >
                {!is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        </div>
    );
};
