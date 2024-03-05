import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TSelectedPaymentMethod } from 'types';
import { Dropdown, PaymentMethodField, PaymentMethodsFormFooter, PaymentMethodsHeader } from '@/components';
import { PaymentMethodErrorModal, PaymentMethodModal } from '@/components/Modals';
import { TFormState } from '@/reducers/types';
import { p2p } from '@deriv/api-v2';
import { Button, Input, Text } from '@deriv-com/ui';
import CloseCircle from '../../public/ic-close-circle.svg';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onResetFormState: () => void;
};

/**
 * @component This component is used to display the form to add or edit a payment method
 * @param formState - The current state of the form
 * @returns {JSX.Element}
 * @example <PaymentMethodForm formState={formState} />
 * **/
const PaymentMethodForm = ({ onAdd, onResetFormState, ...rest }: TPaymentMethodFormProps) => {
    const {
        control,
        formState: { isDirty, isSubmitting, isValid },
        handleSubmit,
        reset,
    } = useForm({ mode: 'all' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { actionType, selectedPaymentMethod, title } = rest.formState;
    const { data: availablePaymentMethods } = p2p.paymentMethods.useGet();
    const { create, error: createError, isSuccess: isCreateSuccessful } = p2p.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = p2p.advertiserPaymentMethods.useUpdate();

    useEffect(() => {
        if (isCreateSuccessful) {
            onResetFormState();
        }
    }, [isCreateSuccessful, createError, onResetFormState]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            onResetFormState();
        }
    }, [isUpdateSuccessful, onResetFormState, updateError]);

    const availablePaymentMethodsList = useMemo(() => {
        const listItems = availablePaymentMethods?.map(availablePaymentMethod => ({
            text: availablePaymentMethod?.display_name,
            value: availablePaymentMethod?.id,
        }));
        return listItems || [];
    }, [availablePaymentMethods]);
    const handleGoBack = () => {
        if (isDirty) {
            setIsModalOpen(true);
        } else {
            onResetFormState();
        }
    };

    return (
        <div className='p2p-v2-payment-method-form'>
            <PaymentMethodsHeader onGoBack={handleGoBack} title={title} />
            <form
                className='p2p-v2-payment-method-form__form'
                onSubmit={handleSubmit(data => {
                    const hasData = Object.keys(data).length > 0;
                    if (actionType === 'ADD' && hasData) {
                        create({ ...data, method: String(selectedPaymentMethod?.method) });
                    } else if (actionType === 'EDIT' && hasData) {
                        update(String(selectedPaymentMethod?.id), {
                            ...data,
                            method: String(selectedPaymentMethod?.method),
                        });
                    }
                })}
            >
                <div className='p2p-v2-payment-method-form__field-wrapper'>
                    {selectedPaymentMethod ? (
                        // TODO: Remember to translate this
                        <Input
                            defaultValue={selectedPaymentMethod?.display_name}
                            disabled
                            label='Choose your payment method'
                            rightPlaceholder={
                                actionType === 'EDIT' ? null : (
                                    <CloseCircle
                                        className='p2p-v2-payment-method-form__icon--close'
                                        data-testid='dt_p2p_v2_payment_methods_form_close_icon'
                                        fill='#999999'
                                        height={15.7}
                                        onClick={() => {
                                            onAdd();
                                            reset();
                                        }}
                                        width={15.7}
                                    />
                                )
                            }
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
                                        onAdd({
                                            displayName: selectedPaymentMethod?.display_name,
                                            fields: selectedPaymentMethod?.fields,
                                            method: value,
                                        });
                                    }
                                }}
                                // TODO: Remember to translate this
                                value={selectedPaymentMethod?.display_name ?? ''}
                                variant='comboBox'
                            />
                            {/* TODO: Remember to translate these */}
                            <Text color='less-prominent' size='xs'>
                                Don’t see your payment method?
                            </Text>
                            <Button
                                className='p2p-v2-payment-method-form__button'
                                color='primary'
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const paymentMethod = availablePaymentMethods?.find(p => p.id === 'other');
                                    if (paymentMethod) {
                                        onAdd({
                                            displayName: paymentMethod?.display_name,
                                            fields: paymentMethod?.fields,
                                            method: 'other',
                                        });
                                    }
                                }}
                                size='xs'
                                textSize='xs'
                                variant='ghost'
                            >
                                Add new.
                            </Button>
                        </>
                    )}
                </div>
                {Object.keys(selectedPaymentMethod?.fields || {})?.map(field => {
                    const paymentMethodField = selectedPaymentMethod?.fields?.[field];
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
                <PaymentMethodsFormFooter
                    actionType={actionType}
                    handleGoBack={handleGoBack}
                    isDirty={isDirty}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                />
            </form>
            {actionType === 'EDIT' && (!isUpdateSuccessful || !updateError) && isModalOpen && (
                // TODO: Remember to translate these strings
                <PaymentMethodModal
                    description='If you choose to cancel, the edited details will be lost.'
                    isModalOpen={isModalOpen}
                    onConfirm={onResetFormState}
                    onReject={() => {
                        setIsModalOpen(false);
                    }}
                    primaryButtonLabel="Don't cancel"
                    secondaryButtonLabel='Cancel'
                    title='Cancel your edits?'
                />
            )}
            {actionType === 'ADD' && (!isCreateSuccessful || !createError) && isModalOpen && (
                // TODO: Remember to translate these strings
                <PaymentMethodModal
                    description='If you choose to cancel, the details you’ve entered will be lost.'
                    isModalOpen={isModalOpen}
                    onConfirm={onResetFormState}
                    onReject={() => {
                        setIsModalOpen(false);
                    }}
                    primaryButtonLabel='Go back'
                    secondaryButtonLabel='Cancel'
                    title='Cancel adding this payment method?'
                />
            )}
            {/* TODO: Remember to translate these strings */}
            {(createError || updateError) && (
                <PaymentMethodErrorModal
                    errorMessage={String(createError?.error?.message || updateError?.error?.message)}
                    isModalOpen={true}
                    onConfirm={() => {
                        onResetFormState();
                    }}
                    title='Something’s not right'
                />
            )}
        </div>
    );
};

export default PaymentMethodForm;
