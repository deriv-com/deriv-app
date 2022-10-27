import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import { Text, DesktopWrapper } from '@deriv/components';
import InfoPanel from './info-panel';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';
import Local from './load-bot-preview/local';

type TDashboard = {
    is_info_panel_visible: boolean;
    recent_strategies: boolean;
};

const DashboardComponent = ({ is_info_panel_visible, recent_strategies }: TDashboard) => {
    return (
        <React.Fragment>
            <div className='tab__dashboard'>
                <div className='tab__dashboard__content'>
                    <div className='tab__dashboard__centered'>
                        {!recent_strategies && (
                            <div className='tab__dashboard__header'>
                                <Text color='prominent' line_height='xxl' size='sm' weight='bold'>
                                    {localize('Load or build your bot')}
                                </Text>
                            </div>
                        )}
                        <div
                            className={classNames('tab__dashboard__description', {
                                tab__dashboard__description__loaded: recent_strategies,
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
                    <div className='tab__dashboard__preview'>
                        <Local />
                    </div>
                </div>
            </div>
            <DesktopWrapper>
                <div
                    className={classNames('tab__dashboard__info-panel', {
                        'tab__dashboard__info-panel--active': is_info_panel_visible,
                    })}
                >
                    <InfoPanel />
                </div>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    is_info_panel_visible: dashboard.is_info_panel_visible,
    recent_strategies: load_modal.recent_strategies,
}))(DashboardComponent);
