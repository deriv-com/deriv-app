import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper, Money, MobileWrapper, Popover, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getContractSubtype, getCurrencyDisplayCode, getGrowthRatePercentage, getLocalizedBasis } from '@deriv/shared';
import CancelDealInfo from './cancel-deal-info.jsx';

const ValueMovement = ({ has_error_or_not_loaded, proposal_info, currency, has_increased, is_turbos, is_vanilla }) => (
    <div className='price-info--value-container'>
        <div className='trade-container__price-info-value'>
            {!has_error_or_not_loaded && (
                <Money
                    amount={proposal_info.obj_contract_basis.value}
                    className={classNames('trade-container__price-info-currency', {
                        'trade-container__price-info-currency--payout-per-point': is_vanilla || is_turbos,
                    })}
                    currency={currency}
                    show_currency
                    should_format={!is_turbos && !is_vanilla}
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
    </div>
);

const ContractInfo = ({
    basis,
    currency,
    has_increased,
    is_loading,
    is_accumulator,
    is_multiplier,
    is_turbos,
    is_vanilla,
    should_fade,
    proposal_info,
    type,
}) => {
    const localized_basis = getLocalizedBasis();
    const stakeOrPayout = () => {
        switch (basis) {
            case 'stake': {
                if (is_vanilla || is_turbos) {
                    return localized_basis.payout_per_point;
                }
                return localized_basis.payout;
            }
            case 'payout': {
                return localized_basis.stake;
            }
            default:
                return basis;
        }
    };

    const has_error_or_not_loaded = proposal_info.has_error || !proposal_info.id;
    const basis_text = has_error_or_not_loaded ? stakeOrPayout() : proposal_info.obj_contract_basis.text;
    const { message, obj_contract_basis, stake } = proposal_info;

    const setHintMessage = () => {
        if (is_turbos || is_vanilla) {
            return (
                <Localize
                    i18n_default_text='<0>For {{title}}:</0> {{message}}'
                    components={[<Text key={0} weight='bold' size='xxs' />]}
                    values={{
                        title: getContractSubtype(type),
                        message,
                    }}
                />
            );
        }

        return message;
    };

    return (
        <div
            className={classNames('trade-container__price', {
                'trade-container__price--turbos': is_turbos,
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
                {is_multiplier || is_accumulator ? (
                    <React.Fragment>
                        {!is_accumulator && (
                            <DesktopWrapper>
                                <CancelDealInfo proposal_info={proposal_info} />
                            </DesktopWrapper>
                        )}
                        <MobileWrapper>
                            <div className='trade-container__price-info-wrapper'>
                                <div className='btn-purchase__text_wrapper'>
                                    <Text size='xs' weight='bold' color='colored-background'>
                                        {!is_accumulator ? (
                                            <Money amount={stake} currency={currency} show_currency />
                                        ) : (
                                            !is_loading && `${getGrowthRatePercentage(proposal_info?.growth_rate)}%`
                                        )}
                                    </Text>
                                </div>
                            </div>
                        </MobileWrapper>
                    </React.Fragment>
                ) : (
                    !is_multiplier &&
                    !is_accumulator &&
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
                                    is_vanilla={is_vanilla}
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
                                        is_vanilla={is_vanilla}
                                    />
                                </div>
                            </MobileWrapper>
                        </React.Fragment>
                    )
                )}
            </div>
            {!is_multiplier && !is_accumulator && (
                <DesktopWrapper>
                    <Popover
                        alignment='left'
                        icon='info'
                        id={`dt_purchase_${type.toLowerCase()}_info`}
                        is_bubble_hover_enabled
                        margin={216}
                        message={has_error_or_not_loaded ? '' : setHintMessage()}
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
    is_accumulator: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_turbos: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    is_loading: PropTypes.bool,
    proposal_info: PropTypes.object,
    should_fade: PropTypes.bool,
    type: PropTypes.string,
};

export default ContractInfo;
