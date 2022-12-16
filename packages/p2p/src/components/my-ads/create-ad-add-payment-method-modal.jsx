import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, MobileFullPageModal, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import { localize, Localize } from 'Components/i18next';
import AddPaymentMethod from '../my-profile/payment-methods/add-payment-method/add-payment-method.jsx';

const CreateAdAddPaymentMethodModal = () => {
    const { my_ads_store, my_profile_store } = useStores();
    const formik_ref = React.useRef();

    const onCancel = () => {
        if (my_profile_store.selected_payment_method.length > 0 || (formik_ref.current && formik_ref.current.dirty)) {
            my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
        } else {
            my_ads_store.setShouldShowAddPaymentMethodModal(false);
        }
    };

    if (my_profile_store.should_show_add_payment_method_error_modal) {
        my_ads_store.setShouldShowAddPaymentMethodModal(false);
        return (
            <Modal
                is_open={my_profile_store.should_show_add_payment_method_error_modal}
                small
                has_close_icon={false}
                title={localize("Something's not right")}
            >
                <Modal.Body>
                    <Text color='prominent' size='xs'>
                        {my_profile_store.add_payment_method_error_message}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Ok')}
                        onClick={() => {
                            my_profile_store.setShouldShowAddPaymentMethodErrorModal(false);
                            my_profile_store.setAddPaymentMethodErrorMessage('');
                        }}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        );
    }

    if (isMobile()) {
        return (
            <MobileFullPageModal
                body_className={classNames('p2p-my-ads__modal-body', {
                    'p2p-my-ads__modal-body--form': my_profile_store.selected_payment_method,
                })}
                height_offset='80px'
                is_flex
                is_modal_open={my_ads_store.should_show_add_payment_method_modal}
                page_header_className='buy-sell__modal-header'
                page_header_text={localize('Add payment method')}
                pageHeaderReturnFn={onCancel}
            >
                <AddPaymentMethod
                    formik_ref={formik_ref}
                    should_show_page_return={false}
                    should_show_separated_footer={true}
                />
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className={classNames('p2p-my-ads__modal-error', {
                'p2p-my-ads__modal-form': my_profile_store.selected_payment_method,
            })}
            has_close_icon
            height='560px'
            is_open={my_ads_store.should_show_add_payment_method_modal}
            title={
                <React.Fragment>
                    <Icon icon='icArrowLeftBold' onClick={onCancel} className='p2p-my-ads__modal-icon' />
                    {localize('Add payment method')}
                </React.Fragment>
            }
            toggleModal={onCancel}
        >
            <Modal.Body
                className={classNames({ 'p2p-my-ads__modal-body--scroll': my_profile_store.selected_payment_method })}
            >
                <AddPaymentMethod
                    formik_ref={formik_ref}
                    should_show_page_return={false}
                    should_show_separated_footer={true}
                />
            </Modal.Body>
            {!my_profile_store.selected_payment_method && (
                <Modal.Footer has_separator>
                    <Button large onClick={onCancel} secondary>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default observer(CreateAdAddPaymentMethodModal);
