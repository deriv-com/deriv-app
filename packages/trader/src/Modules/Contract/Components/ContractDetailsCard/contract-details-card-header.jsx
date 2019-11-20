import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { UnderlyingIcon }       from 'deriv-components';
import ContractTypeCell         from 'App/Components/Elements/PositionsDrawer/contract-type-cell.jsx';
import ProgressSlider           from 'App/Components/Elements/PositionsDrawer/ProgressSlider';
import Shortcode                from 'Modules/Reports/Helpers/shortcode';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';
import { getCurrentTick }       from 'Stores/Modules/Portfolio/Helpers/details';

const ContractDetailsCardHeader = ({
    contract_info,
}) => {
    const getTick = () => {
        if (!contract_info.tick_count) return null;
        let current_tick = getCurrentTick(contract_info);
        current_tick = (current_tick > getCurrentTick(contract_info)) ?
            current_tick : getCurrentTick(contract_info);
        return current_tick;
    };

    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    return (
        <React.Fragment>
            <div className={classNames(
                'contract-card__grid',
                'contract-card__grid-underlying-trade'
            )}
            >
                <div id='dt_underlying_label' className='contract-card__underlying-name'>
                    <UnderlyingIcon market={contract_info.underlying} />
                    <span className='contract-card__symbol'>
                        {contract_info.display_name}
                    </span>
                </div>
                <div id='dt_contract_type_label' className='contract-card__type'>
                    <ContractTypeCell
                        type={contract_info.contract_type}
                        is_high_low={Shortcode.isHighLow({ shortcode: contract_info.shortcode })}
                    />
                </div>
            </div>
            {!is_multiplier &&
                <React.Fragment>
                    {contract_info.is_sold ?
                        <div className='progress-slider--completed' />
                        :
                        <ProgressSlider
                            is_loading={false}
                            start_time={contract_info.purchase_time}
                            expiry_time={contract_info.date_expiry}
                            current_tick={getTick()}
                            ticks_count={contract_info.tick_count}
                        />
                    }
                </React.Fragment>
            }
        </React.Fragment>
    );
};

ContractDetailsCardHeader.propTypes = {
    contract_info: PropTypes.object,
};

export default ContractDetailsCardHeader;
