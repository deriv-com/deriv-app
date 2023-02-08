import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper, Money, MobileWrapper, Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getLocalizedBasis } from '@deriv/shared';
import CancelDealInfo from './cancel-deal-info.jsx';

const ValueMovement = ({ has_error_or_not_loaded, proposal_info, currency, has_increased, is_turbos }) => (
    <React.Fragment>
        <div className='trade-container__price-info-value'>
            {!has_error_or_not_loaded && (
                <Money
                    amount={proposal_info.obj_contract_basis.value}
                    className={classNames('trade-container__price-info-currency', {
                        'trade-container__price-info-currency--turbos': is_turbos,
                    })}
                    currency={currency}
                    show_currency
                />
            )}
        </div>
        {!is_turbos && (
            <div className='trade-container__price-info-movement'>
                {!has_error_or_not_loaded && has_increased !== null && has_increased ? (
                    <Icon icon='IcProfit' />
                ) : (
                    <Icon icon='IcLoss' />
                )}
            </div>
        )}
    </React.Fragment>
);

const ContractInfo = ({
    basis,
    currency,
    has_increased,
    is_loading,
    is_multiplier,
    is_turbos,
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
        : localize('{{value}}', {
              value: is_turbos ? localize('Payout per point') : proposal_info.obj_contract_basis.text,
          });

    const { message, obj_contract_basis, stake } = proposal_info;

    return (
        <div
            className={classNames('trade-container__price', {
                'trade-container__price-turbos': is_turbos,
            })}
        >
            <div
                id={`dt_purchase_${type.toLowerCase()}_price`}
                className={classNames('trade-container__price-info', {
                    'trade-container__price-info--disabled': has_error_or_not_loaded,
                    'trade-container__price-info--slide': is_loading && !should_fade,
                    'trade-container__price-info--fade': is_loading && should_fade,
                    'trade-container__price-info--turbos': is_turbos,
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
                                    is_turbos={is_turbos}
                                />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='trade-container__price-info-wrapper'>
                                    <ValueMovement
                                        has_error_or_not_loaded={has_error_or_not_loaded}
                                        proposal_info={proposal_info}
                                        currency={getCurrencyDisplayCode(currency)}
                                        has_increased={has_increased}
                                        is_turbos={is_turbos}
                                    />
                                </div>
                            </MobileWrapper>
                        </React.Fragment>
                    )
                )}
            </div>
            {!is_multiplier && (
                <DesktopWrapper>
                    <Popover
                        alignment='left'
                        icon='info'
                        id={`dt_purchase_${type.toLowerCase()}_info`}
                        is_bubble_hover_enabled
                        margin={216}
                        message={has_error_or_not_loaded ? '' : message}
                        relative_render
                    />
                </DesktopWrapper>
            )}
        </div>
    );
};

ContractInfo.propTypes = {
    basis: PropTypes.string,
    currency: PropTypes.string,
    has_increased: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_turbos: PropTypes.bool,
    is_loading: PropTypes.bool,
    proposal_info: PropTypes.object,
    should_fade: PropTypes.bool,
    type: PropTypes.string,
};

export default ContractInfo;
