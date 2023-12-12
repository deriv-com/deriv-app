import React from 'react';
import classNames from 'classnames';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { MobileWrapper, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import DeleteDialog from './delete-dialog';
import RecentWorkspace from './recent-workspace';
import SaveModal from './save-modal';
import './index.scss';
import { Analytics } from '@deriv/analytics';

const HEADERS = [localize('Bot name'), localize('Last modified'), localize('Status')];

const RecentComponent = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { setDashboardStrategies, dashboard_strategies } = load_modal;
    const { setStrategySaveType, strategy_save_type } = dashboard;
    const { ui } = useStore();
    const { is_mobile } = ui;
    const get_first_strategy_info = React.useRef(false);
    const get_instacee = React.useRef(false);

    React.useEffect(() => {
        setStrategySaveType('');
        const getStrategies = async () => {
            const recent_strategies = await getSavedWorkspaces();
            setDashboardStrategies(recent_strategies);
            if (!get_instacee.current) {
                const param = recent_strategies?.length > 0 ? 'yes' : 'no';
                Analytics.trackEvent('ce_bot_dashboard_form', {
                    action: param,
                    form_source: 'ce_bot_dashboard_form',
                });
                get_instacee.current = true;
            }
        };
        getStrategies();
        //this dependency is used when we use the save modal popup
    }, [strategy_save_type]);

    React.useEffect(() => {
        if (!dashboard_strategies?.length && !get_first_strategy_info.current) {
            const getStratagiesForRudderStack = async () => {
                const recent_strategies = await getSavedWorkspaces();
                Analytics.trackEvent('ce_bot_dashboard_form', {
                    bot_last_modified_time: recent_strategies?.[0]?.timestamp,
                    form_source: 'bot_header_form',
                });
            };
            getStratagiesForRudderStack();
            get_first_strategy_info.current = true;
        }
    }, []);

    if (!dashboard_strategies?.length) return null;
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__recent'>
                <div className='load-strategy__recent__files'>
                    <div className='load-strategy__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Your bots:' />
                        </Text>
                    </div>
                    <div
                        className={classNames('load-strategy__recent-item load-strategy__recent-item__loaded', {
                            'load-strategy__recent-item__loaded--first-child': !is_mobile,
                        })}
                    >
                        {HEADERS.map(tab_name => {
                            return (
                                <Text size='xs' weight='bold' key={tab_name}>
                                    {tab_name}
                                </Text>
                            );
                        })}
                    </div>
                    <div className='load-strategy__recent__files__list'>
                        {dashboard_strategies.map((workspace, index) => {
                            return <RecentWorkspace key={workspace.id} workspace={workspace} index={index} />;
                        })}
                    </div>
                    <DeleteDialog setStrategies={setDashboardStrategies} />
                    <MobileWrapper>
                        <SaveModal />
                    </MobileWrapper>
                </div>
            </div>
        </div>
    );
});

export default RecentComponent;
