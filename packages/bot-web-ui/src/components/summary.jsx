import classNames from 'classnames';
import { Money, ThemedScrollbars, Popover } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import ContractCard from './contract-card.jsx';
import { connect } from '../stores/connect';
import '../assets/sass/summary.scss';
import { popover_zindex } from '../constants/z-indexes';

const SummaryTile = props => (
    <div className={'summary__tile'}>
        <Popover
            className='run-panel__info'
            classNameBubble='run-panel__info--bubble'
            alignment={props.alignment}
            message={props.tooltip}
            zIndex={popover_zindex.SUMMARY_TOOLTIPS}
        >
            {/* <Icon icon='IcInfoOutline' className='run-panel__icon-info' /> */}
            <div className='summary__tile-title'>{props.title}</div>
            <div className={classNames('summary__tile-content', props.contentClassName)}>{props.content}</div>
        </Popover>
    </div>
);

const Summary = ({
    total_stake,
    total_payout,
    number_of_runs,
    lost_contracts,
    won_contracts,
    total_profit,
    currency,
}) => {
    return (
        <div className='summary'>
            <ThemedScrollbars autoHide style={{ height: 'var(--drawer-scroll-height)' }}>
                <ContractCard />
                <div className='summary__tiles'>
                    <SummaryTile
                        title={localize('Total stake')}
                        alignment='top'
                        content={Money({ amount: total_stake, currency })}
                        tooltip={localize(
                            'Total stake since you last cleared your stats. Refreshing the page will also clear your stats.'
                        )}
                    />
                    <SummaryTile
                        title={localize('Total payout')}
                        alignment='top'
                        content={Money({ amount: total_payout, currency })}
                        tooltip={localize(
                            'Total payout since you last cleared your stats. Refreshing the page will also clear your stats.'
                        )}
                    />
                    <SummaryTile
                        title={localize('No. of runs')}
                        alignment='top'
                        content={number_of_runs}
                        tooltip={localize(
                            'The number of times your bot has run since you last cleared your stats. Each run includes the execution of all the root blocks. Refreshing the page will also clear your stats.'
                        )}
                    />
                    <SummaryTile
                        title={localize('Contracts lost')}
                        alignment='bottom'
                        content={lost_contracts}
                        tooltip={localize(
                            'The number of contracts you have lost since you last cleared your stats. Refreshing the page will also clear your stats.'
                        )}
                    />
                    <SummaryTile
                        title={localize('Contracts won')}
                        alignment='bottom'
                        content={won_contracts}
                        tooltip={localize(
                            'The number of contracts you have won since you last cleared your stats. Refreshing the page will also clear your stats.'
                        )}
                    />
                    <SummaryTile
                        title={localize('Profit/Loss')}
                        content={Money({ amount: total_profit, currency, has_sign: true })}
                        alignment='bottom'
                        contentClassName={classNames('summary__tile-content', 'summary__amount', {
                            'summary__amount--positive': total_profit > 0,
                            'summary__amount--negative': total_profit < 0,
                        })}
                        tooltip={localize(
                            'Your total profit/loss since you last cleared your stats. It is the difference between your total payout and your total stake. Refreshing the page will also clear your stats.'
                        )}
                    />
                </div>
            </ThemedScrollbars>
        </div>
    );
};

Summary.propTypes = {
    contract: PropTypes.object,
    currency: PropTypes.string,
    lost_contracts: PropTypes.number,
    number_of_runs: PropTypes.number,
    total_payout: PropTypes.number,
    total_profit: PropTypes.number,
    total_stake: PropTypes.number,
    won_contracts: PropTypes.number,
};

export default connect(({ core, summary: s }) => ({
    contract: s.summary.contract,
    currency: core.client.currency,
    lost_contracts: s.summary.lost_contracts,
    number_of_runs: s.summary.number_of_runs,
    total_payout: s.summary.total_payout,
    total_profit: s.summary.total_profit,
    total_stake: s.summary.total_stake,
    won_contracts: s.summary.won_contracts,
}))(Summary);
