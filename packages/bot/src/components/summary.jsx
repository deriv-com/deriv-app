import classNames    from 'classnames';
import { Money }     from 'deriv-components';
import PropTypes     from 'prop-types';
import React         from 'react';
import ContractCard  from './contract-card.jsx';
import { connect }   from '../stores/connect';
import { translate } from '../utils/lang/i18n';
import                    '../assets/sass/summary.scss';

const SummaryTile = (props) => (
    <div className={'summary__tile'}>
        <div className='summary__tile-title'>{props.title}</div>
        <div className={classNames('summary__tile-content', {
            [props.contentClassName]: !!props.contentClassName,
        })}
        >
            { props.content }
        </div>
    </div>
);

class Summary extends React.PureComponent {
    componentDidMount() {
        this.props.registerOnAccountSwitch();
    }

    componentWillUnmount() {
        this.props.disposeOnAccountSwitch();
        this.props.disposeObserverListener();
    }

    render() {
        const {
            total_stake,
            total_payout,
            number_of_runs,
            lost_contracts,
            won_contracts,
            total_profit,
            currency } = this.props;

        return (
            <div className='summary'>
                <ContractCard />
                <div className='summary__tiles'>
                    <SummaryTile
                        title={translate('Total stake')}
                        content={ Money({ amount: total_stake, currency }) }
                    />
                    <SummaryTile
                        title={translate('Total payout')}
                        content={ Money({ amount: total_payout, currency }) }
                    />
                    <SummaryTile
                        title={translate('No. of runs')}
                        content={number_of_runs}
                    />
                    <SummaryTile
                        title={translate('Loss contracts')}
                        content={lost_contracts}
                    />
                    <SummaryTile
                        title={translate('Win contracts')}
                        content={won_contracts}
                    />
                    <SummaryTile
                        title={translate('Profit/Loss')}
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
    }
}

Summary.propTypes = {
    contract               : PropTypes.object,
    currency               : PropTypes.string,
    dispose                : PropTypes.func,
    disposeObserverListener: PropTypes.func,
    disposeOnAccountSwitch : PropTypes.func,
    lost_contracts         : PropTypes.number,
    number_of_runs         : PropTypes.number,
    registerOnAccountSwitch: PropTypes.func,
    total_payout           : PropTypes.number,
    total_profit           : PropTypes.number,
    total_stake            : PropTypes.number,
    won_contracts          : PropTypes.number,
};

export default connect(({ summary }) => ({
    contract               : summary.contract,
    currency               : summary.currency,
    dispose                : summary.dispose,
    lost_contracts         : summary.lost_contracts,
    number_of_runs         : summary.number_of_runs,
    registerOnAccountSwitch: summary.registerOnAccountSwitch,
    total_payout           : summary.total_payout,
    total_profit           : summary.total_profit,
    total_stake            : summary.total_stake,
    won_contracts          : summary.won_contracts,
    disposeOnAccountSwitch : summary.disposeOnAccountSwitch,
    disposeObserverListener: summary.disposeObserverListener,
}))(Summary);
