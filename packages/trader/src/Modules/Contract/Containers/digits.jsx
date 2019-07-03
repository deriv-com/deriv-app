import PropTypes               from 'prop-types';
import React                   from 'react';
import { SlideIn }             from 'App/Components/Animations';
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
            replay_info,
        } = this.props;
        const barrier       = contract_info.barrier || replay_info.barrier;
        const contract_type = contract_info.contract_type || replay_info.contract_type;

        return (
            <SlideIn
                is_visible={is_digit_contract && this.state.mounted}
                className='digits'
                keyname='digits'
                type='bottom'
            >
                <LastDigitPrediction
                    barrier={+barrier}
                    contract_type={contract_type}
                    digits_info={digits_info}
                    is_ended={is_ended}
                    is_trade_page={is_trade_page}
                    status={display_status}
                />
            </SlideIn>
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
    replay_info      : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        contract_info    : modules.contract.contract_info,
        digits_info      : modules.contract.digits_info,
        display_status   : modules.contract.display_status,
        is_digit_contract: modules.contract.is_digit_contract,
        is_ended         : modules.contract.is_ended,
        replay_info      : modules.contract.replay_info,
    })
)(Digits);
