import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isHighLow, getCurrentTick, isBot } from '@deriv/shared';
import ContractTypeCell from './contract-type-cell.jsx';
import Button from '../../button';
import Icon from '../../icon';
import ProgressSlider from '../../progress-slider';
import DesktopWrapper from '../../desktop-wrapper';
import MobileWrapper from '../../mobile-wrapper';

const ContractCardHeader = ({
    contract_info,
    getCardLabels,
    has_progress_slider,
    id,
    is_mobile,
    is_positions,
    is_sell_requested,
    is_valid_to_sell,
    getContractTypeDisplay,
    onClickSell,
    server_time,
}) => {
    const current_tick = contract_info.tick_count ? getCurrentTick(contract_info) : null;
    const {
        underlying,
        display_name,
        multiplier,
        contract_type,
        shortcode,
        purchase_time,
        date_expiry,
        tick_count,
        is_sold,
    } = contract_info;

    return (
        <>
            <div
                className={classNames('contract-card__grid', 'contract-card__grid-underlying-trade', {
                    'contract-card__grid-underlying-trade--mobile': is_mobile && !multiplier,
                    'contract-card__grid-underlying-trade--trader': !isBot(),
                })}
            >
                <div id='contract_card_underlying_label' className='contract-card__underlying-name'>
                    <Icon icon={underlying ? `IcUnderlying${underlying}` : 'IcUnknown'} width={40} size={32} />
                    <span className='contract-card__symbol'>{display_name}</span>
                </div>
                <div id='contract_card_type_label' className='contract-card__type'>
                    <ContractTypeCell
                        getContractTypeDisplay={getContractTypeDisplay}
                        is_high_low={isHighLow({ shortcode })}
                        multiplier={multiplier}
                        type={contract_type}
                    />
                </div>
                <MobileWrapper>
                    {is_valid_to_sell ? (
                        <CSSTransition
                            in={!!is_valid_to_sell}
                            timeout={250}
                            classNames={{
                                enter: 'contract-card__sell-button--enter',
                                enterDone: 'contract-card__sell-button--enter-done',
                                exit: 'contract-card__sell-button--exit',
                            }}
                            unmountOnExit
                        >
                            <div className='contract-card__sell-button-mobile'>
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
            </div>
            <MobileWrapper>
                <div className='progress-slider--completed' />
            </MobileWrapper>
            <DesktopWrapper>
                {(!has_progress_slider || !!is_sold) && <div className='progress-slider--completed' />}
                {has_progress_slider && !is_sold && (
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
    has_progress_slider: PropTypes.bool,
    getContractTypeDisplay: PropTypes.func,
    is_positions: PropTypes.bool,
};

export default ContractCardHeader;
