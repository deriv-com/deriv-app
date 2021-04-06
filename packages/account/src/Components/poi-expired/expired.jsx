import React from 'react';
import { Icon } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const Expired = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <IconMessageContent
            message={localize('New proof of identity document needed')}
            text={
                <Localize
                    i18n_default_text='Kindly send a scan of a valid proof of identity to <0>support@deriv.com</0>'
                    components={[
                        <a
                            key={0}
                            className='link link--orange'
                            rel='noopener noreferrer'
                            target='_blank'
                            href='mailto:support@deriv.com'
                        />,
                    ]}
                />
            }
            icon={
                is_dashboard ? (
                    <Icon icon='IcPoiUploadDashboard' height={128} width={237} />
                ) : (
                    <Icon icon='IcPoiUpload' size={128} />
                )
            }
            className='account-management-dashboard'
        />
    );
};

export default Expired;
