import React from 'react';
import { observer } from 'mobx-react-lite';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
// import CancelAddPaymentMethodModal from './cancel-add-payment-method-modal.jsx';

const EditPaymentMethodForm = ({ should_show_footer = true, should_show_other_payment_method_hint = true }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        // my_profile_store.setIsLoading(false);
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();
        // my_profile_store.getAdvertiserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.selected_payment_method_display_name && !my_profile_store.selected_payment_method_fields) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            {/* <CancelAddPaymentMethodModal /> */}
            <Formik enableReinitialize initialValues={{}} onSubmit={my_profile_store.createPaymentMethod}>
                {({ dirty, handleChange, isSubmitting }) => {
                    return (
                        <Form className='add-payment-method-form__form'>
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
                                        // error={errors.contact_info}
                                        // className='add-payment-method__textarea'
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
                            {should_show_other_payment_method_hint && (
                                <Localize i18n_default_text='Don’t see the payment method of your choice? Add new.' />
                            )}
                            {my_profile_store.selected_payment_method_fields &&
                                my_profile_store.selected_payment_method_fields.map((payment_method_field, key) => {
                                    return (
                                        <Field name={payment_method_field[0]} id={payment_method_field[0]} key={key}>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='text'
                                                    label={payment_method_field[1].display_name}
                                                    className='add-payment-method-form__payment-method-field'
                                                    onChange={handleChange}
                                                    name={payment_method_field[0]}
                                                    required={!!payment_method_field[1].required}
                                                />
                                            )}
                                        </Field>
                                    );
                                })}
                            {should_show_footer && (
                                <div className='add-payment-method-form__buttons'>
                                    <Button
                                        secondary
                                        large
                                        onClick={() => my_profile_store.setIsCancelAddPaymentMethodModalOpen(true)}
                                        type='button'
                                    >
                                        <Localize i18n_default_text='Cancel' />
                                    </Button>
                                    <Button
                                        className='add-payment-method-form__buttons--add'
                                        primary
                                        large
                                        is_disabled={isSubmitting || !dirty}
                                    >
                                        <Localize i18n_default_text='Add' />
                                    </Button>
                                </div>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
};

export default observer(EditPaymentMethodForm);
