import PropTypes               from 'prop-types';
import React                   from 'react';
import { getDiffInSeconds }    from 'Stores/Modules/Contract/Helpers/logic';
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
            digits_array,
            digits_info,
            display_status,
            is_digit_contract,
            is_ended,
            is_trade_page,
            tick,
        } = this.props;

        const is_contract_elapsed = (tick && is_trade_page) ?
            getDiffInSeconds(contract_info, tick.epoch) : false;

        return (
            <SlideIn
                is_visible={(digits_array || is_digit_contract) && this.state.mounted}
                className='digits'
                keyname='digits'
                type='bottom'
            >
                <LastDigitPrediction
                    // dimension of a single digit widget including margin/padding (number)
                    // i.e - 40px + 4px left and 4px right padding/margin = 48
                    dimension={48}
                    barrier={!is_contract_elapsed ? +contract_info.barrier : null}
                    contract_type={!is_contract_elapsed ? contract_info.contract_type : null}
                    digits={digits_array}
                    digits_info={!is_contract_elapsed ? digits_info : {}}
                    is_digit_contract={is_digit_contract}
                    is_ended={is_ended}
                    is_trade_page={is_trade_page}
                    status={!is_contract_elapsed ? display_status : null}
                    tick={tick}
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
