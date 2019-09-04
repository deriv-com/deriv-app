import PropTypes               from 'prop-types';
import React                   from 'react';
import { SlideIn }             from 'App/Components/Animations';
import { LastDigitPrediction } from '../LastDigitPrediction';
import 'Sass/app/modules/contract/digits.scss';

class Digits extends React.PureComponent {
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
        } = this.props;

        return (
            <SlideIn
                is_visible={is_digit_contract && this.state.mounted}
                className='digits'
                keyname='digits'
                type='bottom'
            >
                <LastDigitPrediction
                    dimension={48}
                    barrier={+contract_info.barrier}
                    contract_type={contract_info.contract_type}
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
};

export default Digits;
