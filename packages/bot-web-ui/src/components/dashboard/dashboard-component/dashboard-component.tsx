import { DesktopWrapper, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';
import React from 'react';
import Cards from './cards';
import InfoPanel from './info-panel';
import Local from './load-bot-preview/local';
import UserGuide from './user-guide';

type TDashboard = {
    is_info_panel_visible: boolean;
    dashboard_strategies: [];
    has_started_onboarding_tour: boolean;
    setActiveTab: (param: number) => void;
};

const DashboardComponent = ({
    is_info_panel_visible,
    dashboard_strategies,
    has_started_onboarding_tour,
    setActiveTab,
}: TDashboard) => {
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const is_mobile = isMobile();
    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': has_started_onboarding_tour && !is_mobile,
                })}
            >
                <div className='tab__dashboard__content'>
                    <div className='tab__dashboard__centered'>
                        <div className='tab__dashboard__header'>
                            <Text color='prominent' line_height='xxl' size={is_mobile ? 's' : 'm'} weight='bold'>
                                {localize('Load or build your bot')}
                            </Text>
                        </div>
                        <DesktopWrapper>
                            {!has_dashboard_strategies && <UserGuide setActiveTab={setActiveTab} />}
                        </DesktopWrapper>
                        <div
                            className={classNames('tab__dashboard__description', {
                                tab__dashboard__description__loaded: has_dashboard_strategies,
                            })}
                        >
                            <Text color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
                                {localize(
                                    'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                                )}
                            </Text>
                        </div>
                        <Cards />
                    </div>

                    {has_dashboard_strategies && (
                        <div className='tab__dashboard__preview'>
                            <Local />
                        </div>
                    )}
                </div>
            </div>
            <DesktopWrapper>
                {!has_started_onboarding_tour && (
                    <div
                        className={classNames('tab__dashboard__info-panel', {
                            'tab__dashboard__info-panel--active': is_info_panel_visible,
                        })}
                    >
                        <InfoPanel />
                    </div>
                )}
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    is_info_panel_visible: dashboard.is_info_panel_visible,
    dashboard_strategies: load_modal.dashboard_strategies,
    setActiveTab: dashboard.setActiveTab,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
}))(DashboardComponent);
