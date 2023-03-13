import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Field, Form } from 'formik';
import { Button, DesktopWrapper, Input, Loading, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import ModalForm from 'Components/modal-manager/modal-form';

const EditPaymentMethodForm = () => {
    const { general_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    React.useEffect(() => {
        return () => {
            my_profile_store.setSelectedPaymentMethod('');
            my_profile_store.setSelectedPaymentMethodDisplayName('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.payment_method_info) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <ModalForm
                enableReinitialize
                initialValues={my_profile_store.initial_values}
                onSubmit={my_profile_store.updatePaymentMethod}
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
                            <Form className='add-payment-method-form__form'>
                                <div className='add-payment-method-form__form-wrapper'>
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
                                    {Object.values(my_profile_store.selected_payment_method_fields).map(
                                        (payment_method_field, key) => {
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
                                                            className={classNames({
                                                                'add-payment-method-form__payment-method-field':
                                                                    !errors[payment_method_field[0]]?.length,
                                                            })}
                                                            onChange={handleChange}
                                                            name={payment_method_field[0]}
                                                            required={!!payment_method_field[1].required}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }
                                    )}
                                </div>
                                <div
                                    className={classNames('add-payment-method-form__buttons', {
                                        'add-payment-method-form__buttons--separated-footer':
                                            general_store.active_index === 3 && isMobile(),
                                        'add-payment-method-form__buttons--separated-footer-profile':
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
                                        className='add-payment-method-form__buttons--add'
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
