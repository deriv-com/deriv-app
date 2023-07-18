import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Drawer, Modal, Money, Tabs, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import Journal from 'Components/journal';
import SelfExclusion from 'Components/self-exclusion';
import Summary from 'Components/summary';
import TradeAnimation from 'Components/trade-animation';
import Transactions from 'Components/transactions';
import { popover_zindex } from 'Constants/z-indexes';
import { connect } from 'Stores/connect';

const StatisticsTile = ({ content, contentClassName, title }) => (
    <div className='run-panel__tile'>
        <div className='run-panel__tile-title'>{title}</div>
        <div className={classNames('run-panel__tile-content', contentClassName)}>{content}</div>
    </div>
);

const StatisticsSummary = ({
    currency,
    is_mobile,
    lost_contracts,
    number_of_runs,
    total_stake,
    total_payout,
    has_started_onboarding_tour,
    toggleStatisticsInfoModal,
    total_profit,
    won_contracts,
}) => (
    <div
        className={classNames('run-panel__stat', {
            'run-panel__stat--tour-active': has_started_onboarding_tour,
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
                title={localize('Total profit/loss')}
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

const DrawerHeader = ({ is_clear_stat_disabled, is_mobile, is_drawer_open, onClearStatClick }) =>
    is_mobile &&
    is_drawer_open && (
        <Button
            id='db-run-panel__clear-button'
            className='run-panel__clear-button'
            is_disabled={is_clear_stat_disabled}
            text={localize('Reset')}
            onClick={onClearStatClick}
            secondary
        />
    );

const DrawerContent = ({ active_index, is_drawer_open, has_started_onboarding_tour, setActiveTabIndex, ...props }) => {
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
                    <Journal />
                </div>
            </Tabs>
            {is_drawer_open && active_index !== 2 && (
                <StatisticsSummary has_started_onboarding_tour={has_started_onboarding_tour} {...props} />
            )}
        </>
    );
};

const DrawerFooter = ({ is_clear_stat_disabled, onClearStatClick }) => (
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
                        <Text as='p' weight='bold' className='statistics__modal-body--content no-margin'>
                            {localize('Total stake')}
                        </Text>
                        <Text as='p'>{localize('Total stake since you last cleared your stats.')}</Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Total payout')}
                        </Text>
                        <Text as='p'>{localize('Total payout since you last cleared your stats.')}</Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('No. of runs')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The number of times your bot has run since you last cleared your stats. Each run includes the execution of all the root blocks.'
                            )}
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Contracts lost')}
                        </Text>
                        <Text as='p'>
                            {localize('The number of contracts you have lost since you last cleared your stats.')}
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Contracts won')}
                        </Text>
                        <Text as='p'>
                            {localize('The number of contracts you have won since you last cleared your stats.')}
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            {localize('Total profit/loss')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Your total profit/loss since you last cleared your stats. It is the difference between your total payout and your total stake.'
                            )}
                        </Text>
                    </ThemedScrollbars>
                </div>
            </Modal.Body>
        </Modal>
    );
};

const RunPanel = ({
    active_index,
    currency,
    has_started_onboarding_tour,
    is_clear_stat_disabled,
    is_drawer_open,
    is_statistics_info_modal_open,
    lost_contracts,
    number_of_runs,
    onClearStatClick,
    onMount,
    onRunButtonClick,
    onUnmount,
    setActiveTabIndex,
    toggleDrawer,
    toggleStatisticsInfoModal,
    total_payout,
    total_profit,
    total_stake,
    won_contracts,
}) => {
    const is_mobile = isMobile();

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        if (is_mobile) {
            toggleDrawer(false);
        }
    }, []);

    const content = (
        <DrawerContent
            active_index={active_index}
            currency={currency}
            is_drawer_open={is_drawer_open}
            is_mobile={is_mobile}
            lost_contracts={lost_contracts}
            number_of_runs={number_of_runs}
            setActiveTabIndex={setActiveTabIndex}
            toggleStatisticsInfoModal={toggleStatisticsInfoModal}
            total_payout={total_payout}
            total_profit={total_profit}
            total_stake={total_stake}
            won_contracts={won_contracts}
            has_started_onboarding_tour={has_started_onboarding_tour}
        />
    );

    const footer = <DrawerFooter is_clear_stat_disabled={is_clear_stat_disabled} onClearStatClick={onClearStatClick} />;

    const header = (
        <DrawerHeader
            is_clear_stat_disabled={is_clear_stat_disabled}
            is_mobile={is_mobile}
            is_drawer_open={is_drawer_open}
            onClearStatClick={onClearStatClick}
        />
    );

    return (
        <>
            <div className={is_mobile && is_drawer_open ? 'run-panel__container--mobile' : 'run-panel'}>
                <Drawer
                    anchor='right'
                    className={classNames('run-panel', {
                        'run-panel__container': !is_mobile,
                        'run-panel__container--tour-active': !is_mobile && has_started_onboarding_tour,
                    })}
                    contentClassName='run-panel__content'
                    header={header}
                    footer={!is_mobile && footer}
                    is_open={is_drawer_open}
                    toggleDrawer={toggleDrawer}
                    width={366}
                    zIndex={popover_zindex.RUN_PANEL}
                >
                    {content}
                </Drawer>
                {is_mobile && <MobileDrawerFooter />}
            </div>
            <SelfExclusion onRunButtonClick={onRunButtonClick} />
            <StatisticsInfoModal
                is_mobile={is_mobile}
                is_statistics_info_modal_open={is_statistics_info_modal_open}
                toggleStatisticsInfoModal={toggleStatisticsInfoModal}
            />
        </>
    );
};

RunPanel.propTypes = {
    active_index: PropTypes.number,
    currency: PropTypes.string,
    is_clear_stat_disabled: PropTypes.bool,
    is_drawer_open: PropTypes.bool,
    is_statistics_info_modal_open: PropTypes.bool,
    lost_contracts: PropTypes.number,
    number_of_runs: PropTypes.number,
    onClearStatClick: PropTypes.func,
    onMount: PropTypes.func,
    onRunButtonClick: PropTypes.func,
    onUnmount: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    toggleDrawer: PropTypes.func,
    toggleStatisticsInfoModal: PropTypes.func,
    total_payout: PropTypes.number,
    total_profit: PropTypes.number,
    total_stake: PropTypes.number,
    won_contracts: PropTypes.number,
};

export default connect(({ run_panel, core, dashboard }) => ({
    active_index: run_panel.active_index,
    currency: core.client.currency,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    is_clear_stat_disabled: run_panel.is_clear_stat_disabled,
    is_drawer_open: run_panel.is_drawer_open,
    is_statistics_info_modal_open: run_panel.is_statistics_info_modal_open,
    lost_contracts: run_panel.statistics.lost_contracts,
    number_of_runs: run_panel.statistics.number_of_runs,
    onClearStatClick: run_panel.onClearStatClick,
    onMount: run_panel.onMount,
    onRunButtonClick: run_panel.onRunButtonClick,
    onUnmount: run_panel.onUnmount,
    setActiveTabIndex: run_panel.setActiveTabIndex,
    toggleDrawer: run_panel.toggleDrawer,
    toggleStatisticsInfoModal: run_panel.toggleStatisticsInfoModal,
    total_payout: run_panel.statistics.total_payout,
    total_profit: run_panel.statistics.total_profit,
    total_stake: run_panel.statistics.total_stake,
    won_contracts: run_panel.statistics.won_contracts,
}))(RunPanel);
