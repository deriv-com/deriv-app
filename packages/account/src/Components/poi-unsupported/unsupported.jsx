import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';

const UnsupportedIconRow = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <div className='poi-icon-row'>
            <div className='poi-icon-row__icon-container'>
                <Icon icon={is_dashboard ? 'IcIdentityCardDashboard' : 'IcIdentityCard'} size={90} />
                <Text color='prominent' as='p'>
                    {localize('Identity card')}
                </Text>
                <Text line_height='xs' color='less-prominent' as='p'>
                    {localize('Front and back')}
                </Text>
            </div>
            <div className='poi-icon-row__icon-container'>
                <Icon icon={is_dashboard ? 'IcDrivingLicenseDashboard' : 'IcDrivingLicense'} size={90} />
                <Text color='prominent' as='p'>
                    {localize('Driving license')}
                </Text>
                <Text line_height='xs' color='less-prominent' as='p'>
                    {localize('Front and back')}
                </Text>
            </div>
            <div className='poi-icon-row__icon-container'>
                <Icon icon={is_dashboard ? 'IcPassportDashboard' : 'IcPassport'} size={90} />
                <Text color='prominent' as='p'>
                    {localize('Passport')}
                </Text>
                <Text line_height='xs' color='less-prominent' as='p'>
                    {localize('Face photo page')}
                </Text>
            </div>
        </div>
    );
};

const Unsupported = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <IconMessageContent
            message={localize('Verify your identity')}
            text={
                <Localize
                    i18n_default_text='To continue trading with us, you need to send us a copy of any one of these government-issued photo ID documents via <0>LiveChat</0>.'
                    components={[
                        <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                    ]}
                />
            }
            className={is_dashboard && 'dashboard'}
            icon_row={<UnsupportedIconRow />}
        />
    );
};

export default Unsupported;
