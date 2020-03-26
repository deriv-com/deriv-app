import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import ContractTypeCell from 'App/Components/Elements/PositionsDrawer/contract-type-cell.jsx';
import ProgressSlider from 'App/Components/Elements/PositionsDrawer/ProgressSlider';
import Shortcode from 'Modules/Reports/Helpers/shortcode';
import { getCurrentTick } from 'Stores/Modules/Portfolio/Helpers/details';

const CardHeader = ({ contract_info, has_progress_slider }) => {
    const current_tick = contract_info.tick_count ? getCurrentTick(contract_info) : null;

    return (
        <>
            <div className={classNames('positions-drawer-card__grid', 'positions-drawer-card__grid-underlying-trade')}>
                <div className='positions-drawer-card__underlying-name'>
                    <Icon
                        icon={contract_info.underlying ? `IcUnderlying${contract_info.underlying}` : 'IcUnknown'}
                        size={34}
                    />
                    <span className='positions-drawer-card__symbol'>{contract_info.display_name}</span>
                </div>
                <div className='positions-drawer-card__type'>
                    <ContractTypeCell
                        type={contract_info.contract_type}
                        is_high_low={Shortcode.isHighLow({ shortcode: contract_info.shortcode })}
                    />
                </div>
            </div>
            {(!has_progress_slider || !!contract_info.is_sold) && <div className='progress-slider--completed' />}
            {has_progress_slider && !contract_info.is_sold && (
                <ProgressSlider
                    is_loading={false}
                    start_time={contract_info.purchase_time}
                    expiry_time={contract_info.date_expiry}
                    current_tick={current_tick}
                    ticks_count={contract_info.tick_count}
                />
            )}
        </>
    );
};

CardHeader.propTypes = {
    contract_info: PropTypes.object,
    has_progress_slider: PropTypes.bool,
};

export default CardHeader;
