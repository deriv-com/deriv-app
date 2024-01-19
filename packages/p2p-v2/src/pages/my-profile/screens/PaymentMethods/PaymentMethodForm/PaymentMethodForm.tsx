import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { p2p } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { ClickableText } from '../../../../../components/ClickableText';
import { Dropdown } from '../../../../../components/Dropdown';
import {
    AddEditPaymentMethodErrorModal,
    CancelAddPaymentMethodModal,
    CancelEditPaymentMethodModal,
} from '../../../../../components/Modals';
import { TextField } from '../../../../../components/TextField';
import { useAdvertiserPaymentMethodsConfig, useAdvertiserPaymentMethodsConfigDispatch } from '../../../../../providers';
import CloseCircle from '../../../../../public/ic-close-circle.svg';
import { PaymentMethodField } from '../PaymentMethodField';
import { PaymentMethodsHeader } from '../PaymentMethodsHeader';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    configFormSate: ReturnType<typeof useAdvertiserPaymentMethodsConfig>['formState'];
};

const PaymentMethodForm = ({ configFormSate }: TPaymentMethodFormProps) => {
    const {
        control,
        formState: { isDirty, isSubmitting, isValid },
        handleSubmit,
        reset,
    } = useForm({ mode: 'all' });
    const [isOpen, setIsOpen] = useState(false);
    const configDispatch = useAdvertiserPaymentMethodsConfigDispatch();
    const { actionType, paymentMethod, title } = configFormSate || {};

    const { data: availablePaymentMethods } = p2p.paymentMethods.useGet();
    const { create, error: createError, isSuccess: isCreateSuccessful } = p2p.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = p2p.advertiserPaymentMethods.useUpdate();

    useEffect(() => {
        if (isCreateSuccessful) {
            configDispatch({ type: 'RESET' });
        } else if (createError) {
            setIsOpen(true);
        }
    }, [isCreateSuccessful, createError, configDispatch]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            configDispatch({ type: 'RESET' });
        } else if (updateError) {
            setIsOpen(true);
        }
    }, [configDispatch, isUpdateSuccessful, updateError]);

    const availablePaymentMethodsList = useMemo(() => {
        const listItems = availablePaymentMethods?.map(availablePaymentMethod => ({
            text: availablePaymentMethod?.display_name,
            value: availablePaymentMethod?.id,
        }));
        return listItems || [];
    }, [availablePaymentMethods]);

    const handleGoBack = () => {
        if (isDirty) {
            setIsOpen(true);
        } else {
            configDispatch({ type: 'RESET' });
        }
    };

    return (
        <div className='p2p-v2-payment-method-form'>
            <PaymentMethodsHeader onGoBack={handleGoBack} title={title} />
            <form
                className='p2p-v2-payment-method-form__form'
                onSubmit={handleSubmit(data => {
                    if (actionType === 'ADD') {
                        create({ ...data, method: String(paymentMethod?.method) });
                    } else if (actionType === 'EDIT') {
                        update(String(paymentMethod?.id), { ...data, method: String(paymentMethod?.method) });
                    }
                })}
            >
                <div className='p2p-v2-payment-method-form__field-wrapper'>
                    {paymentMethod ? (
                        // TODO: Remember to translate this
                        <TextField
                            disabled
                            label='Choose your payment method'
                            renderRightIcon={() => {
                                // TODO: Remember to override this style for disabling pointer events
                                return actionType === 'EDIT' ? null : (
                                    <CloseCircle
                                        className='p2p-v2-payment-method-form__icon--close'
                                        fill='#999999'
                                        height={30}
                                        onClick={() => {
                                            configDispatch({
                                                type: 'ADD',
                                            });
                                            reset();
                                        }}
                                        width={20}
                                    />
                                );
                            }}
                            value={paymentMethod?.display_name}
                        />
                    ) : (
                        <>
                            <Dropdown
                                label='Payment method'
                                list={availablePaymentMethodsList}
                                name='Payment method'
                                onSelect={(value: string) => {
                                    const selectedPaymentMethod = availablePaymentMethods?.find(p => p.id === value);
                                    if (selectedPaymentMethod) {
                                        configDispatch?.({
                                            payload: {
                                                paymentMethod: {
                                                    displayName: selectedPaymentMethod?.display_name,
                                                    fields: selectedPaymentMethod?.fields,
                                                    method: value,
                                                },
                                            },
                                            type: actionType,
                                        });
                                    }
                                }}
                                // TODO: Remember to translate this
                                value={paymentMethod?.display_name ?? ''}
                                variant='comboBox'
                            />
                            <Text color='less-prominent' size='xs'>
                                {/* TODO: Remember to translate these */}
                                <span className='p2p-v2-payment-method-form__text'>Don’t see your payment method?</span>
                                <ClickableText
                                    color='red'
                                    onClick={() => {
                                        const paymentMethod = availablePaymentMethods?.find(p => p.id === 'other');
                                        if (paymentMethod) {
                                            configDispatch?.({
                                                payload: {
                                                    paymentMethod: {
                                                        displayName: paymentMethod?.display_name,
                                                        fields: paymentMethod?.fields,
                                                        method: 'other',
                                                    },
                                                },
                                                type: actionType,
                                            });
                                        }
                                    }}
                                >
                                    Add new.
                                </ClickableText>
                            </Text>
                        </>
                    )}
                </div>
                {Object.keys(paymentMethod?.fields || {})?.map(field => {
                    const paymentMethodField = paymentMethod?.fields?.[field];
                    return (
                        <PaymentMethodField
                            control={control}
                            defaultValue={paymentMethodField?.value ?? ''}
                            displayName={paymentMethodField?.display_name ?? ''}
                            field={field}
                            key={field}
                            required={!!paymentMethodField?.required}
                        />
                    );
                })}
                <div className='p2p-v2-payment-method-form__buttons'>
                    {/* TODO: Remember to wire up the modal */}
                    <Button
                        className='p2p-v2-payment-method-form__buttons--cancel'
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();

                            handleGoBack();
                        }}
                        size='lg'
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    {/* TODO: Remember to translate these */}
                    <Button disabled={isSubmitting || !isValid || !isDirty} size='lg'>
                        {actionType === 'ADD' ? 'Add' : 'Save changes'}
                    </Button>
                </div>
            </form>
            {actionType === 'EDIT' && (!isUpdateSuccessful || !updateError) ? (
                <CancelEditPaymentMethodModal
                    isOpen={isOpen}
                    onCancel={() => {
                        configDispatch({ type: 'RESET' });
                    }}
                    onGoBack={() => {
                        setIsOpen(false);
                    }}
                />
            ) : null}
            {actionType === 'ADD' && (!isCreateSuccessful || !createError) ? (
                <CancelAddPaymentMethodModal
                    isOpen={isOpen}
                    onCancel={() => configDispatch({ type: 'RESET' })}
                    onGoBack={() => setIsOpen(false)}
                />
            ) : null}
            {createError || updateError ? (
                <AddEditPaymentMethodErrorModal
                    errorMessage={String(
                        (createError && 'message' in createError && createError?.message) ||
                            (updateError && 'message' in updateError && updateError?.message)
                    )}
                    isOpen={true}
                    onComfirm={() => {
                        configDispatch({ type: 'RESET' });
                        setIsOpen(false);
                    }}
                />
            ) : null}
        </div>
    );
};

export default PaymentMethodForm;
