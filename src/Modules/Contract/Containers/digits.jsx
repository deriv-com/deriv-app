import PropTypes               from 'prop-types';
import React                   from 'react';
import { CSSTransition }       from 'react-transition-group';
import { connect }             from 'Stores/connect';
import { LastDigitPrediction } from '../Components/LastDigitPrediction';

class Digits extends React.Component {
    state = {
        mounted: false,
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }

    render() {
        const {
            contract_info,
            digits_info,
            display_status,
            is_digit_contract,
            is_ended,
            is_trade_page,
            last_digit,
            replay_info,
        } = this.props;
        const barrier       = contract_info.barrier || replay_info.barrier;
        const contract_type = contract_info.contract_type || replay_info.contract_type;

        return (
            <CSSTransition
                in={is_digit_contract && this.state.mounted}
                timeout={250}
                classNames={{
                    enter    : 'digits--enter',
                    enterDone: 'digits--enter-done',
                    exit     : 'digits--exit',
                }}
                unmountOnExit
            >
                <LastDigitPrediction
                    barrier={+barrier || +last_digit} // fallback to last_digit if barrier from contract_info is null
                    contract_type={contract_type}
                    digits_info={digits_info}
                    is_ended={is_ended}
                    is_trade_page={is_trade_page}
                    status={display_status}
                />
            </CSSTransition>
        );
    }
}

Digits.propTypes = {
    contract_info    : PropTypes.object,
    digits_info      : PropTypes.object,
    display_status   : PropTypes.string,
    is_digit_contract: PropTypes.bool,
    is_ended         : PropTypes.bool,
    is_trade_page    : PropTypes.bool,
    last_digit       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    replay_info: PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        contract_info    : modules.contract.contract_info,
        digits_info      : modules.contract.digits_info,
        display_status   : modules.contract.display_status,
        is_digit_contract: modules.contract.is_digit_contract,
        is_ended         : modules.contract.is_ended,
        replay_info      : modules.contract.replay_info,
        last_digit       : modules.trade.last_digit,
    })
)(Digits);
