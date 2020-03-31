import classNames from 'classnames';
import { Icon, DesktopWrapper, Money, MobileWrapper, Popover } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { getLocalizedBasis } from 'Stores/Modules/Trading/Constants/contract';
import { localize } from '@deriv/translations';

const CancelDealInfo = ({ amount, currency, error }) => {
    return (
        <React.Fragment>
            <div className='trade-container__price-info-basis'>{localize('Deal cancel. fee')}</div>
            <div className='trade-container__price-info-value'>
                {!error && (
                    <Money amount={amount} className='trade-container__price-info-currency' currency={currency} />
                )}
            </div>
        </React.Fragment>
    );
};

const ValueMovement = ({ has_error_or_not_loaded, proposal_info, currency, has_increased }) => (
    <React.Fragment>
        <div className='trade-container__price-info-value'>
            {!has_error_or_not_loaded && (
                <Money
                    amount={proposal_info.obj_contract_basis.value}
                    className='trade-container__price-info-currency'
                    currency={currency}
                />
            )}
        </div>
        <div className='trade-container__price-info-movement'>
            {!has_error_or_not_loaded && has_increased !== null && has_increased ? (
                <Icon icon='IcProfit' />
            ) : (
                <Icon icon='IcLoss' />
            )}
        </div>
    </React.Fragment>
);

const ContractInfo = ({
    basis,
    currency,
    has_increased,
    has_cancellation,
    is_loading,
    is_multiplier,
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

    const basis_text = has_error_or_not_loaded
        ? stakeOrPayout()
        : localize('{{value}}', { value: proposal_info.obj_contract_basis.text });

    const { cancellation, message, obj_contract_basis } = proposal_info;

    return (
        <div className='trade-container__price'>
            <div
                id={`dt_purchase_${type.toLowerCase()}_price`}
                className={classNames('trade-container__price-info', {
                    'trade-container__price-info--disabled': has_error_or_not_loaded,
                    'trade-container__price-info--slide': is_loading && !should_fade,
                    'trade-container__price-info--fade': is_loading && should_fade,
                })}
            >
                {is_multiplier && has_cancellation && cancellation ? (
                    <CancelDealInfo
                        amount={cancellation.ask_price}
                        currency={currency}
                        error={has_error_or_not_loaded}
                    />
                ) : (
                    !is_multiplier &&
                    obj_contract_basis && (
                        <React.Fragment>
                            <div className='trade-container__price-info-basis'>{basis_text}</div>
                            <DesktopWrapper>
                                <ValueMovement
                                    has_error_or_not_loaded={has_error_or_not_loaded}
                                    proposal_info={proposal_info}
                                    currency={currency}
                                    has_increased={has_increased}
                                />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='trade-container__price-info-wrapper'>
                                    <ValueMovement
                                        has_error_or_not_loaded={has_error_or_not_loaded}
                                        proposal_info={proposal_info}
                                        currency={currency}
                                        has_increased={has_increased}
                                    />
                                </div>
                            </MobileWrapper>
                        </React.Fragment>
                    )
                )}
            </div>
            <DesktopWrapper>
                <Popover
                    alignment='left'
                    icon='info'
                    id={`dt_purchase_${type.toLowerCase()}_info`}
                    margin={210}
                    message={has_error_or_not_loaded ? '' : message}
                />
            </DesktopWrapper>
        </div>
    );
};

ContractInfo.propTypes = {
    basis: PropTypes.string,
    currency: PropTypes.string,
    has_increased: PropTypes.bool,
    has_cancellation: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_loading: PropTypes.bool,
    proposal_info: PropTypes.object,
    type: PropTypes.string,
};

export default ContractInfo;
