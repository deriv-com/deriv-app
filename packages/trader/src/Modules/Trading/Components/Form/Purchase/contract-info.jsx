import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper, Money, MobileWrapper, Popover, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getLocalizedBasis } from '@deriv/shared';
import CancelDealInfo from './cancel-deal-info.jsx';

const ValueMovement = ({ has_error_or_not_loaded, proposal_info, currency, has_increased, is_vanilla }) => (
    <div style={{ display: 'flex' }}>
        <div className='trade-container__price-info-value'>
            {!has_error_or_not_loaded && (
                <span className='per-point--multiplier'>
                    {is_vanilla && <span>x</span>}
                    <Money
                        amount={proposal_info.obj_contract_basis.value}
                        className='trade-container__price-info-currency'
                        currency={currency}
                        show_currency
                    />
                </span>
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
    is_multiplier,
    is_vanilla,
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

    const setBasisText = () => {
        if (is_vanilla) {
            return 'Payout per 1%';
        }
        return proposal_info.obj_contract_basis.text;
    };

    const has_error_or_not_loaded = proposal_info.has_error || !proposal_info.id;

    const basis_text = has_error_or_not_loaded ? stakeOrPayout() : localize('{{value}}', { value: setBasisText() });

    const { message, obj_contract_basis, stake } = proposal_info;

    const setHintMessage = () => {
        if (type === 'VANILLALONGCALL') {
            return (
                <Localize
                    i18n_default_text='<0>For Call:</0> Earn payout when the market rises above your strike price at expiry. Your payout will grow by this amount for every point above your strike price.'
                    components={[<strong key={0} />]}
                />
            );
        } else if (type === 'VANILLALONGPUT') {
            return (
                <Localize
                    i18n_default_text='<0>For Put:</0> Earn payout when the market rises above your strike price at expiry. Your payout will grow by this amount for every point above your strike price.'
                    components={[<strong key={0} />]}
                />
            );
        }
        return message;
    };

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
                                        is_vanilla={is_vanilla}
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
    is_multiplier: PropTypes.bool,
    is_loading: PropTypes.bool,
    proposal_info: PropTypes.object,
    should_fade: PropTypes.bool,
    type: PropTypes.string,
};

export default ContractInfo;
