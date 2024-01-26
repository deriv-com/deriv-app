import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { DBOT_TABS } from 'Constants/bot-contents';
import { rudderstackDashboardUserGuide } from './analytics/rudderstack-dashboard';

type TUserGuide = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
    setActiveTabTutorial: (active_tab: number) => void;
};

const UserGuide: React.FC<TUserGuide> = ({ is_mobile, handleTabChange, setActiveTabTutorial }) => {
    const sendToRudderStackForUserGuide = () => {
        Analytics.trackEvent('ce_bot_tutorial_form', {
            action: 'push_user_guide',
            form_source: 'bot_dashboard_form',
        });
    };

    return (
        <div className='user-guide'>
            <button
                className='user-guide__button'
                onClick={() => {
                    sendToRudderStackForUserGuide();
                    rudderstackDashboardUserGuide();
                    handleTabChange(DBOT_TABS.TUTORIAL);
                    setActiveTabTutorial(0);
                }}
                data-testid='btn-user-guide'
            >
                <Icon className='user-guide__icon' icon={'IcDbotUserGuide'} />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='user-guide__label'>
                        {localize('User Guide')}
                    </Text>
                )}
            </button>
        </div>
    );
};

export default UserGuide;
