import classNames            from 'classnames';
import { Money, Popover }    from 'deriv-components';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { getLocalizedBasis } from 'Stores/Modules/Trading/Constants/contract';
import { localize }          from 'deriv-translations';
import Icon                  from 'Assets/icon.jsx';

const ContractInfo = ({
    basis,
    currency,
    has_increased,
    is_loading,
    should_fade,
    proposal_info,
    type,
}) => {
    const localized_basis = getLocalizedBasis();
    const stakeOrPayout = () => {
        switch (basis) {
            case 'stake':
                return localized_basis.payout;
            case 'payout':
                return localized_basis.stake;
            default:
                return basis;
        }
    };

    const has_error_or_not_loaded = proposal_info.has_error || !proposal_info.id;
    return (
        <div className='trade-container__price'>
            <div
                id={`dt_purchase_${type.toLowerCase()}_price`}
                className={classNames(
                    'trade-container__price-info',
                    {
                        'trade-container__price-info--disabled': has_error_or_not_loaded,
                        'trade-container__price-info--slide'   : is_loading && !should_fade,
                        'trade-container__price-info--fade'    : is_loading && should_fade,
                    })}
            >
                <div className='trade-container__price-info-basis'>
                    {has_error_or_not_loaded
                        ? stakeOrPayout()
                        : localize('{{value}}', { value: proposal_info.obj_contract_basis.text })
                    }
                </div>
                <div className='trade-container__price-info-value'>
                    {!has_error_or_not_loaded &&
                    <Money amount={proposal_info.obj_contract_basis.value} className='trade-container__price-info-currency' currency={currency} />
                    }
                </div>
                <div className='trade-container__price-info-movement'>
                    {(!has_error_or_not_loaded && has_increased !== null) &&
                        <Icon icon='IconPriceMove' type={has_increased ? 'profit' : 'loss'} />
                    }
                </div>
            </div>
            <Popover
                alignment='left'
                icon='info'
                id={`dt_purchase_${type.toLowerCase()}_info`}
                margin={210}
                message={has_error_or_not_loaded ? '' : proposal_info.message }
            />
        </div>
    );
};
ContractInfo.propTypes = {
    basis        : PropTypes.string,
    currency     : PropTypes.string,
    has_increased: PropTypes.bool,
    is_loading   : PropTypes.bool,
    proposal_info: PropTypes.object,
    type         : PropTypes.string,
};

export default ContractInfo;
