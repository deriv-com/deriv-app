import PropTypes               from 'prop-types';
import React                   from 'react';
import { Popover }             from 'deriv-components';
import { localize }            from 'App/i18n';
import { isContractElapsed }   from 'Stores/Modules/Contract/Helpers/logic';
import { SlideIn }             from 'App/Components/Animations';
import { getMarketNamesMap }   from 'Constants';
import { LastDigitPrediction } from '../LastDigitPrediction';
import 'Sass/app/modules/contract/digits.scss';

class Digits extends React.PureComponent {
    state = {
        mounted: false,
    }

    // TODO: make Digits into stateless component and fix issue with transition not working without mounted state
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
            underlying,
            tick,
        } = this.props;

        const is_tick_ready       = is_trade_page ? !!(tick) : true;
        const is_contract_elapsed = (is_trade_page) ?
            isContractElapsed(contract_info, tick) : false;

        return (
            <SlideIn
                is_visible={(digits_array || is_digit_contract) && this.state.mounted}
                className='digits'
                keyname='digits'
                type='bottom'
            >
                {underlying &&
                    <div className='digits__tooltip-container'>
                        <Popover
                            alignment='top'
                            classNameBubble='digits__tooltip-bubble'
                            disable_message_icon
                            icon='info'
                            id='dt_last_digits_info_tooltip'
                            margin={4}
                            message={localize(`Last digit stats for latest 1000 ticks for ${getMarketNamesMap()[underlying.toUpperCase()]}`)}
                        />
                    </div>
                }
                <LastDigitPrediction
                    // dimension of a single digit widget including margin/padding (number)
                    // i.e - 40px + 6px left and 6px right padding/margin = 52
                    dimension={52}
                    barrier={(!is_contract_elapsed && is_tick_ready) ? +contract_info.barrier : null}
                    contract_type={(!is_contract_elapsed && is_tick_ready) ? contract_info.contract_type : null}
                    digits={digits_array}
                    digits_info={(!is_contract_elapsed && is_tick_ready) ? digits_info : {}}
                    is_digit_contract={is_digit_contract}
                    is_ended={is_ended}
                    is_trade_page={is_trade_page}
                    status={(!is_contract_elapsed && is_tick_ready) ? display_status : null}
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
