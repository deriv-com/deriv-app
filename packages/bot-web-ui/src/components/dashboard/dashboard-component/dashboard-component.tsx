import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import { Text, DesktopWrapper } from '@deriv/components';
import InfoPanel from './info-panel';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';

type TDashboard = {
    is_info_panel_visible: boolean;
};

const DashboardComponent = ({ is_info_panel_visible }: TDashboard) => {
    return (
        <div className='tab__dashboard'>
            <div className='tab__dashboard__content'>
                <div className='tab__dashboard__centered'>
                    <div className='tab__dashboard__header'>
                        <Text color='prominent' line_height='xxl' size='sm' weight='bold'>
                            {localize('Load or build your bot')}
                        </Text>
                    </div>
                    <div className='tab__dashboard__description'>
                        <Text color='prominent' line_height='s'>
                            {localize(
                                'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                            )}
                        </Text>
                    </div>
                    <Cards />
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
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    is_info_panel_visible: dashboard.is_info_panel_visible,
}))(DashboardComponent);
