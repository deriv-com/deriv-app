import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Money, IconTradeTypes, Text } from '@deriv/components';
import { getContractTypeDisplay } from 'Constants/contract';
import ContractInfo from 'Modules/Trading/Components/Form/Purchase/contract-info.jsx';
import { getGrowthRatePercentage } from '@deriv/shared';

// TODO [lazy-loading-required] Responsive related components
const ButtonTextWrapper = ({ should_fade, is_loading, type, is_high_low }) => {
    return (
        <div className='btn-purchase__text_wrapper'>
            <Text size='xs' weight='bold' color='colored-background'>
                {!should_fade && is_loading ? '' : getContractTypeDisplay(type, is_high_low, true)}
            </Text>
        </div>
    );
};

const IconComponentWrapper = ({ type }) => (
    <div className='btn-purchase__icon_wrapper'>
        <IconTradeTypes type={type} className='btn-purchase__icon' color='active' />
    </div>
);

const PurchaseButton = ({
    buy_info,
    basis, // mobile-only
    currency,
    has_deal_cancellation,
    index,
    info,
    is_accumulator,
    is_disabled,
    is_high_low,
    is_loading,
    is_multiplier,
    is_vanilla,
    is_proposal_empty,
    purchased_states_arr,
    setPurchaseState,
    should_fade,
    onClickPurchase,
    type,
}) => {
    const getIconType = () => {
        if (!should_fade && is_loading) return '';
        return is_high_low ? `${type.toLowerCase()}_barrier` : type.toLowerCase();
    };
    const { has_increased } = info;
    const is_button_disabled = (is_disabled && !is_loading) || is_proposal_empty;
    const non_multiplier_info_right = is_accumulator ? `${getGrowthRatePercentage(info.growth_rate)}%` : info.returns;

    let button_value;

    if (is_multiplier) {
        button_value = (
            <Text size='xs' weight='bold' color='colored-background'>
                <Money amount={info.stake} currency={currency} show_currency />
            </Text>
        );
    } else if (!is_vanilla) {
        button_value = (
            <Text size='xs' weight='bold' color='colored-background'>
                {!(is_loading || is_disabled) ? non_multiplier_info_right : ''}
            </Text>
        );
    }

    return (
        <button
            disabled={is_disabled}
            id={`dt_purchase_${type.toLowerCase()}_button`}
            className={classNames('btn-purchase', {
                'btn-purchase--disabled': is_button_disabled || !!buy_info.error,
                'btn-purchase--animated--slide': is_loading && !should_fade,
                'btn-purchase--animated--fade': is_loading && should_fade,
                'btn-purchase--swoosh': !!purchased_states_arr[index],
                'btn-purchase--1': index === 0,
                'btn-purchase--2': index === 1,
                'btn-purchase--accumulator': is_accumulator,
                'btn-purchase--multiplier': is_multiplier,
                'btn-purchase--multiplier-deal-cancel': has_deal_cancellation,
                'btn-purchase--1__vanilla-opts': index === 0 && is_vanilla,
                'btn-purchase--2__vanilla-opts': index === 1 && is_vanilla,
            })}
            onClick={() => {
                setPurchaseState(index);
                onClickPurchase(info.id, info.stake, type);
            }}
        >
            <DesktopWrapper>
                <div className='btn-purchase__info btn-purchase__info--left'>
                    <div className='btn-purchase__type-wrapper'>
                        <IconComponentWrapper type={getIconType()} />
                        <ButtonTextWrapper
                            should_fade={should_fade}
                            is_loading={is_loading}
                            type={type}
                            is_high_low={is_high_low}
                        />
                    </div>
                </div>
                <div className='btn-purchase__effect-detail' />
                <div className='btn-purchase__effect-detail--arrow' />
                <div className='btn-purchase__info btn-purchase__info--right'>
                    <div className='btn-purchase__text_wrapper'>{button_value}</div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div
                    className={classNames('btn-purchase__top', {
                        'btn-purchase__top--accumulator': is_accumulator,
                        'btn-purchase--vanilla': is_vanilla,
                    })}
                >
                    <IconComponentWrapper type={getIconType()} />
                    <ButtonTextWrapper
                        should_fade={should_fade}
                        is_loading={is_loading}
                        type={type}
                        is_high_low={is_high_low}
                    />
                </div>
                {!is_vanilla && (
                    <div className='btn-purchase__bottom'>
                        <ContractInfo
                            basis={basis}
                            currency={currency}
                            has_increased={has_increased}
                            is_accumulator={is_accumulator}
                            is_loading={is_loading}
                            is_multiplier={is_multiplier}
                            should_fade={should_fade}
                            proposal_info={info}
                            type={type}
                        />
                    </div>
                )}
            </MobileWrapper>
        </button>
    );
};

PurchaseButton.propTypes = {
    basis: PropTypes.string,
    buy_info: PropTypes.object,
    currency: PropTypes.string,
    has_deal_cancellation: PropTypes.bool,
    index: PropTypes.number,
    info: PropTypes.object,
    is_accumulator: PropTypes.bool,
    is_disabled: PropTypes.bool,
    is_high_low: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_proposal_empty: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    onClickPurchase: PropTypes.func,
    purchased_states_arr: PropTypes.array,
    should_fade: PropTypes.bool,
    setPurchaseState: PropTypes.func,
    type: PropTypes.string,
};

export default PurchaseButton;
