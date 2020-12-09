import { Button, Dialog, Drawer, Modal, Money, Tabs, ThemedScrollbars } from '@deriv/components';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { localize, Localize } from '@deriv/translations';
import Journal from './journal.jsx';
import Summary from './summary.jsx';
import Transactions from './transactions.jsx';
import TradeAnimation from './trade-animation.jsx';
import SelfExclusion from './self-exclusion.jsx';
import { popover_zindex } from '../constants/z-indexes';
import { connect } from '../stores/connect';
import '../assets/sass/run-panel.scss';

const drawerContent = ({ active_index, is_drawer_open, setActiveTabIndex, ...props }) => {
    return (
        <>
            <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                <div id='db-run-panel-tab__summary' label={localize('Summary')}>
                    <Summary is_drawer_open={is_drawer_open} />
                </div>
                <div id='db-run-panel-tab__transactions' label={localize('Transactions')}>
                    <Transactions is_drawer_open={is_drawer_open} />
                </div>
                <div id='db-run-panel-tab__journal' label={localize('Journal')}>
                    <Journal is_drawer_open={is_drawer_open} />
                </div>
            </Tabs>
            {is_drawer_open && active_index !== 2 && <StatisticsSummary {...props} />}
        </>
    );
};

const StatisticsTile = props => (
    <div className='run-panel__tile'>
        <div className='run-panel__tile-title'>{props.title}</div>
        <div className={classNames('run-panel__tile-content', props.contentClassName)}>{props.content}</div>
    </div>
);

const StatisticsSummary = ({
    is_mobile,
    total_stake,
    currency,
    total_payout,
    number_of_runs,
    lost_contracts,
    won_contracts,
    toggleStatisticsInfoModal,
    total_profit,
}) => (
    <div
        className={classNames('run-panel__stat', {
            'run-panel__stat--mobile': is_mobile,
        })}
    >
        <div className='run-panel__stat--info' onClick={toggleStatisticsInfoModal}>
            <div className='run-panel__stat--info-item'>
                <Localize i18n_default_text="What's this?" />
            </div>
        </div>
        <div className='run-panel__stat--tiles'>
            <StatisticsTile
                title={localize('Total stake')}
                alignment='top'
                content={<Money amount={total_stake} currency={currency} show_currency />}
            />
            <StatisticsTile
                title={localize('Total payout')}
                alignment='top'
                content={<Money amount={total_payout} currency={currency} show_currency />}
            />
            <StatisticsTile title={localize('No. of runs')} alignment='top' content={number_of_runs} />
            <StatisticsTile title={localize('Contracts lost')} alignment='bottom' content={lost_contracts} />
            <StatisticsTile title={localize('Contracts won')} alignment='bottom' content={won_contracts} />
            <StatisticsTile
                title={localize('Profit/loss')}
                content={<Money amount={total_profit} currency={currency} has_sign show_currency />}
                alignment='bottom'
                contentClassName={classNames('run-panel__stat-amount', {
                    'run-panel__stat-amount--positive': total_profit > 0,
                    'run-panel__stat-amount--negative': total_profit < 0,
                })}
            />
        </div>
    </div>
);

const drawerFooter = ({ is_clear_stat_disabled, onClearStatClick }) => (
    <div className='run-panel__footer'>
        <Button
            id='db-run-panel__clear-button'
            className='run-panel__footer-button'
            is_disabled={is_clear_stat_disabled}
            text={localize('Reset')}
            onClick={onClearStatClick}
            has_effect
            secondary
        />
    </div>
);

const MobileDrawerFooter = () => {
    return (
        <div className='controls__section'>
            <div className='controls__buttons'>
                <TradeAnimation className='controls__animation' should_show_overlay info_direction={'right'} />
            </div>
        </div>
    );
};

const StatisticsInfoModal = ({ is_mobile, is_statistics_info_modal_open, toggleStatisticsInfoModal }) => {
    return (
        <Modal
            className={classNames('statistics__modal', { 'statistics__modal--mobile': is_mobile })}
            title={localize("What's this?")}
            is_open={is_statistics_info_modal_open}
            toggleModal={toggleStatisticsInfoModal}
            width={'440px'}
        >
            <Modal.Body>
                <div className={classNames('statistics__modal-body', { 'statistics__modal-body--mobile': is_mobile })}>
                    <ThemedScrollbars className='statistics__modal-scrollbar'>
                        <p className='statistics__modal-body--content no-margin'>{localize('Total stake')}</p>
                        <p>
                            {localize(
                                'Total stake since you last cleared your stats. Refreshing the page will also clear your stats.'
                            )}
                        </p>
                        <p className='statistics__modal-body--content'>{localize('Total payout')}</p>
                        <p>
                            {localize(
                                'Total payout since you last cleared your stats. Refreshing the page will also clear your stats.'
                            )}
                        </p>
                        <p className='statistics__modal-body--content'>{localize('No. of runs')}</p>
                        <p>
                            {localize(
                                'The number of times your bot has run since you last cleared your stats. Each run includes the execution of all the root blocks. Refreshing the page will also clear your stats.'
                            )}
                        </p>
                        <p className='statistics__modal-body--content'>{localize('Contracts lost')}</p>
                        <p>
                            {localize(
                                'The number of contracts you have lost since you last cleared your stats. Refreshing the page will also clear your stats.'
                            )}
                        </p>
                        <p className='statistics__modal-body--content'>{localize('Contracts won')}</p>
                        <p>
                            {localize(
                                'The number of contracts you have won since you last cleared your stats. Refreshing the page will also clear your stats.'
                            )}
                        </p>
                        <p className='statistics__modal-body--content'>{localize('Profit/loss')}</p>
                        <p>
                            {localize(
                                'Your total profit/loss since you last cleared your stats. It is the difference between your total payout and your total stake. Refreshing the page will also clear your stats.'
                            )}
                        </p>
                    </ThemedScrollbars>
                </div>
            </Modal.Body>
        </Modal>
    );
};

class RunPanel extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }
    render() {
        const {
            active_index,
            dialog_options,
            is_clear_stat_disabled,
            is_drawer_open,
            is_mobile,
            is_statistics_info_modal_open,
            onClearStatClick,
            setActiveTabIndex,
            toggleDrawer,
            is_dialog_open,
            onOkButtonClick,
            onRunButtonClick,
            onCancelButtonClick,
            toggleStatisticsInfoModal,
            onCloseDialog,
        } = this.props;
        const content = drawerContent({ active_index, is_drawer_open, setActiveTabIndex, ...this.props });
        const footer = drawerFooter({ is_clear_stat_disabled, onClearStatClick });

        return (
            <>
                <div className={is_mobile && is_drawer_open ? 'run-panel__container--mobile' : undefined}>
                    <Drawer
                        className={!is_mobile ? 'run-panel__container' : undefined}
                        contentClassName='run-panel__content'
                        clear_stat_button_text={localize('Reset')}
                        footer={!is_mobile && footer}
                        is_clear_stat_disabled={is_clear_stat_disabled}
                        is_mobile={is_mobile}
                        is_open={is_drawer_open}
                        onClearStatClick={onClearStatClick}
                        toggleDrawer={toggleDrawer}
                        zIndex={popover_zindex.RUN_PANEL}
                    >
                        {content}
                    </Drawer>
                    {is_mobile && <MobileDrawerFooter />}
                </div>
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    cancel_button_text={dialog_options.cancel_button_text || localize('Cancel')}
                    onCancel={onCancelButtonClick}
                    confirm_button_text={dialog_options.ok_button_text || localize('OK')}
                    onConfirm={onOkButtonClick || onCloseDialog}
                    is_mobile_full_width={false}
                    className={'dc-dialog__wrapper--fixed'}
                    has_close_icon
                >
                    {dialog_options.message}
                </Dialog>
                <SelfExclusion
                    onRunButtonClick={onRunButtonClick}
                    onCancelButtonClick={this.props.resetSelfExclusion}
                />
                <StatisticsInfoModal
                    is_mobile={is_mobile}
                    is_statistics_info_modal_open={is_statistics_info_modal_open}
                    toggleStatisticsInfoModal={toggleStatisticsInfoModal}
                />
            </>
        );
    }
}

RunPanel.propTypes = {
    active_index: PropTypes.number,
    dialog_options: PropTypes.object,
    is_clear_stat_disabled: PropTypes.bool,
    is_dialog_open: PropTypes.bool,
    is_drawer_open: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_statistics_info_modal_open: PropTypes.bool,
    onCancelButtonClick: PropTypes.func,
    onClearStatClick: PropTypes.func,
    onCloseDialog: PropTypes.func,
    onMount: PropTypes.func,
    onOkButtonClick: PropTypes.func,
    onRunButtonClick: PropTypes.func,
    onUnmount: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    toggleDrawer: PropTypes.func,
    currency: PropTypes.string,
    lost_contracts: PropTypes.number,
    number_of_runs: PropTypes.number,
    toggleStatisticsInfoModal: PropTypes.func,
    total_payout: PropTypes.number,
    total_profit: PropTypes.number,
    total_stake: PropTypes.number,
    won_contracts: PropTypes.number,
};

export default connect(({ run_panel, core, ui }) => ({
    active_index: run_panel.active_index,
    dialog_options: run_panel.dialog_options,
    is_clear_stat_disabled: run_panel.is_clear_stat_disabled,
    is_dialog_open: run_panel.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
    is_mobile: ui.is_mobile,
    is_statistics_info_modal_open: run_panel.is_statistics_info_modal_open,
    onCancelButtonClick: run_panel.onCancelButtonClick,
    onClearStatClick: run_panel.onClearStatClick,
    onCloseDialog: run_panel.onCloseDialog,
    onMount: run_panel.onMount,
    onOkButtonClick: run_panel.onOkButtonClick,
    onRunButtonClick: run_panel.onRunButtonClick,
    onUnmount: run_panel.onUnmount,
    setActiveTabIndex: run_panel.setActiveTabIndex,
    toggleDrawer: run_panel.toggleDrawer,
    currency: core.client.currency,
    lost_contracts: run_panel.statistics.lost_contracts,
    number_of_runs: run_panel.statistics.number_of_runs,
    toggleStatisticsInfoModal: run_panel.toggleStatisticsInfoModal,
    total_payout: run_panel.statistics.total_payout,
    total_profit: run_panel.statistics.total_profit,
    total_stake: run_panel.statistics.total_stake,
    won_contracts: run_panel.statistics.won_contracts,
}))(RunPanel);
