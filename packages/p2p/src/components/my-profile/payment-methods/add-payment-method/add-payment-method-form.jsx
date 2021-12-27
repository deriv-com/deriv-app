import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import CancelAddPaymentMethodModal from './cancel-add-payment-method-modal.jsx';

const AddPaymentMethodForm = ({ should_show_separated_footer = false }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.selected_payment_method_display_name && !my_profile_store.selected_payment_method_fields) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <CancelAddPaymentMethodModal />
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
                            {my_profile_store.selected_payment_method_fields &&
                                my_profile_store.selected_payment_method_fields.map((payment_method_field, key) => {
                                    return (
                                        <Field name={payment_method_field[0]} id={payment_method_field[0]} key={key}>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type={payment_method_field[1].type}
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

                            <div
                                className={classNames('add-payment-method-form__buttons', {
                                    'add-payment-method-form__buttons--separated-footer': should_show_separated_footer,
                                })}
                            >
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
                        </Form>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
};

export default observer(AddPaymentMethodForm);
