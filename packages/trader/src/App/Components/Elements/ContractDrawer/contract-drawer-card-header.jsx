import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper } from '@deriv/components';
import ContractCardHeader from 'App/Components/Elements/ContractCard/contract-card-header.jsx';
import ContractTypeCell from 'App/Components/Elements/PositionsDrawer/contract-type-cell.jsx';
import ProgressSlider from 'App/Components/Elements/PositionsDrawer/ProgressSlider';
import Shortcode from 'Modules/Reports/Helpers/shortcode';
import { getCurrentTick } from 'Stores/Modules/Portfolio/Helpers/details';

const CardHeader = ({ contract_info, has_progress_slider }) => {
    const {
        contract_type,
        date_expiry,
        display_name,
        is_sold,
        purchase_time,
        shortcode,
        tick_count,
        underlying,
    } = contract_info;

    const current_tick = tick_count ? getCurrentTick(contract_info) : null;

    return (
        <ContractCardHeader>
            <div className={classNames('contract-card__grid', 'contract-card__grid-underlying-trade')}>
                <div id='dt_underlying_label' className='contract-card__underlying-name'>
                    <Icon icon={underlying ? `IcUnderlying${underlying}` : 'IcUnknown'} width={40} size={32} />
                    <span className='contract-card__symbol'>{display_name}</span>
                </div>
                <div id='dt_contract_type_label' className='contract-card__type'>
                    <ContractTypeCell type={contract_type} is_high_low={Shortcode.isHighLow({ shortcode })} />
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
        </ContractCardHeader>
    );
};

CardHeader.propTypes = {
    contract_info: PropTypes.object,
    has_progress_slider: PropTypes.bool,
};

export default CardHeader;
