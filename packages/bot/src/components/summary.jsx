import classNames    from 'classnames';
import {
    Money,
    ThemedScrollbars,
    Popover,
}                    from 'deriv-components';
import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from 'deriv-translations';
import ContractCard  from './contract-card.jsx';
import { connect }   from '../stores/connect';
import                    '../assets/sass/summary.scss';

const SummaryTile = (props) => (
    <div className={'summary__tile'}>
        <Popover
            className='run-panel__info'
            classNameBubble='run-panel__info--bubble'
            alignment='top'
            message={ props.tooltip }
        >
            {/* <Icon icon='IcInfoOutline' className='run-panel__icon-info' /> */}
            <div className='summary__tile-title'>{props.title}</div>
            <div className={classNames('summary__tile-content', props.contentClassName)}>
                { props.content }
            </div>
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
            <ThemedScrollbars
                autoHide
                style={{ height: 'var(--drawer-scroll-height)' }}
            >
                <ContractCard />
                <div className='summary__tiles'>
                    <SummaryTile
                        title={localize('Total stake')}
                        content={ Money({ amount: total_stake, currency }) }
                        tooltip={localize('Your total stake. This is reset when you click on “Clear stat” or when you refresh this page.')}
                    />
                    <SummaryTile
                        title={localize('Total payout')}
                        content={ Money({ amount: total_payout, currency }) }
                        tooltip={localize('Your total payout. This is reset when you click on “Clear stat” or when you refresh this page.')}
                    />
                    <SummaryTile
                        title={localize('No. of runs')}
                        content={number_of_runs}
                        tooltip={localize('The number of times your bot has run. Each run includes the execution of all the root blocks. This is reset when you click on “Clear stat” or when you refresh this page.')}
                    />
                    <SummaryTile
                        title={localize('Loss contracts')}
                        content={lost_contracts}
                        tooltip={localize('The number of contracts you have lost. This is reset when you click on “Clear stat” or when you refresh this page.')}
                    />
                    <SummaryTile
                        title={localize('Win contracts')}
                        content={won_contracts}
                        tooltip={localize('The number of contracts you have won. This is reset when you click on “Clear stat” or when you refresh this page.')}
                    />
                    <SummaryTile
                        title={localize('Profit/Loss')}
                        content={Money({ amount: total_profit, currency, has_sign: true })}
                        tooltip={localize('A sum of all stakes you made')}
                        contentClassName={classNames(
                            'summary__tile-content',
                            'summary__amount', {
                                'summary__amount--positive': total_profit > 0,
                                'summary__amount--negative': total_profit < 0,
                            })}
                        tooltip={localize('Your total profit/loss, which is the difference between your total payout and your total stake. This is reset when you click on “Clear stat” or when you refresh this page.')}
                    />
                </div>
            </ThemedScrollbars>
        </div>
    );
};

Summary.propTypes = {
    contract      : PropTypes.object,
    currency      : PropTypes.string,
    lost_contracts: PropTypes.number,
    number_of_runs: PropTypes.number,
    total_payout  : PropTypes.number,
    total_profit  : PropTypes.number,
    total_stake   : PropTypes.number,
    won_contracts : PropTypes.number,
};

export default connect(({ core, summary: s }) => ({
    contract      : s.summary.contract,
    currency      : core.client.currency,
    lost_contracts: s.summary.lost_contracts,
    number_of_runs: s.summary.number_of_runs,
    total_payout  : s.summary.total_payout,
    total_profit  : s.summary.total_profit,
    total_stake   : s.summary.total_stake,
    won_contracts : s.summary.won_contracts,
}))(Summary);
