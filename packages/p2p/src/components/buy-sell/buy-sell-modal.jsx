import PropTypes from 'prop-types';
import React from 'react';
import { Button, MobileFullPageModal, Modal, ThemedScrollbars, useSafeState } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import FormError from 'Components/form/error.jsx';
import { useStores } from 'Stores';
import BuySellForm from './buy-sell-form.jsx';
import NicknameForm from '../nickname-form';
import 'Components/buy-sell/buy-sell-modal.scss';

const BuySellModalFooter = ({ onCancel, error_message, is_submit_disabled, onSubmit }) => {
    return (
        <React.Fragment>
            {error_message && <FormError message={error_message} />}
            <Button.Group>
                <Button secondary type='button' onClick={onCancel} large>
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
    error_message: PropTypes.string,
    is_submit_disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
};

const BuySellModal = ({ table_type, selected_ad, should_show_popup, setShouldShowPopup }) => {
    const { general_store, order_store } = useStores();
    const submitForm = React.useRef(() => {});
    const [error_message, setErrorMessage] = useSafeState(null);
    const [is_submit_disabled, setIsSubmitDisabled] = useSafeState(true);
    const [page_footer_parent, setPageFooterParent] = useSafeState(null);

    const onCancel = () => setShouldShowPopup(false);

    const onConfirmClick = order_info => {
        order_store.setOrderId(order_info.id);
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
        setShouldShowPopup(false);
    };

    const setSubmitForm = submitFormFn => (submitForm.current = submitFormFn);

    React.useEffect(() => {
        if (!should_show_popup) {
            setErrorMessage(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show_popup]);

    const Form = general_store.nickname ? BuySellForm : NicknameForm;
    const modal_title =
        table_type === buy_sell.BUY
            ? localize('Buy {{ currency }}', { currency: selected_ad.account_currency })
            : localize('Sell {{ currency }}', { currency: selected_ad.account_currency });

    if (isMobile()) {
        return (
            <MobileFullPageModal
                body_className='buy-sell__modal-body'
                className='buy-sell__modal'
                height_offset='80px'
                is_flex
                is_modal_open={should_show_popup}
                page_header_className='buy-sell__modal-header'
                page_header_text={modal_title}
                pageHeaderReturnFn={onCancel}
                page_footer_parent={page_footer_parent}
                renderPageFooterChildren={() => (
                    <BuySellModalFooter
                        error_message={error_message}
                        is_submit_disabled={is_submit_disabled}
                        onCancel={onCancel}
                        onSubmit={submitForm.current}
                    />
                )}
                page_footer_className='buy-sell__modal-footer'
            >
                <Form
                    advert={selected_ad}
                    handleClose={onCancel}
                    handleConfirm={onConfirmClick}
                    setIsSubmitDisabled={setIsSubmitDisabled}
                    setErrorMessage={setErrorMessage}
                    setSubmitForm={setSubmitForm}
                    setPageFooterParent={setPageFooterParent}
                />
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className='buy-sell__modal'
            height={table_type === buy_sell.BUY ? '400px' : '649px'}
            width='456px'
            is_open={should_show_popup}
            title={modal_title}
            portalId={general_store.props.modal_root_id}
            toggleModal={onCancel}
        >
            {/* Parent height - Modal.Header height - Modal.Footer height */}
            <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                <Modal.Body>
                    <Form
                        advert={selected_ad}
                        handleClose={onCancel}
                        handleConfirm={onConfirmClick}
                        setIsSubmitDisabled={setIsSubmitDisabled}
                        setErrorMessage={setErrorMessage}
                        setSubmitForm={setSubmitForm}
                    />
                </Modal.Body>
            </ThemedScrollbars>
            <Modal.Footer has_separator>
                <BuySellModalFooter
                    error_message={error_message}
                    is_submit_disabled={is_submit_disabled}
                    onCancel={onCancel}
                    onSubmit={submitForm.current}
                />
            </Modal.Footer>
        </Modal>
    );
};

BuySellModal.propTypes = {
    table_type: PropTypes.string,
    selected_ad: PropTypes.object,
    should_show_popup: PropTypes.bool,
    setShouldShowPopup: PropTypes.func,
};

export default observer(BuySellModal);
