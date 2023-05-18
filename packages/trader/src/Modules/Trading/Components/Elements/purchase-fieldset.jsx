import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { DesktopWrapper, MobileWrapper, Popover } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import ContractInfo from 'Modules/Trading/Components/Form/Purchase/contract-info.jsx';
import PurchaseButton from 'Modules/Trading/Components/Elements/purchase-button.jsx';
import CancelDealInfo from '../Form/Purchase/cancel-deal-info.jsx';

const PurchaseFieldset = ({
    basis,
    buy_info,
    currency,
    growth_rate,
    has_cancellation,
    info,
    index,
    is_accumulator,
    is_disabled,
    is_high_low,
    is_loading,
    is_market_closed,
    is_multiplier,
    is_vanilla,
    is_proposal_empty,
    is_proposal_error,
    purchased_states_arr,
    onClickPurchase,
    onHoverPurchase,
    setPurchaseState,
    type,
}) => {
    const [should_fade, setShouldFade] = React.useState(false);

    React.useEffect(() => {
        setShouldFade(true);
    }, []);

    const purchase_button = (
        <React.Fragment>
            <PurchaseButton
                buy_info={buy_info}
                currency={currency}
                info={info}
                index={index}
                growth_rate={growth_rate}
                has_deal_cancellation={is_multiplier && has_cancellation}
                is_accumulator={is_accumulator}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={is_loading}
                is_multiplier={is_multiplier}
                is_vanilla={is_vanilla}
                is_proposal_empty={is_proposal_empty}
                purchased_states_arr={purchased_states_arr}
                onClickPurchase={onClickPurchase}
                setPurchaseState={setPurchaseState}
                should_fade={should_fade}
                type={type}
                basis={basis} // mobile-only
            />
            {is_multiplier && has_cancellation && (
                <MobileWrapper>
                    <CancelDealInfo proposal_info={info} />
                </MobileWrapper>
            )}
        </React.Fragment>
    );

    return (
        <Fieldset
            className={classNames('trade-container__fieldset', 'purchase-container__option', {
                'purchase-container__option--has-cancellation': has_cancellation,
            })}
        >
            <DesktopWrapper>
                <div
                    className={classNames('trade-container__fieldset-wrapper', {
                        'trade-container__fieldset-wrapper--disabled': is_proposal_error || is_disabled,
                    })}
                >
                    {(has_cancellation || !is_multiplier) && !is_accumulator && (
                        <ContractInfo
                            basis={basis}
                            currency={currency}
                            proposal_info={info}
                            has_increased={info.has_increased}
                            is_loading={is_loading}
                            is_multiplier={is_multiplier}
                            is_vanilla={is_vanilla}
                            should_fade={should_fade}
                            type={type}
                        />
                    )}
                    <div
                        className={classNames('btn-purchase__shadow-wrapper', {
                            'btn-purchase__shadow-wrapper--disabled': is_proposal_error || is_disabled,
                        })}
                        onMouseEnter={() => {
                            if (!is_disabled) {
                                onHoverPurchase(true, type);
                            }
                        }}
                        onMouseLeave={() => {
                            if (!is_disabled) {
                                onHoverPurchase(false);
                            }
                        }}
                    >
                        <div className='btn-purchase__box-shadow' />
                        {is_proposal_error && !is_market_closed ? (
                            <Popover
                                has_error
                                alignment='left'
                                message={info.message}
                                is_open={is_proposal_error && !is_market_closed}
                                relative_render
                                margin={6}
                            >
                                {purchase_button}
                            </Popover>
                        ) : (
                            <React.Fragment>
                                {is_multiplier ? (
                                    <Popover
                                        alignment='left'
                                        is_bubble_hover_enabled
                                        margin={8}
                                        message={info.message}
                                        relative_render
                                    >
                                        {purchase_button}
                                    </Popover>
                                ) : (
                                    purchase_button
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                {is_proposal_error && <div className='btn-purchase__error'>{info.message}</div>}
                {purchase_button}
            </MobileWrapper>
        </Fieldset>
    );
};

PurchaseFieldset.propTypes = {
    basis: PropTypes.string,
    buy_info: PropTypes.object,
    currency: PropTypes.string,
    growth_rate: PropTypes.number,
    has_cancellation: PropTypes.bool,
    index: PropTypes.number,
    info: PropTypes.object,
    is_accumulator: PropTypes.bool,
    is_disabled: PropTypes.bool,
    is_high_low: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_market_closed: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_proposal_empty: PropTypes.bool,
    is_proposal_error: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    onClickPurchase: PropTypes.func,
    onHoverPurchase: PropTypes.func,
    purchased_states_arr: PropTypes.array,
    setPurchaseState: PropTypes.func,
    type: PropTypes.string,
};

export default React.memo(PurchaseFieldset);
