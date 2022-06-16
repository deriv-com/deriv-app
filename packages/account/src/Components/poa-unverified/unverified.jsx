import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const Unverified = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <IconMessageContent
            message={localize('We could not verify your proof of address')}
            text={
                <Localize
                    i18n_default_text='Please check your email for details.'
                    // TODO: enable link to Help Center when POA help content is ready
                    // i18n_default_text='Please check your email for details. If you have any questions, please go to our <0>Help Centre</0>.'
                    // components={[
                    //     <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='https://www.deriv.com/help-centre/' />,
                    // ]}
                />
            }
            icon={<Icon icon={is_dashboard ? 'IcPoaErrorDashboard' : 'IcPoaError'} size={128} />}
        />
    );
};
