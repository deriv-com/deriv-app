import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';

type TUserGuide = {
    setActiveTab: (param: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
};

const UserGuide = ({ setActiveTab, setActiveTabTutorial }: TUserGuide) => {
    return (
        <div className='tab__dashboard__home__retrigger'>
            <button
                data-testid='btn-user-guide'
                onClick={() => {
                    setActiveTab(DBOT_TABS.TUTORIAL);
                    setActiveTabTutorial(0);
                }}
            >
                <Icon
                    className='tab__dashboard__home__retrigger__icon'
                    width='2.4rem'
                    height='2.4rem'
                    icon={'IcDbotUserGuide'}
                />
                <Text color='prominent' size='xs' line_height='s' className={'tab__dashboard__home__retrigger__text'}>
                    {localize('User Guide')}
                </Text>
            </button>
        </div>
    );
};

export default UserGuide;
