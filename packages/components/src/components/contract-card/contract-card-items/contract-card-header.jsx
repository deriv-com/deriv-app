import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isHighLow, getCurrentTick, getGrowthRatePercentage, isBot, isAccumulatorContract } from '@deriv/shared';
import ContractTypeCell from './contract-type-cell.jsx';
import Button from '../../button';
import Icon from '../../icon';
import Text from '../../text';
import ProgressSlider from '../../progress-slider';
import DesktopWrapper from '../../desktop-wrapper';
import MobileWrapper from '../../mobile-wrapper';
import TickCounterBar from './tick-counter-bar.jsx';

const ContractCardHeader = ({
    contract_info,
    display_name,
    getCardLabels,
    getContractTypeDisplay,
    has_progress_slider,
    id,
    is_mobile,
    is_sell_requested,
    is_sold: is_contract_sold,
    is_valid_to_sell,
    onClickSell,
    server_time,
}) => {
    const current_tick = contract_info.tick_count ? getCurrentTick(contract_info) : null;
    const {
        growth_rate,
        underlying,
        multiplier,
        contract_type,
        shortcode,
        purchase_time,
        date_expiry,
        tick_count,
        tick_passed,
    } = contract_info;
    const { is_pathname_bot } = isBot();
    const is_sold = !!contract_info.is_sold || is_contract_sold;
    const is_accumulator = isAccumulatorContract(contract_type);
    const contract_type_list_info = [
        {
            is_param_displayed: multiplier,
            displayed_param: `x${multiplier}`,
        },
        {
            is_param_displayed: is_accumulator,
            displayed_param: `${getGrowthRatePercentage(growth_rate)}%`,
        },
    ];
    const displayed_trade_param =
        contract_type_list_info.find(contract_type_item_info => contract_type_item_info.is_param_displayed)
            ?.displayed_param || '';

    return (
        <>
            <div
                className={classNames('dc-contract-card__grid', 'dc-contract-card__grid-underlying-trade', {
                    'dc-contract-card__grid-underlying-trade--mobile': is_mobile && !multiplier && !is_accumulator,
                    'dc-contract-card__grid-underlying-trade--trader': !is_pathname_bot,
                    'dc-contract-card__grid-underlying-trade--trader--accumulator': is_accumulator,
                    'dc-contract-card__grid-underlying-trade--trader--accumulator-sold': is_accumulator && is_sold,
                })}
            >
                <div id='dc-contract_card_underlying_label' className='dc-contract-card__underlying-name'>
                    <Icon icon={underlying ? `IcUnderlying${underlying}` : 'IcUnknown'} width={40} size={32} />
                    <Text size='xxs' className='dc-contract-card__symbol' weight='bold'>
                        {display_name || contract_info.display_name}
                    </Text>
                </div>
                <div
                    id='dc-contract_card_type_label'
                    className={classNames('dc-contract-card__type', {
                        'dc-contract-card__type--accumulators': is_accumulator,
                    })}
                >
                    <ContractTypeCell
                        displayed_trade_param={displayed_trade_param}
                        getContractTypeDisplay={getContractTypeDisplay}
                        is_high_low={isHighLow({ shortcode })}
                        type={contract_type}
                    />
                </div>
                <MobileWrapper>
                    {is_valid_to_sell ? (
                        <CSSTransition
                            in={!!is_valid_to_sell}
                            timeout={250}
                            classNames={{
                                enter: 'dc-contract-card__sell-button--enter',
                                enterDone: 'dc-contract-card__sell-button--enter-done',
                                exit: 'dc-contract-card__sell-button--exit',
                            }}
                            unmountOnExit
                        >
                            <div className='dc-contract-card__sell-button-mobile'>
                                <Button
                                    id={`dc_contract_card_${id}_button`}
                                    className={classNames('dc-btn--sell', {
                                        'dc-btn--loading': is_sell_requested,
                                    })}
                                    is_disabled={!is_valid_to_sell || is_sell_requested}
                                    text={getCardLabels().SELL}
                                    onClick={() => onClickSell(id)}
                                    secondary
                                />
                            </div>
                        </CSSTransition>
                    ) : null}
                </MobileWrapper>
                {!is_sold && is_accumulator && (
                    <TickCounterBar
                        current_tick={tick_passed}
                        max_ticks_duration={tick_count}
                        label={getCardLabels().TICKS}
                    />
                )}
            </div>
            <MobileWrapper>
                <div className='dc-progress-slider--completed' />
            </MobileWrapper>
            <DesktopWrapper>
                {(!has_progress_slider || !!is_sold) && <div className='dc-progress-slider--completed' />}
                {has_progress_slider && !is_sold && !is_accumulator && (
                    <ProgressSlider
                        current_tick={current_tick}
                        expiry_time={date_expiry}
                        getCardLabels={getCardLabels}
                        is_loading={false}
                        server_time={server_time}
                        start_time={purchase_time}
                        ticks_count={tick_count}
                    />
                )}
            </DesktopWrapper>
        </>
    );
};

ContractCardHeader.propTypes = {
    contract_info: PropTypes.object,
    display_name: PropTypes.string,
    getCardLabels: PropTypes.func,
    getContractTypeDisplay: PropTypes.func,
    has_progress_slider: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    is_sold: PropTypes.bool,
    is_valid_to_sell: PropTypes.bool,
    onClickSell: PropTypes.func,
    server_time: PropTypes.object,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ContractCardHeader;
