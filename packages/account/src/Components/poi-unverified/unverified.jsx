import { Localize, localize } from '@deriv/translations';
import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { Icon, StaticUrl } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';

export const Unverified = ({ is_description_enabled }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    return (
        <IconMessageContent
            message={localize('We could not verify your proof of identity')}
            text={
                is_description_enabled ? (
                    <Localize
                        i18n_default_text='As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our Help Center.<0>Help Centre</0>.'
                        components={[<StaticUrl key={0} className='link' href='/help-centre' />]}
                    />
                ) : null
            }
            icon={
                is_dashboard ? (
                    <Icon icon='IcPoiErrorDashboard' width={273} height={128} />
                ) : (
                    <Icon icon='IcPoiError' size={128} />
                )
            }
            className={is_dashboard && 'account-management-dashboard'}
        />
    );
};
