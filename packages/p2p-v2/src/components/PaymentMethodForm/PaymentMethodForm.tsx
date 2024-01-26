import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TFormState } from 'src/reducers/types';
import { TSelectedPaymentMethod } from 'types';
import { p2p } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import CloseCircle from '../../public/ic-close-circle.svg';
import { ClickableText } from '../ClickableText';
import { Dropdown } from '../Dropdown';
import { PaymentMethodErrorModal, PaymentMethodModal } from '../Modals';
import { PaymentMethodField } from '../PaymentMethodField';
import { PaymentMethodsHeader } from '../PaymentMethodsHeader';
import { TextField } from '../TextField';
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
    const { actionType, selectedPaymentMethod, title } = rest.formState || {};

    const { data: availablePaymentMethods } = p2p.paymentMethods.useGet();
    const { create, error: createError, isSuccess: isCreateSuccessful } = p2p.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = p2p.advertiserPaymentMethods.useUpdate();

    useEffect(() => {
        if (isCreateSuccessful) {
            onResetFormState();
        } else if (createError) {
            setIsModalOpen(true);
        }
    }, [isCreateSuccessful, createError, onResetFormState]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            onResetFormState();
        } else if (updateError) {
            setIsModalOpen(true);
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
                    if (actionType === 'ADD') {
                        create({ ...data, method: String(selectedPaymentMethod?.method) });
                    } else if (actionType === 'EDIT') {
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
                                            onAdd();
                                            reset();
                                        }}
                                        width={20}
                                    />
                                );
                            }}
                            value={selectedPaymentMethod?.display_name}
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
                            <Text color='less-prominent' size='xs'>
                                {/* TODO: Remember to translate these */}
                                <span className='p2p-v2-payment-method-form__text'>Don’t see your payment method?</span>
                                <ClickableText
                                    color='red'
                                    onClick={() => {
                                        const paymentMethod = availablePaymentMethods?.find(p => p.id === 'other');
                                        if (paymentMethod) {
                                            onAdd({
                                                displayName: paymentMethod?.display_name,
                                                fields: paymentMethod?.fields,
                                                method: 'other',
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
                <div className='p2p-v2-payment-method-form__buttons'>
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
            {actionType === 'EDIT' && (!isUpdateSuccessful || !updateError) && (
                // TODO: Remember to translate these strings
                <PaymentMethodModal
                    description='If you choose to cancel, the edited details will be lost.'
                    isModalOpen={isModalOpen}
                    onConfirm={() => {
                        onResetFormState();
                    }}
                    onReject={() => {
                        setIsModalOpen(false);
                    }}
                    primaryButtonLabel="Don't cancel"
                    secondaryButtonLabel='Cancel'
                    title='Cancel your edits?'
                />
            )}
            {actionType === 'ADD' && (!isCreateSuccessful || !createError) && (
                // TODO: Remember to translate these strings
                <PaymentMethodModal
                    description='If you choose to cancel, the details you’ve entered will be lost.'
                    isModalOpen={isModalOpen}
                    onConfirm={() => {
                        onResetFormState();
                    }}
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
                    errorMessage={String(
                        (createError && 'message' in createError && createError?.message) ||
                            (updateError && 'message' in updateError && updateError?.message)
                    )}
                    isModalOpen={true}
                    onConfirm={() => {
                        onResetFormState();
                        setIsModalOpen(false);
                    }}
                    title='Something’s not right'
                />
            )}
        </div>
    );
};

export default PaymentMethodForm;
