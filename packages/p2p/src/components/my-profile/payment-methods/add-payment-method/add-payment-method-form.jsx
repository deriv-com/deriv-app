import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Field, Form } from 'formik';
import { Button, Icon, Input, Loading, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import ModalForm from 'Components/modal-manager/modal-form';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const AddPaymentMethodForm = ({ should_show_separated_footer = false }) => {
    const { general_store, my_profile_store } = useStores();
    const { hideModal, modal, showModal } = useModalManagerContext();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();
        my_profile_store.setAddPaymentMethodErrorMessage('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.selected_payment_method_display_name && !my_profile_store.selected_payment_method_fields) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <ModalForm
                enableReinitialize
                initialValues={my_profile_store.initial_values}
                onSubmit={my_profile_store.createPaymentMethod}
                validate={my_profile_store.validatePaymentMethodFields}
            >
                {({ dirty, handleChange, isSubmitting, errors, touched }) => {
                    return (
                        <Form className='add-payment-method-form__form' noValidate>
                            <div className='add-payment-method-form__form-wrapper'>
                                <Field name='choose_payment_method'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            disabled
                                            type='field'
                                            field_className='add-payment-method-form__field'
                                            label={
                                                <Text color='prominent' size='xs'>
                                                    <Localize i18n_default_text='Choose your payment method' />
                                                </Text>
                                            }
                                            value={my_profile_store.selected_payment_method_display_name}
                                            required
                                            trailing_icon={
                                                <Icon
                                                    className='add-payment-method-form__cross-icon'
                                                    color='secondary'
                                                    icon='IcCloseCircle'
                                                    onClick={() => my_profile_store.setSelectedPaymentMethod('')}
                                                />
                                            }
                                        />
                                    )}
                                </Field>
                                {my_profile_store.selected_payment_method_fields?.map((payment_method_field, key) => (
                                    <Field name={payment_method_field[0]} id={payment_method_field[0]} key={key}>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                error={
                                                    touched[payment_method_field[0]] && errors[payment_method_field[0]]
                                                }
                                                type={
                                                    payment_method_field[0] === 'instructions'
                                                        ? 'textarea'
                                                        : payment_method_field[1].type
                                                }
                                                label={payment_method_field[1].display_name}
                                                className={classNames({
                                                    'add-payment-method-form__payment-method-field':
                                                        !errors[payment_method_field[0]]?.length,
                                                    'add-payment-method-form__payment-method-field--text-area':
                                                        payment_method_field[0] === 'instructions',
                                                })}
                                                onChange={handleChange}
                                                name={payment_method_field[0]}
                                                required={!!payment_method_field[1].required}
                                            />
                                        )}
                                    </Field>
                                ))}
                            </div>
                            <div
                                className={classNames('add-payment-method-form__buttons', {
                                    'add-payment-method-form__buttons--separated-footer':
                                        (should_show_separated_footer && isMobile()) ||
                                        general_store.active_index !== 3,
                                    'add-payment-method-form__buttons--separated-footer-profile':
                                        general_store.active_index === 3 && isDesktop(),
                                })}
                            >
                                <Button
                                    secondary
                                    large
                                    onClick={() => {
                                        if (dirty || my_profile_store.selected_payment_method.length > 0) {
                                            showModal({
                                                key: 'CancelAddPaymentMethodModal',
                                            });
                                        } else {
                                            my_profile_store.hideAddPaymentMethodForm();
                                            // fixes an issue where in buy-sell-modal mobile, on clicking Cancel button without modifying form it just closes the buy sell modal as
                                            if (modal.key !== 'BuySellModal') {
                                                hideModal();
                                            }
                                        }
                                    }}
                                    type='button'
                                >
                                    <Localize i18n_default_text='Cancel' />
                                </Button>
                                <Button
                                    className='add-payment-method-form__buttons--add'
                                    primary
                                    large
                                    is_disabled={isSubmitting || !dirty || !!Object.keys(errors)?.length}
                                >
                                    <Localize i18n_default_text='Add' />
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </ModalForm>
        </React.Fragment>
    );
};

AddPaymentMethodForm.propTypes = {
    should_show_separated_footer: PropTypes.bool,
};

export default observer(AddPaymentMethodForm);
