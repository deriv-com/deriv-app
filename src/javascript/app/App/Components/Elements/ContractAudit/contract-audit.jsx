import classNames              from 'classnames';
import moment                  from 'moment';
import PropTypes               from 'prop-types';
import React, { Component }    from 'react';
import Localize                from 'App/Components/Elements/localize.jsx';
import { Icon, IconArrowBold } from 'Assets/Common';

const Pair = ({ value, label }) => (
    <div className='pair'>
        <div className='pair__label'>
            <Localize str={label} />
        </div>
        <div className='pair__value'>
            {value}
        </div>
    </div>
);

class ContractAudit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false,
        };
    }

    toggleVisibility () {
        this.setState({
            is_visible: !this.state.is_visible,
        });
    }

    getDuration () {
        const {
            tick_count,
            date_start,
            date_expiry,
        } = this.props.contract;

        const is_tick_contract = !!tick_count;
        if (is_tick_contract) {
            return `${tick_count} tick${tick_count > 1 ? 's' : ''}`;
        }

        const start_time = moment(date_start * 1000);
        const end_time   = moment(date_expiry * 1000);
        const duration   = moment.duration(end_time.diff(start_time));

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
    }

    render() {
        const {
            barrier,
            transaction_ids,
            entry_tick,
            exit_tick,
            entry_tick_time,
            exit_tick_time,
        } = this.props.contract;

        return (
            <div className='contract-audit'>
                <div
                    className='contract-audit__toggle'
                    onClick={this.toggleVisibility.bind(this)}
                >
                    <Icon
                        icon={IconArrowBold}
                        className={classNames('contract-audit__arrow', {
                            'contract-audit__arrow--is-open': this.state.is_visible,
                        })}
                    />
                </div>
                <div
                    className={classNames('contract-audit__details', {
                        'contract-audit__details--is-expanded': this.state.is_visible,
                        'contract-audit__details--is-hidden'  : !this.state.is_visible,
                    })}
                >
                    <div className='border' />
                    <div className='pairs'>
                        <Pair label='Ref. ID (Buy)' value={transaction_ids.buy} />
                        <Pair label='Ref. ID (Sell)' value={transaction_ids.sell} />
                    </div>
                    <div className='border' />
                    <div className='pairs'>
                        <Pair label='Duration' value={this.getDuration()} />
                        <Pair label='Barrier' value={barrier} />
                    </div>
                    <div className='border' />
                    <div className='pairs'>
                        <Pair label='Entry Spot' value={entry_tick} />
                        <Pair label='Exit Spot' value={exit_tick} />
                    </div>
                    <div className='border' />
                    <div className='pairs'>
                        <Pair label='Start Time' value={entry_tick_time} />
                        <Pair label='End Time' value={exit_tick_time} />
                    </div>
                </div>
            </div>
        );
    }
}

ContractAudit.propTypes = {
    contract: PropTypes.object,
};

export default ContractAudit;
