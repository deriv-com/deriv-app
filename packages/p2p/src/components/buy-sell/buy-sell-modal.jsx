import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Button,
    DesktopWrapper,
    HintBox,
    Icon,
    MobileFullPageModal,
    MobileWrapper,
    Modal,
    Text,
    ThemedScrollbars,
    useSafeState,
} from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { buy_sell } from 'Constants/buy-sell';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import BuySellForm from './buy-sell-form.jsx';
import BuySellFormReceiveAmount from './buy-sell-form-receive-amount.jsx';
import NicknameForm from '../nickname-form';
import AddPaymentMethodForm from '../my-profile/payment-methods/add-payment-method/add-payment-method-form.jsx';
import { api_error_codes } from 'Constants/api-error-codes';
import 'Components/buy-sell/buy-sell-modal.scss';

const LowBalanceMessage = () => (
    <div className='buy-sell__modal--error-message'>
        <HintBox
            className='buy-sell__modal-danger'
            icon='IcAlertDanger'
            message={
                <Text as='p' size='xxxs' color='prominent' line_height='s'>
                    <Localize i18n_default_text="Your Deriv P2P balance isn't enough. Please increase your balance before trying again." />
                </Text>
            }
            is_danger
        />
    </div>
);

const BuySellModalFooter = ({ onCancel, is_submit_disabled, onSubmit }) => {
    const { my_profile_store } = useStores();
    return (
        <div
            className={
                my_profile_store.should_show_add_payment_method_form
                    ? 'add-payment-method__footer'
                    : 'buy-sell__modal-footer'
            }
        >
            <Button.Group>
                <Button secondary onClick={onCancel} large>
                    {localize('Cancel')}
                </Button>
                <Button is_disabled={is_submit_disabled} primary large onClick={onSubmit}>
                    {localize('Confirm')}
                </Button>
            </Button.Group>
        </div>
    );
};

BuySellModalFooter.propTypes = {
    onCancel: PropTypes.func.isRequired,
    is_submit_disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
};

const generateModalTitle = (formik_ref, my_profile_store, table_type, selected_ad) => {
    if (my_profile_store.should_show_add_payment_method_form) {
        if (isDesktop()) {
            return (
                <React.Fragment>
                    <Icon
                        icon='IcArrowLeftBold'
                        onClick={() => {
                            if (formik_ref.current.dirty) {
                                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                            } else {
                                my_profile_store.setShouldShowAddPaymentMethodForm(false);
                            }
                        }}
                        className='buy-sell__modal-icon'
                    />
                    {localize('Add payment method')}
                </React.Fragment>
            );
        }
        return localize('Add payment method');
    }
    if (table_type === buy_sell.BUY) {
        return localize('Buy {{ currency }}', { currency: selected_ad.account_currency });
    }
    return localize('Sell {{ currency }}', { currency: selected_ad.account_currency });
};

const MarketRateChangeErrorModal = ({ is_open, closeModal, setShouldShowPopup }) => (
    <Modal className='rate-changed-modal' is_open={is_open} onExited={() => setShouldShowPopup(true)} small>
        <Modal.Body>
            <Text as='p' className='rate-changed-modal__message' size={isMobile() ? 'xxs' : 'xs'} line_height='s'>
                <Localize i18n_default_text={'The advertiser changed the rate before you confirmed the order.'} />
            </Text>
        </Modal.Body>
        <Modal.Footer className='rate-changed-modal__button'>
            <Button onClick={closeModal} text={localize('Try again')} primary large />
        </Modal.Footer>
    </Modal>
);

const BuySellModal = ({ table_type, selected_ad, should_show_popup, setShouldShowPopup }) => {
    const { buy_sell_store, floating_rate_store, general_store, my_profile_store, order_store } = useStores();
    const submitForm = React.useRef(() => {});
    const [error_message, setErrorMessage] = useSafeState(null);
    const [is_submit_disabled, setIsSubmitDisabled] = useSafeState(true);
    const [is_account_balance_low, setIsAccountBalanceLow] = React.useState(false);
    const [show_market_rate_change_error_modal, setShowMarketRateChangeErrorModal] = React.useState(false);
    const [has_rate_changed_recently, setHasRateChangedRecently] = React.useState(false);
    const formik_ref = React.useRef();
    const MAX_ALLOWED_RATE_CHANGED_WARNING_DELAY = 2000;

    React.useEffect(() => {
        const disposeHasRateChangedReaction = reaction(
            () => buy_sell_store.advert,
            (new_advert, previous_advert) => {
                // check to see if the rate is initialized in the store for the first time (when unitialized it is undefined) AND
                const rate_has_changed = previous_advert?.rate && previous_advert.rate !== new_advert.rate;
                // check to see if user is not switching between different adverts, it should not trigger rate change modal
                const is_the_same_advert = previous_advert?.id === new_advert.id;
                if (rate_has_changed && is_the_same_advert) {
                    setHasRateChangedRecently(true);
                    setTimeout(() => {
                        setHasRateChangedRecently(false);
                    }, MAX_ALLOWED_RATE_CHANGED_WARNING_DELAY);
                }
            }
        );

        const disposeFormErrorCodeReaction = reaction(
            () => buy_sell_store.form_error_code,
            () => {
                if (buy_sell_store.form_error_code === api_error_codes.ORDER_CREATE_FAIL_RATE_CHANGED) {
                    if (isDesktop()) {
                        buy_sell_store.hidePopup();
                        setTimeout(() => setShowMarketRateChangeErrorModal(true), 280);
                    } else {
                        setShowMarketRateChangeErrorModal(true);
                    }
                    buy_sell_store.setFormErrorCode('');
                    setErrorMessage(null);
                }
            }
        );

        return () => {
            disposeHasRateChangedReaction();
            disposeFormErrorCodeReaction();
        };
    }, []);

    const onSubmitWhenRateChanged = () => {
        if (isDesktop()) {
            setShouldShowPopup(false);
            setTimeout(() => setShowMarketRateChangeErrorModal(true), my_profile_store.MODAL_TRANSITION_DURATION);
        } else {
            setShowMarketRateChangeErrorModal(true);
        }
    };

    const BuySellFormError = () => {
        if (!!error_message && buy_sell_store.form_error_code !== api_error_codes.ORDER_CREATE_FAIL_RATE_CHANGED) {
            return (
                <div className='buy-sell__modal--error-message'>
                    <HintBox
                        className='buy-sell__modal-danger'
                        icon='IcAlertDanger'
                        message={
                            <Text as='p' size='xxxs' color='prominent' line_height='s'>
                                {buy_sell_store.form_error_code === api_error_codes.ORDER_CREATE_FAIL_CLIENT_BALANCE ? (
                                    <Localize i18n_default_text="Your Deriv P2P balance isn't enough. Please increase your balance before trying again." />
                                ) : (
                                    error_message
                                )}
                            </Text>
                        }
                        is_danger
                    />
                </div>
            );
        }
        return null;
    };

    const onCancel = () => {
        if (my_profile_store.should_show_add_payment_method_form) {
            if (formik_ref.current.dirty) {
                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
            } else {
                my_profile_store.hideAddPaymentMethodForm();
            }
        } else {
            setShouldShowPopup(false);
        }
        floating_rate_store.setIsMarketRateChanged(false);
        buy_sell_store.setShowRateChangePopup(false);
    };

    const onConfirmClick = order_info => {
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
        order_store.setOrderId(order_info.id);
        setShouldShowPopup(false);
        buy_sell_store.setShowAdvertiserPage(false);
    };

    const setSubmitForm = submitFormFn => (submitForm.current = submitFormFn);

    const has_rate_changed =
        (!!error_message && buy_sell_store.form_error_code === api_error_codes.ORDER_CREATE_FAIL_RATE_CHANGED) ||
        has_rate_changed_recently;
    const onSubmit = has_rate_changed ? onSubmitWhenRateChanged : submitForm.current;

    React.useEffect(() => {
        const balance_check =
            parseFloat(general_store.balance) === 0 ||
            parseFloat(general_store.balance) < buy_sell_store.advert?.min_order_amount_limit;

        setIsAccountBalanceLow(balance_check);
        if (!should_show_popup) {
            setErrorMessage(null);
        }

        my_profile_store.setSelectedPaymentMethod('');
        my_profile_store.setSelectedPaymentMethodDisplayName('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show_popup]);

    const Form = general_store.nickname ? BuySellForm : NicknameForm;

    return (
        <React.Fragment>
            <MarketRateChangeErrorModal
                is_open={show_market_rate_change_error_modal}
                closeModal={() => setShowMarketRateChangeErrorModal(false)}
                setShouldShowPopup={setShouldShowPopup}
            />
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='buy-sell__modal-body'
                    className='buy-sell__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={should_show_popup}
                    page_header_className='buy-sell__modal-header'
                    page_header_text={generateModalTitle(formik_ref, my_profile_store, table_type, selected_ad)}
                    pageHeaderReturnFn={onCancel}
                >
                    {table_type === buy_sell.SELL && is_account_balance_low && <LowBalanceMessage />}
                    {!!error_message && <BuySellFormError />}
                    {my_profile_store.should_show_add_payment_method_form ? (
                        <AddPaymentMethodForm formik_ref={formik_ref} should_show_separated_footer={true} />
                    ) : (
                        <React.Fragment>
                            <Form
                                advert={selected_ad}
                                handleClose={onCancel}
                                handleConfirm={onConfirmClick}
                                setIsSubmitDisabled={setIsSubmitDisabled}
                                setErrorMessage={setErrorMessage}
                                setSubmitForm={setSubmitForm}
                            />
                            <BuySellFormReceiveAmount
                                is_sell_advert={buy_sell_store.is_sell_advert}
                                local_currency={buy_sell_store?.advert && buy_sell_store.advert.local_currency}
                                receive_amount={buy_sell_store.receive_amount}
                            />
                            <BuySellModalFooter
                                is_submit_disabled={is_submit_disabled}
                                onCancel={onCancel}
                                onSubmit={submitForm.current}
                            />
                        </React.Fragment>
                    )}
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    className={classNames('buy-sell__modal', {
                        'buy-sell__modal-form': my_profile_store.should_show_add_payment_method_form,
                    })}
                    height={table_type === buy_sell.BUY ? 'auto' : '649px'}
                    width='456px'
                    is_open={should_show_popup}
                    title={generateModalTitle(formik_ref, my_profile_store, table_type, selected_ad)}
                    portalId={general_store.props.modal_root_id}
                    toggleModal={onCancel}
                >
                    {/* Parent height - Modal.Header height - Modal.Footer height */}
                    <ThemedScrollbars height={table_type === buy_sell.BUY ? '100%' : 'calc(100% - 5.8rem - 7.4rem)'}>
                        <Modal.Body className='buy-sell__modal--layout'>
                            {table_type === buy_sell.SELL && is_account_balance_low && <LowBalanceMessage />}
                            <BuySellFormError />
                            {my_profile_store.should_show_add_payment_method_form ? (
                                <AddPaymentMethodForm formik_ref={formik_ref} should_show_separated_footer />
                            ) : (
                                <Form
                                    advert={selected_ad}
                                    handleClose={onCancel}
                                    handleConfirm={onConfirmClick}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    setErrorMessage={setErrorMessage}
                                    setSubmitForm={setSubmitForm}
                                />
                            )}
                        </Modal.Body>
                    </ThemedScrollbars>
                    {!my_profile_store.should_show_add_payment_method_form && (
                        <Modal.Footer has_separator>
                            {my_profile_store.should_show_add_payment_method_form ? null : (
                                <BuySellModalFooter
                                    is_submit_disabled={is_submit_disabled}
                                    onCancel={onCancel}
                                    onSubmit={onSubmit}
                                />
                            )}
                        </Modal.Footer>
                    )}
                </Modal>
            </DesktopWrapper>
        </React.Fragment>
    );
};

BuySellModal.propTypes = {
    table_type: PropTypes.string,
    selected_ad: PropTypes.object,
    should_show_popup: PropTypes.bool,
    setShouldShowPopup: PropTypes.func,
};

export default observer(BuySellModal);
