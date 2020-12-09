import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { DesktopWrapper, MobileWrapper, Popover } from '@deriv/components';
// import { localize }   from '@deriv/translations';
// import { PopConfirm } from 'App/Components/Elements/PopConfirm';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import ContractInfo from 'Modules/Trading/Components/Form/Purchase/contract-info.jsx';
// import PurchaseLock   from 'Modules/Trading/Components/Form/Purchase/PurchaseLock';
import PurchaseButton from 'Modules/Trading/Components/Elements/purchase-button.jsx';
import CancelDealInfo from '../Form/Purchase/cancel-deal-info.jsx';

class PurchaseFieldset extends React.PureComponent {
    state = { should_fade: false };

    componentDidMount() {
        this.setState({ should_fade: true });
    }

    render() {
        const {
            basis,
            buy_info,
            currency,
            has_cancellation,
            // index,
            info,
            index,
            is_disabled,
            is_high_low,
            is_loading,
            is_market_close,
            is_multiplier,
            is_proposal_empty,
            is_proposal_error,
            purchased_states_arr,
            // is_purchase_confirm_on,
            // is_purchase_locked,
            onClickPurchase,
            onHoverPurchase,
            // togglePurchaseLock,
            setPurchaseState,
            type,
        } = this.props;

        const purchase_button = (
            <React.Fragment>
                <PurchaseButton
                    buy_info={buy_info}
                    currency={currency}
                    info={info}
                    index={index}
                    has_deal_cancellation={is_multiplier && has_cancellation}
                    is_disabled={is_disabled}
                    is_high_low={is_high_low}
                    is_loading={is_loading}
                    is_multiplier={is_multiplier}
                    is_proposal_empty={is_proposal_empty}
                    purchased_states_arr={purchased_states_arr}
                    onClickPurchase={onClickPurchase}
                    setPurchaseState={setPurchaseState}
                    should_fade={this.state.should_fade}
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
                {/* {(is_purchase_locked && index === 0) && */}
                {/* <PurchaseLock onClick={togglePurchaseLock} /> */}
                {/* } */}
                <DesktopWrapper>
                    <div
                        className={classNames('trade-container__fieldset-wrapper', {
                            'trade-container__fieldset-wrapper--disabled': is_proposal_error || is_disabled,
                        })}
                    >
                        <ContractInfo
                            basis={basis}
                            currency={currency}
                            proposal_info={info}
                            has_cancellation={has_cancellation}
                            has_increased={info.has_increased}
                            is_loading={is_loading}
                            is_multiplier={is_multiplier}
                            should_fade={this.state.should_fade}
                            type={type}
                        />
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
                            {is_proposal_error && !is_market_close ? (
                                <Popover
                                    has_error
                                    alignment='left'
                                    message={info.message}
                                    is_open={is_proposal_error && !is_market_close}
                                    relative_render
                                    margin={6}
                                >
                                    {purchase_button}
                                </Popover>
                            ) : (
                                purchase_button
                            )}
                            {
                                // is_purchase_confirm_on ?
                                //     <PopConfirm
                                //         alignment='left'
                                //         cancel_text={localize('Cancel')}
                                //         confirm_text={localize('Purchase')}
                                //         message={localize('Are you sure you want to purchase this contract?')}
                                //     >
                                //         {purchase_button}
                                //     </PopConfirm>
                                //     :
                                //     purchase_button
                            }
                        </div>
                    </div>
                </DesktopWrapper>
                <MobileWrapper>
                    {is_proposal_error && <div className='btn-purchase__error'>{info.message}</div>}
                    {purchase_button}
                </MobileWrapper>
            </Fieldset>
        );
    }
}

PurchaseFieldset.propTypes = {
    basis: PropTypes.string,
    buy_info: PropTypes.object,
    currency: PropTypes.string,
    has_cancellation: PropTypes.bool,
    index: PropTypes.number,
    info: PropTypes.object,
    is_disabled: PropTypes.bool,
    is_high_low: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_market_close: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_proposal_empty: PropTypes.bool,
    is_proposal_error: PropTypes.bool,
    onClickPurchase: PropTypes.func,
    // is_purchase_confirm_on: PropTypes.bool,
    // is_purchase_locked    : PropTypes.bool,
    onHoverPurchase: PropTypes.func,
    purchased_states_arr: PropTypes.array,
    // togglePurchaseLock    : PropTypes.func,
    setPurchaseState: PropTypes.func,
    type: PropTypes.string,
};

export default PurchaseFieldset;
