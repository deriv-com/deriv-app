import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Modal, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const AddPaymentMethodForm = ({ should_show_separated_footer = false }) => {
    const { my_profile_store } = useStores();
    const no_symbols_regex = /^[a-zA-Z0-9\\\s.@_+-]+$/;
    const no_symbols_message =
        '{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+._@';
    const max_characters_error_message = '{{field_name}} has exceeded maximum length of 200 characters.';

    // The fields are rendered dynamically based on the response. This variable will hold a dictionary of field id and their name
    const field_dictionary = my_profile_store.selected_payment_method_fields.reduce((dict, field_data) => {
        return { ...dict, [field_data[0]]: field_data[1].display_name };
    }, {});

    // Generates suitable error message
    const setErrorMessage = (user_input, field) => {
        if (!no_symbols_regex.test(user_input)) {
            return localize(no_symbols_message, { field_name: field_dictionary[field] });
        } else if (user_input.length > 200) {
            return localize(max_characters_error_message, { field_name: field_dictionary[field] });
        }
        return null;
    };

    const validateFields = values => {
        const errors = {};
        if (values.account) {
            const account_err_message = setErrorMessage(values.account, 'account');
            if (account_err_message) {
                errors.account = account_err_message;
            }
        }
        if (values.bank_name) {
            const bank_name_err_message = setErrorMessage(values.bank_name, 'bank_name');
            if (bank_name_err_message) {
                errors.bank_name = bank_name_err_message;
            }
        }
        if (values.branch) {
            const branch_err_message = setErrorMessage(values.branch, 'branch');
            if (branch_err_message) {
                errors.branch = branch_err_message;
            }
        }
        if (values.instructions) {
            const instruction_err_message = setErrorMessage(values.instructions, 'instructions');
            if (instruction_err_message) {
                errors.instructions = instruction_err_message;
            }
        }
        if (values.name) {
            const name_err_message = setErrorMessage(values.name, 'name');
            if (name_err_message) {
                errors.name = name_err_message;
            }
        }
        return errors;
    };

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();
        my_profile_store.setAddPaymentMethodErrorMessage('');
        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);

        return () => {
            my_profile_store.setSelectedPaymentMethod('');
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.selected_payment_method_display_name && !my_profile_store.selected_payment_method_fields) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <Formik
                enableReinitialize
                initialValues={{}}
                onSubmit={my_profile_store.createPaymentMethod}
                validate={validateFields}
            >
                {({ dirty, handleChange, isSubmitting, errors }) => {
                    return (
                        <Form className='add-payment-method-form__form'>
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
                                {my_profile_store.selected_payment_method_fields &&
                                    my_profile_store.selected_payment_method_fields.map((payment_method_field, key) => {
                                        return (
                                            <Field
                                                name={payment_method_field[0]}
                                                id={payment_method_field[0]}
                                                key={key}
                                            >
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        error={errors[payment_method_field[0]]}
                                                        type={
                                                            payment_method_field[0] === 'instructions'
                                                                ? 'textarea'
                                                                : payment_method_field[1].type
                                                        }
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
                            </div>
                            <div
                                className={classNames('add-payment-method-form__buttons', {
                                    'add-payment-method-form__buttons--separated-footer': should_show_separated_footer,
                                })}
                            >
                                <Button
                                    secondary
                                    large
                                    onClick={() => {
                                        my_profile_store.setSelectedPaymentMethod('');
                                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                                    }}
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
                        onClick={() => my_profile_store.setShouldShowAddPaymentMethodErrorModal(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(AddPaymentMethodForm);
