import PropTypes from 'prop-types';
import React from 'react';
import {
    Button,
    HintBox,
    Icon,
    MobileFullPageModal,
    Modal,
    Text,
    ThemedScrollbars,
    useSafeState,
} from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { buy_sell } from 'Constants/buy-sell';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import BuySellForm from './buy-sell-form.jsx';
import BuySellFormReceiveAmount from './buy-sell-form-receive-amount.jsx';
import NicknameForm from '../nickname-form';
import 'Components/buy-sell/buy-sell-modal.scss';
import AddPaymentMethodForm from '../my-profile/payment-methods/add-payment-method/add-payment-method-form.jsx';
import { api_error_codes } from 'Constants/api-error-codes';

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
    return (
        <React.Fragment>
            <Button.Group>
                <Button secondary onClick={onCancel} large>
                    {localize('Cancel')}
                </Button>
                <Button is_disabled={is_submit_disabled} primary large onClick={onSubmit}>
                    {localize('Confirm')}
                </Button>
            </Button.Group>
        </React.Fragment>
    );
};

BuySellModalFooter.propTypes = {
    onCancel: PropTypes.func.isRequired,
    is_submit_disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
};

const generateModalTitle = (formik_ref, my_profile_store, table_type, selected_ad) => {
    if (my_profile_store.should_show_add_payment_method_form) {
        if (!isMobile()) {
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

const BuySellModal = ({ table_type, selected_ad, should_show_popup, setShouldShowPopup }) => {
    const { buy_sell_store, floating_rate_store, general_store, my_profile_store, order_store } = useStores();
    const submitForm = React.useRef(() => {});
    const [error_message, setErrorMessage] = useSafeState(null);
    const [is_submit_disabled, setIsSubmitDisabled] = useSafeState(true);
    const [page_footer_parent, setPageFooterParent] = useSafeState(
        <BuySellFormReceiveAmount
            is_sell_advert={buy_sell_store.is_sell_advert}
            local_currency={buy_sell_store?.advert && buy_sell_store.advert.local_currency}
            receive_amount={buy_sell_store.receive_amount}
        />
    );
    const [is_account_balance_low, setIsAccountBalanceLow] = React.useState(false);
    const formik_ref = React.useRef();

    const BuySellFormError = () => (
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

    if (isMobile()) {
        return (
            <MobileFullPageModal
                body_className='buy-sell__modal-body'
                className='buy-sell__modal'
                height_offset='80px'
                is_flex
                is_modal_open={should_show_popup}
                page_header_className='buy-sell__modal-header'
                page_header_text={generateModalTitle(formik_ref, my_profile_store, table_type, selected_ad)}
                pageHeaderReturnFn={onCancel}
                page_footer_parent={my_profile_store.should_show_add_payment_method_form ? '' : page_footer_parent}
                renderPageFooterChildren={() =>
                    !my_profile_store.should_show_add_payment_method_form && (
                        <BuySellModalFooter
                            is_submit_disabled={is_submit_disabled}
                            onCancel={onCancel}
                            onSubmit={submitForm.current}
                        />
                    )
                }
                page_footer_className={
                    my_profile_store.should_show_add_payment_method_form
                        ? 'add-payment-method__footer'
                        : 'buy-sell__modal-footer'
                }
            >
                {table_type === buy_sell.SELL && is_account_balance_low && <LowBalanceMessage />}
                {!!error_message && <BuySellFormError />}
                {my_profile_store.should_show_add_payment_method_form ? (
                    <AddPaymentMethodForm formik_ref={formik_ref} should_show_separated_footer={true} />
                ) : (
                    <Form
                        advert={selected_ad}
                        handleClose={onCancel}
                        handleConfirm={onConfirmClick}
                        setIsSubmitDisabled={setIsSubmitDisabled}
                        setErrorMessage={setErrorMessage}
                        setSubmitForm={setSubmitForm}
                        setPageFooterParent={setPageFooterParent}
                    />
                )}
            </MobileFullPageModal>
        );
    }
    if (should_show_popup) {
        return (
            <Modal
                className='buy-sell__modal'
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
                        {!!error_message && <BuySellFormError />}
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
                                onSubmit={submitForm.current}
                            />
                        )}
                    </Modal.Footer>
                )}
            </Modal>
        );
    }

    return null;
};

BuySellModal.propTypes = {
    table_type: PropTypes.string,
    selected_ad: PropTypes.object,
    should_show_popup: PropTypes.bool,
    setShouldShowPopup: PropTypes.func,
};

export default observer(BuySellModal);
