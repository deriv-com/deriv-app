import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper, Money, MobileWrapper, Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { getLocalizedBasis } from 'Stores/Modules/Trading/Constants/contract';
import CancelDealInfo from './cancel-deal-info.jsx';

const ValueMovement = ({ has_error_or_not_loaded, proposal_info, currency, has_increased }) => (
    <React.Fragment>
        <div className='trade-container__price-info-value'>
            {!has_error_or_not_loaded && (
                <Money
                    amount={proposal_info.obj_contract_basis.value}
                    className='trade-container__price-info-currency'
                    currency={currency}
                    show_currency
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

    const { message, obj_contract_basis, stake } = proposal_info;

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
                {is_multiplier ? (
                    <React.Fragment>
                        <DesktopWrapper>
                            <CancelDealInfo proposal_info={proposal_info} />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div className='trade-container__price-info-wrapper'>
                                <div className='btn-purchase__text_wrapper'>
                                    <Text size='xs' weight='bold' color='colored-background'>
                                        <Money amount={stake} currency={currency} show_currency />
                                    </Text>
                                </div>
                            </div>
                        </MobileWrapper>
                    </React.Fragment>
                ) : (
                    !is_multiplier &&
                    obj_contract_basis && (
                        <React.Fragment>
                            <div className='trade-container__price-info-basis'>{basis_text}</div>
                            <DesktopWrapper>
                                <ValueMovement
                                    has_error_or_not_loaded={has_error_or_not_loaded}
                                    proposal_info={proposal_info}
                                    currency={getCurrencyDisplayCode(currency)}
                                    has_increased={has_increased}
                                />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='trade-container__price-info-wrapper'>
                                    <ValueMovement
                                        has_error_or_not_loaded={has_error_or_not_loaded}
                                        proposal_info={proposal_info}
                                        currency={getCurrencyDisplayCode(currency)}
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
                    relative_render
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
