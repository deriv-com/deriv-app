import classNames from 'classnames';
import React from 'react';
import { Field, Form } from 'formik';
import { Button, DesktopWrapper, Input, Loading, Text } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import ModalForm from 'Components/modal-manager/modal-form';
import './edit-payment-method-form.scss';

const EditPaymentMethodForm = () => {
    const { showModal } = useModalManagerContext();
    const { mutation, update } = useP2PAdvertiserPaymentMethods();
    const { error: mutation_error, status: mutation_status } = mutation;
    const { general_store, my_profile_store } = useStores();
    const { payment_method_to_edit } = my_profile_store;

    const fields_initial_values = {};
    Object.keys(payment_method_to_edit.fields).forEach(key => {
        fields_initial_values[key] = payment_method_to_edit.fields[key].value;
    });

    const updatePaymentMethod = values => {
        update(payment_method_to_edit.id, values);
    };

    React.useEffect(() => {
        return () => {
            my_profile_store.setSelectedPaymentMethod('');
            my_profile_store.setSelectedPaymentMethodDisplayName('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (mutation_status === 'success') {
            my_profile_store.setShouldShowEditPaymentMethodForm(false);
        } else if (mutation_status === 'error') {
            my_profile_store.setAddPaymentMethodErrorMessage(mutation_error.message);
            showModal({ key: 'AddPaymentMethodErrorModal' });
        }
    }, [mutation_error, mutation_status]);

    if (!payment_method_to_edit) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <ModalForm
                enableReinitialize
                initialValues={fields_initial_values}
                onSubmit={updatePaymentMethod}
                validate={my_profile_store.validatePaymentMethodFields}
            >
                {({ dirty, handleChange, isSubmitting, errors }) => {
                    return (
                        <React.Fragment>
                            <DesktopWrapper>
                                <PageReturn
                                    onClick={() => {
                                        if (dirty) {
                                            showModal({
                                                key: 'CancelEditPaymentMethodModal',
                                            });
                                        } else {
                                            my_profile_store.setShouldShowEditPaymentMethodForm(false);
                                        }
                                    }}
                                    page_title={localize('Edit payment method')}
                                />
                            </DesktopWrapper>
                            <Form className='edit-payment-method-form__form'>
                                <div className='edit-payment-method-form__form-wrapper'>
                                    <Field name='choose_payment_method'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                disabled
                                                type='field'
                                                label={
                                                    <Text color='prominent' size='xs'>
                                                        <Localize i18n_default_text='Choose your payment method' />
                                                    </Text>
                                                }
                                                value={my_profile_store.payment_method_to_edit.display_name}
                                                required
                                            />
                                        )}
                                    </Field>
                                    {Object.keys(payment_method_to_edit.fields).map(payment_method_key => {
                                        const current_field = payment_method_to_edit.fields[payment_method_key];

                                        return (
                                            <Field
                                                name={payment_method_key}
                                                id={payment_method_key}
                                                key={payment_method_key}
                                            >
                                                {({ field }) => {
                                                    return (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            error={errors[payment_method_key]}
                                                            type={
                                                                payment_method_key === 'instructions'
                                                                    ? 'textarea'
                                                                    : current_field.type
                                                            }
                                                            label={current_field.display_name}
                                                            className={classNames({
                                                                'edit-payment-method-form__payment-method-field':
                                                                    !errors[payment_method_key]?.length,
                                                                'edit-payment-method-form__payment-method-field--text-area':
                                                                    payment_method_key === 'instructions',
                                                            })}
                                                            onChange={handleChange}
                                                            name={payment_method_key}
                                                            required={!!current_field.required}
                                                            value={field.value || ''}
                                                        />
                                                    );
                                                }}
                                            </Field>
                                        );
                                    })}
                                </div>
                                <div
                                    className={classNames('edit-payment-method-form__buttons', {
                                        'edit-payment-method-form__buttons--separated-footer':
                                            general_store.active_index === 3 && isMobile(),
                                        'edit-payment-method-form__buttons--separated-footer-profile':
                                            general_store.active_index === 3 && isDesktop(),
                                    })}
                                >
                                    <Button
                                        secondary
                                        large
                                        onClick={() => {
                                            if (dirty) {
                                                showModal({
                                                    key: 'CancelEditPaymentMethodModal',
                                                });
                                            } else {
                                                my_profile_store.setPaymentMethodToEdit(null);
                                                my_profile_store.setShouldShowEditPaymentMethodForm(false);
                                            }
                                        }}
                                        type='button'
                                    >
                                        <Localize i18n_default_text='Cancel' />
                                    </Button>
                                    <Button
                                        className='edit-payment-method-form__buttons--add'
                                        primary
                                        large
                                        is_disabled={isSubmitting || !dirty || !!Object.keys(errors)?.length}
                                    >
                                        <Localize i18n_default_text='Save changes' />
                                    </Button>
                                </div>
                            </Form>
                        </React.Fragment>
                    );
                }}
            </ModalForm>
        </React.Fragment>
    );
};

export default EditPaymentMethodForm;
