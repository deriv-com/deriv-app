import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Icon, MobileWrapper, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { DBOT_TABS } from 'Constants/bot-contents';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { SIDEBAR_INTRO } from './constants';

type TInfoPanel = {
    has_started_onboarding_tour: boolean;
    is_info_panel_visible: boolean;
    setActiveTab: (param: number) => void;
    setActiveTabTutorial: (param: number) => void;
    setInfoPanelVisibility: (state: boolean) => void;
};

const InfoPanel = ({
    has_started_onboarding_tour,
    is_info_panel_visible,
    setActiveTab,
    setActiveTabTutorial,
    setInfoPanelVisibility,
}: TInfoPanel) => {
    const is_mobile = isMobile();
    const switchTab = (link: boolean, label: string) => {
        const tutorial_link = link ? setActiveTab(DBOT_TABS.TUTORIAL) : null;
        const tutorial_label = label === 'Guide' ? setActiveTabTutorial(0) : setActiveTabTutorial(1);
        return {
            tutorial_link,
            tutorial_label,
        };
    };

    const handleClose = () => {
        setInfoPanelVisibility(false);
        localStorage.setItem('dbot_should_show_info', JSON.stringify(Date.now()));
    };

    const renderInfo = () => (
        <div className='db-info-panel'>
            <div className='db-info-panel__close-action' onClick={handleClose}>
                <Icon width='1rem' height='1rem' icon='IcCloseIconDbot' />
            </div>

            {SIDEBAR_INTRO.map(sidebar_item => {
                const { label, content, link } = sidebar_item;
                return (
                    <div key={`${label}-${content}`}>
                        <Text color='prominent' line_height='xxl' size={is_mobile ? 's' : 'm'} weight='bold' as='h1'>
                            {label}
                        </Text>
                        {content.map(text => (
                            <Text
                                key={`info-panel-tour${text}`}
                                className={classNames('db-info-panel__card', {
                                    'db-info-panel__content': link,
                                })}
                                color='prominent'
                                line_height='xl'
                                as='p'
                                onClick={() => switchTab(link, label)}
                                size={is_mobile ? 'xxs' : 's'}
                            >
                                {text}
                            </Text>
                        ))}
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            <DesktopWrapper>
                {!has_started_onboarding_tour && (
                    <div
                        className={classNames('tab__dashboard__info-panel', {
                            'tab__dashboard__info-panel--active': is_info_panel_visible,
                        })}
                    >
                        {renderInfo()}
                    </div>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <Modal
                    className='statistics__modal statistics__modal--mobile'
                    is_open={is_info_panel_visible}
                    toggleModal={handleClose}
                    width={'440px'}
                >
                    <Modal.Body>{renderInfo()}</Modal.Body>
                </Modal>
            </MobileWrapper>
        </>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    is_info_panel_visible: dashboard.is_info_panel_visible,
    setActiveTab: dashboard.setActiveTab,
    setActiveTabTutorial: dashboard.setActiveTabTutorial,
    setInfoPanelVisibility: dashboard.setInfoPanelVisibility,
}))(InfoPanel);
