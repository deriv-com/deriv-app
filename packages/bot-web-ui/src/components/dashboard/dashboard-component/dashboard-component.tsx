import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import { Text, DesktopWrapper, Icon } from '@deriv/components';
import InfoPanel from './info-panel';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';
import Local from './load-bot-preview/local';

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
    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': has_started_onboarding_tour,
                })}
            >
                <div className='tab__dashboard__content'>
                    <div className='tab__dashboard__centered'>
                        {!has_dashboard_strategies && (
                            <>
                                <div className='tab__dashboard__header'>
                                    <Text color='prominent' line_height='xxl' size='m' weight='bold'>
                                        {localize('Load or build your bot')}
                                    </Text>
                                </div>
                                <div className='tab__dashboard__home__retrigger'>
                                    <button onClick={() => setActiveTab(4)}>
                                        <Icon
                                            className='tab__dashboard__home__retrigger__icon'
                                            width='2.4rem'
                                            height='2.4rem'
                                            icon={'IcDbotUserGuide'}
                                        />
                                        <Text
                                            color='prominent'
                                            size='xs'
                                            line_height='s'
                                            className={'tab__dashboard__home__retrigger__text'}
                                        >
                                            {localize('User Guide')}
                                        </Text>
                                    </button>
                                </div>
                            </>
                        )}
                        <div
                            className={classNames('tab__dashboard__description', {
                                tab__dashboard__description__loaded: has_dashboard_strategies,
                            })}
                        >
                            <Text color='prominent' line_height='s'>
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
