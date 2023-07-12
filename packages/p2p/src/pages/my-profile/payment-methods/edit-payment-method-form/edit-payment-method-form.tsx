import React from 'react';
import classNames from 'classnames';
import { Field, Form, FormikValues } from 'formik';
import { Button, DesktopWrapper, Input, Loading, Text } from '@deriv/components';
import { isDesktop, isEmptyObject, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import ModalForm from 'Components/modal-manager/modal-form';
import PageReturn from 'Components/page-return';
import { useStores } from 'Stores';
import { TPaymentMethodFieldMapProps } from 'Types';

const EditPaymentMethodForm = () => {
    const { general_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();
    const {
        initial_values,
        payment_method_info,
        payment_method_to_edit,
        selected_payment_method_fields,
        setPaymentMethodToEdit,
        setSelectedPaymentMethod,
        setSelectedPaymentMethodDisplayName,
        setShouldShowEditPaymentMethodForm,
        updatePaymentMethod,
        validatePaymentMethodFields,
    } = my_profile_store;

    React.useEffect(() => {
        return () => {
            setSelectedPaymentMethod('');
            setSelectedPaymentMethodDisplayName('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isEmptyObject(payment_method_info)) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <ModalForm
                enableReinitialize
                initialValues={initial_values}
                onSubmit={updatePaymentMethod}
                validate={validatePaymentMethodFields}
            >
                {({ dirty, handleChange, isSubmitting, errors }: FormikValues) => {
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
                                            setShouldShowEditPaymentMethodForm(false);
                                        }
                                    }}
                                    page_title={localize('Edit payment method')}
                                />
                            </DesktopWrapper>
                            <Form className='edit-payment-method-form__form'>
                                <div className='edit-payment-method-form__form-wrapper'>
                                    <Field name='choose_payment_method'>
                                        {({ field }: FormikValues) => (
                                            <Input
                                                {...field}
                                                disabled
                                                label={
                                                    <Text color='prominent' size='xs'>
                                                        <Localize i18n_default_text='Choose your payment method' />
                                                    </Text>
                                                }
                                                required
                                                type='field'
                                                value={payment_method_to_edit.display_name}
                                            />
                                        )}
                                    </Field>
                                    {selected_payment_method_fields?.map(
                                        (payment_method_field: TPaymentMethodFieldMapProps, key: number) => (
                                            <Field
                                                name={payment_method_field[0]}
                                                id={payment_method_field[0]}
                                                key={key}
                                            >
                                                {({ field }: FormikValues) => (
                                                    <Input
                                                        {...field}
                                                        className={classNames({
                                                            'edit-payment-method-form__payment-method-field':
                                                                !errors[payment_method_field[0]]?.length,
                                                            'add-payment-method-form__payment-method-field--text-area':
                                                                payment_method_field[0] === 'instructions',
                                                        })}
                                                        data-lpignore='true'
                                                        error={errors[payment_method_field[0]]}
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
                                                setPaymentMethodToEdit(null);
                                                setShouldShowEditPaymentMethodForm(false);
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

export default observer(EditPaymentMethodForm);
