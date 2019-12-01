import classNames    from 'classnames';
import { Money }     from 'deriv-components';
import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from 'deriv-translations';
import ContractCard  from './contract-card.jsx';
import { connect }   from '../stores/connect';
import                    '../assets/sass/summary.scss';

const SummaryTile = (props) => (
    <div className={'summary__tile'}>
        <div className='summary__tile-title'>{props.title}</div>
        <div className={classNames('summary__tile-content', props.contentClassName)}>
            { props.content }
        </div>
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
            <ContractCard />
            <div className='summary__tiles'>
                <SummaryTile
                    title={localize('Total stake')}
                    content={ Money({ amount: total_stake, currency }) }
                />
                <SummaryTile
                    title={localize('Total payout')}
                    content={ Money({ amount: total_payout, currency }) }
                />
                <SummaryTile
                    title={localize('No. of runs')}
                    content={number_of_runs}
                />
                <SummaryTile
                    title={localize('Loss contracts')}
                    content={lost_contracts}
                />
                <SummaryTile
                    title={localize('Win contracts')}
                    content={won_contracts}
                />
                <SummaryTile
                    title={localize('Profit/Loss')}
                    content={Money({ amount: total_profit, currency, has_sign: true })}
                    contentClassName={classNames(
                        'summary__tile-content',
                        'summary__amount', {
                            'summary__amount--positive': total_profit > 0,
                            'summary__amount--negative': total_profit < 0,
                        })}
                />
            </div>
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
