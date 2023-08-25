import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import Local from './load-bot-preview/local';
import Cards from './cards';
import InfoPanel from './info-panel';
import UserGuide from './user-guide';

type TMobileIconGuide = {
    has_dashboard_strategies: boolean;
    handleTabChange: (active_number: number) => void;
};

type TDashboardMobileCommonProps = {
    is_mobile: boolean;
    has_dashboard_strategies: boolean;
};

const DashboardTitle = ({ is_mobile, has_dashboard_strategies }: TDashboardMobileCommonProps) => (
    <div
        className={classNames('tab__dashboard__header', {
            'tab__dashboard__header--not-listed': !has_dashboard_strategies && is_mobile,
        })}
    >
        <Text color='prominent' line_height='xxl' size={is_mobile ? 's' : 'm'} weight='bold'>
            {localize('Load or build your bot')}
        </Text>
    </div>
);

const MobileIconGuide = ({ handleTabChange }: TMobileIconGuide) => (
    <MobileWrapper>
        <div>
            <Local handleTabChange={handleTabChange} />
        </div>
    </MobileWrapper>
);

const DashboardDescription = ({ is_mobile, has_dashboard_strategies }: TDashboardMobileCommonProps) => (
    <div
        className={classNames('tab__dashboard__description', {
            'tab__dashboard__description__loaded--listed': has_dashboard_strategies && !is_mobile,
            'tab__dashboard__description__loaded--not-listed':
                !has_dashboard_strategies || (!has_dashboard_strategies && is_mobile),
        })}
    >
        <Text color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
            {localize(
                'Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
            )}
        </Text>
    </div>
);

const DashboardComponent = observer(({ handleTabChange }: TMobileIconGuide) => {
    const { load_modal, dashboard } = useDBotStore();
    const { dashboard_strategies } = load_modal;
    const { setActiveTab, setActiveTabTutorial, has_started_onboarding_tour } = dashboard;
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const is_mobile = isMobile();

    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': has_started_onboarding_tour,
                })}
            >
                <div className='tab__dashboard__content'>
                    <div
                        className={classNames('tab__dashboard__centered', {
                            'tab__dashboard__centered--listed': !is_mobile && has_dashboard_strategies,
                            'tab__dashboard__centered--not-listed': !has_dashboard_strategies,
                        })}
                    >
                        {!has_dashboard_strategies && !is_mobile && (
                            <DashboardTitle is_mobile={is_mobile} has_dashboard_strategies={has_dashboard_strategies} />
                        )}
                        <DesktopWrapper>
                            {!has_dashboard_strategies && (
                                <UserGuide setActiveTab={setActiveTab} setActiveTabTutorial={setActiveTabTutorial} />
                            )}
                        </DesktopWrapper>
                        <div>
                            <div
                                className={classNames({
                                    'tab__dashboard__mobile-container': is_mobile,
                                    'tab__dashboard__mobile-container--minimized':
                                        is_mobile && has_dashboard_strategies,
                                })}
                            >
                                {is_mobile && !has_dashboard_strategies && (
                                    <DashboardTitle
                                        is_mobile={is_mobile}
                                        has_dashboard_strategies={has_dashboard_strategies}
                                    />
                                )}
                                {(!is_mobile || (is_mobile && has_dashboard_strategies)) && (
                                    <DashboardDescription
                                        is_mobile={is_mobile}
                                        has_dashboard_strategies={has_dashboard_strategies}
                                    />
                                )}
                                <MobileIconGuide
                                    handleTabChange={handleTabChange}
                                    has_dashboard_strategies={has_dashboard_strategies}
                                />
                            </div>
                            {is_mobile && !has_dashboard_strategies && (
                                <DashboardDescription
                                    is_mobile={is_mobile}
                                    has_dashboard_strategies={has_dashboard_strategies}
                                />
                            )}
                        </div>
                        <Cards has_dashboard_strategies={has_dashboard_strategies} is_mobile={is_mobile} />
                    </div>

                    {has_dashboard_strategies && !is_mobile && (
                        <div className='tab__dashboard__preview'>
                            <Local handleTabChange={handleTabChange} />
                        </div>
                    )}
                </div>
            </div>
            <InfoPanel />
        </React.Fragment>
    );
});

export default DashboardComponent;
