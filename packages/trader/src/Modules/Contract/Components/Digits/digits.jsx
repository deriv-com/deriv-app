import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { toJS } from 'mobx';
import { DesktopWrapper, MobileWrapper, Popover } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { isContractElapsed } from 'Stores/Modules/Contract/Helpers/logic';
import { Bounce, SlideIn } from 'App/Components/Animations';
import { getMarketNamesMap } from 'Constants';
import { DigitSpot, LastDigitPrediction } from '../LastDigitPrediction';
import 'Sass/app/modules/contract/digits.scss';

const DigitsWrapper = ({
    contract_info,
    digits_array,
    digits_info,
    display_status,
    is_digit_contract,
    is_ended,
    is_trade_page,
    onDigitChange,
    selected_digit,
    trade_type,
    onChangeStatus,
    ...props
}) => {
    const has_contract = contract_info.date_start;
    let tick = props.tick;

    const is_tick_ready = is_trade_page ? !!tick : true;
    const is_contract_elapsed = is_trade_page ? isContractElapsed(contract_info, tick) : false;
    const status = !is_contract_elapsed && is_tick_ready ? display_status : null;

    // tick from contract_info.tick_stream has totally different
    // format from the tick from tick_history api call.
    if (has_contract && !is_contract_elapsed) {
        tick = null;
        const tick_stream = contract_info.tick_stream;
        if (tick_stream && tick_stream.length) {
            const t = toJS(tick_stream.slice(-1)[0]);
            tick = {
                ask: t.tick,
                bid: t.tick,
                epoch: t.epoch,
                pip_size: t.tick_display_value.split('.')[1].length,
                current_tick: tick_stream.length,
            };
        }
    }

    React.useEffect(() => {
        if (onChangeStatus) {
            onChangeStatus({ status, current_tick: tick ? tick.current_tick : null });
        }
    }, [tick, is_trade_page, display_status, onChangeStatus, status]);

    return (
        <LastDigitPrediction
            // dimension of a single digit widget including margin/padding (number)
            // i.e - 40px + 6px left and 6px right padding/margin = 52
            dimension={isMobile() ? 64 : 52}
            has_entry_spot={!!contract_info.entry_tick}
            barrier={!is_contract_elapsed && is_tick_ready ? +contract_info.barrier : null}
            contract_type={!is_contract_elapsed && is_tick_ready ? contract_info.contract_type : null}
            digits={digits_array}
            digits_info={!is_contract_elapsed && is_tick_ready ? digits_info : {}}
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
            is_trade_page={is_trade_page}
            status={status}
            tick={tick}
            trade_type={trade_type}
            onDigitChange={onDigitChange}
            selected_digit={selected_digit}
            onLastDigitSpot={props.onLastDigitSpot}
        />
    );
};

class Digits extends React.PureComponent {
    state = {
        mounted: false,
    };

    // TODO: make Digits into stateless component and fix issue with transition not working without mounted state
    componentDidMount() {
        this.setState({ mounted: true });
    }

    onChangeStatus = ({ status, current_tick }) => {
        this.setState({ status, current_tick });
    };

    onLastDigitSpot = ({ spot, is_lost, is_selected_winning, is_latest, is_won }) => {
        this.setState({ spot, is_lost, is_selected_winning, is_latest, is_won });
    };

    get popover_message() {
        const { contract_info, is_trade_page, underlying } = this.props;
        const underlying_name = is_trade_page ? underlying : contract_info.underlying;

        return localize('Last digit stats for latest 1000 ticks for {{underlying_name}}', {
            underlying_name: getMarketNamesMap()[underlying_name.toUpperCase()],
        });
    }

    render() {
        const { contract_info, digits_array, is_digit_contract, is_trade_page } = this.props;
        const { status, spot, is_lost, is_selected_winning, is_latest, is_won, current_tick } = this.state;
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <SlideIn
                        is_visible={(digits_array || is_digit_contract) && this.state.mounted}
                        className='digits__container'
                        keyname='digits'
                        type='bottom'
                    >
                        {is_trade_page && (
                            <div className='digits__tooltip-container'>
                                <Popover
                                    alignment='top'
                                    classNameBubble='digits__tooltip-bubble'
                                    icon='info'
                                    id='dt_last_digits_info_tooltip'
                                    margin={4}
                                    message={this.popover_message}
                                />
                            </div>
                        )}
                        <DigitsWrapper {...this.props} />
                    </SlideIn>
                </DesktopWrapper>
                <MobileWrapper>
                    <div className='digits__container'>
                        <Bounce
                            is_visible={!!(is_digit_contract && status && spot && !!contract_info.entry_tick)}
                            className={classNames('digits__digit-spot', {
                                'digits__digit-spot--is-trading': is_trade_page,
                            })}
                            keyname='digits__digit-spot'
                        >
                            {is_trade_page && (
                                <span className='digits__digit-spot-value'>
                                    <Localize i18n_default_text='Tick {{current_tick}} - ' values={{ current_tick }} />
                                </span>
                            )}
                            <DigitSpot
                                current_spot={spot}
                                is_lost={is_lost}
                                is_selected_winning={is_selected_winning}
                                is_visible={!!(is_latest && spot)}
                                is_won={is_won}
                            />
                        </Bounce>
                        <DigitsWrapper
                            {...this.props}
                            onChangeStatus={this.onChangeStatus}
                            onLastDigitSpot={this.onLastDigitSpot}
                        />
                    </div>
                </MobileWrapper>
            </React.Fragment>
        );
    }
}

Digits.propTypes = {
    contract_info: PropTypes.object,
    digits_info: PropTypes.object,
    display_status: PropTypes.string,
    is_digit_contract: PropTypes.bool,
    is_ended: PropTypes.bool,
    is_trade_page: PropTypes.bool,
    trade_type: PropTypes.string,
    onDigitChange: PropTypes.func,
    selected_digit: PropTypes.number,
};

export default Digits;
