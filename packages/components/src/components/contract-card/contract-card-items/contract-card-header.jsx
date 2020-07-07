import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isHighLow, getCurrentTick } from '@deriv/shared';
import ContractTypeCell from './contract-type-cell.jsx';
import Icon from '../../icon';
import ProgressSlider from '../progress-slider';
import DesktopWrapper from '../../desktop-wrapper';

const ContractCardHeader = ({ contract_info, has_progress_slider, getContractTypeDisplay }) => {
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
            <div className={classNames('contract-card__grid', 'contract-card__grid-underlying-trade')}>
                <div id='contract_card_underlying_label' className='contract-card__underlying-name'>
                    <Icon icon={underlying ? `IcUnderlying${underlying}` : 'IcUnknown'} width={40} size={32} />
                    <span className='contract-card__symbol'>{display_name}</span>
                </div>
                <div id='contract_card_type_label' className='contract-card__type'>
                    <ContractTypeCell
                        multiplier={multiplier}
                        type={contract_type}
                        is_high_low={isHighLow({ shortcode })}
                        getContractTypeDisplay={getContractTypeDisplay}
                    />
                </div>
            </div>
            <DesktopWrapper>
                {(!has_progress_slider || !!is_sold) && <div className='progress-slider--completed' />}
                {has_progress_slider && !is_sold && (
                    <ProgressSlider
                        is_loading={false}
                        start_time={purchase_time}
                        expiry_time={date_expiry}
                        current_tick={current_tick}
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
