import React from 'react';
import { Icon, Text } from '@deriv/components';
import { SIDEBAR_INTRO } from './constants';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';

type TInfoPanel = {
    setInfoPanelVisibility: (state: boolean) => void;
    setActiveTab: (param: number) => void;
    setActiveTabTutorial: (param: number) => void;
    first_name?: string;
};

const InfoPanel = ({ setInfoPanelVisibility, setActiveTab, setActiveTabTutorial, first_name = '' }: TInfoPanel) => {
    const switchTab = (link: boolean, label: string) => {
        const tutorial_link = link ? setActiveTab(4) : null;
        const tutorial_label = label === 'Guide' ? setActiveTabTutorial(0) : setActiveTabTutorial(1);
        return {
            tutorial_link,
            tutorial_label,
        };
    };

    return (
        <div className='db-info-panel'>
            <div
                className='db-info-panel__close-action'
                onClick={() => {
                    setInfoPanelVisibility(false);
                }}
            >
                <Icon width='1rem' height='1rem' icon='IcCloseIconDbot' />
            </div>
            {SIDEBAR_INTRO.map((sidebar_item, index) => {
                const { label, content, link } = sidebar_item;
                return (
                    <div key={`${label}-${index}`}>
                        <Text color='prominent' line_height='xxl' size='m' weight='bold' as='h1'>
                            {label} {index === 0 && first_name}
                        </Text>
                        {content.map((text, key) => (
                            <Text
                                key={`info-panel-tour${key}`}
                                className={classNames('db-info-panel__card', {
                                    'db-info-panel__content': link,
                                })}
                                color='prominent'
                                line_height='xl'
                                as='p'
                                onClick={() => switchTab(link, label)}
                            >
                                {text}
                            </Text>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default connect(({ dashboard, client }: RootStore) => ({
    setInfoPanelVisibility: dashboard.setInfoPanelVisibility,
    setActiveTab: dashboard.setActiveTab,
    setActiveTabTutorial: dashboard.setActiveTabTutorial,
    first_name: client?.account_settings?.first_name,
}))(InfoPanel);
