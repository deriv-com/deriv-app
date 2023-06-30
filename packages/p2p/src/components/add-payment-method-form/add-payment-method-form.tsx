import React from 'react';
import classNames from 'classnames';
import { Field, Form, FormikValues } from 'formik';
import { Button, Icon, Input, Loading, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import ModalForm from 'Components/modal-manager/modal-form';
import { useStores } from 'Stores';
import { TPaymentMethodFieldMapProps } from 'Types';

type TAddPaymentMethodFormProps = {
    should_show_separated_footer?: boolean;
};

const AddPaymentMethodForm = ({ should_show_separated_footer = false }: TAddPaymentMethodFormProps) => {
    const { general_store, my_profile_store } = useStores();
    const { hideModal, modal, showModal } = useModalManagerContext();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();
        my_profile_store.setAddPaymentMethodErrorMessage('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (
        !my_profile_store.selected_payment_method_display_name &&
        my_profile_store.selected_payment_method_fields.length === 0
    ) {
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
                {({ dirty, handleChange, isSubmitting, errors, touched }: FormikValues) => {
                    return (
                        <Form className='add-payment-method-form__form' noValidate>
                            <div className='add-payment-method-form__form-wrapper'>
                                <Field name='choose_payment_method'>
                                    {({ field }: FormikValues) => (
                                        <Input
                                            {...field}
                                            disabled
                                            field_className='add-payment-method-form__field'
                                            label={
                                                <Text color='prominent' size='xs'>
                                                    <Localize i18n_default_text='Choose your payment method' />
                                                </Text>
                                            }
                                            required
                                            trailing_icon={
                                                <Icon
                                                    className='add-payment-method-form__cross-icon'
                                                    color='secondary'
                                                    data_testid='dt_add_payment_method_form_cross_icon'
                                                    icon='IcCloseCircle'
                                                    onClick={() => my_profile_store.setSelectedPaymentMethod('')}
                                                />
                                            }
                                            type='field'
                                            value={my_profile_store.selected_payment_method_display_name}
                                        />
                                    )}
                                </Field>
                                {my_profile_store.selected_payment_method_fields?.map(
                                    (payment_method_field: TPaymentMethodFieldMapProps, key: number) => (
                                        <Field name={payment_method_field[0]} id={payment_method_field[0]} key={key}>
                                            {({ field }: FormikValues) => (
                                                <Input
                                                    {...field}
                                                    className={classNames({
                                                        'add-payment-method-form__payment-method-field':
                                                            !errors[payment_method_field[0]]?.length,
                                                        'add-payment-method-form__payment-method-field--text-area':
                                                            payment_method_field[0] === 'instructions',
                                                    })}
                                                    data-lpignore='true'
                                                    error={
                                                        touched[payment_method_field[0]] &&
                                                        errors[payment_method_field[0]]
                                                    }
                                                    label={payment_method_field[1].display_name}
                                                    name={payment_method_field[0]}
                                                    onChange={handleChange}
                                                    required={!!payment_method_field[1].required}
                                                    type={
                                                        payment_method_field[0] === 'instructions'
                                                            ? 'textarea'
                                                            : payment_method_field[1].type
                                                    }
                                                />
                                            )}
                                        </Field>
                                    )
                                )}
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
                                    large
                                    onClick={() => {
                                        if (dirty) {
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
                                    secondary
                                    type='button'
                                >
                                    <Localize i18n_default_text='Cancel' />
                                </Button>
                                <Button
                                    className='add-payment-method-form__buttons--add'
                                    is_disabled={isSubmitting || !dirty || !!Object.keys(errors)?.length}
                                    large
                                    primary
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

export default observer(AddPaymentMethodForm);
