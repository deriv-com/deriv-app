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
import { AddEditPaymentMethodErrorModal, CancelAddPaymentMethodModal, CancelEditPaymentMethodModal } from '../Modals';
import { PaymentMethodField } from '../PaymentMethodField';
import { PaymentMethodsHeader } from '../PaymentMethodsHeader';
import { TextField } from '../TextField';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onRestFormState: () => void;
};

/**
 * @component This component is used to display the form to add or edit a payment method
 * @param formState - The current state of the form
 * @returns {JSX.Element}
 * @example <PaymentMethodForm formState={formState} />
 * **/
const PaymentMethodForm = ({ onAdd, onRestFormState, ...rest }: TPaymentMethodFormProps) => {
    const {
        control,
        formState: { isDirty, isSubmitting, isValid },
        handleSubmit,
        reset,
    } = useForm({ mode: 'all' });
    const [isOpen, setIsOpen] = useState(false);
    const { actionType, selectedPaymentMethod, title } = rest.formState || {};

    const { data: availablePaymentMethods } = p2p.paymentMethods.useGet();
    const { create, error: createError, isSuccess: isCreateSuccessful } = p2p.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = p2p.advertiserPaymentMethods.useUpdate();

    useEffect(() => {
        if (isCreateSuccessful) {
            onRestFormState();
        } else if (createError) {
            setIsOpen(true);
        }
    }, [isCreateSuccessful, createError, onRestFormState]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            onRestFormState();
        } else if (updateError) {
            setIsOpen(true);
        }
    }, [isUpdateSuccessful, onRestFormState, updateError]);

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
            onRestFormState();
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
                <CancelEditPaymentMethodModal
                    isOpen={isOpen}
                    onCancel={() => {
                        onRestFormState();
                    }}
                    onGoBack={() => {
                        setIsOpen(false);
                    }}
                />
            )}
            {actionType === 'ADD' && (!isCreateSuccessful || !createError) && (
                <CancelAddPaymentMethodModal
                    isOpen={isOpen}
                    onCancel={() => onRestFormState()}
                    onGoBack={() => setIsOpen(false)}
                />
            )}
            {(createError || updateError) && (
                <AddEditPaymentMethodErrorModal
                    errorMessage={String(
                        (createError && 'message' in createError && createError?.message) ||
                            (updateError && 'message' in updateError && updateError?.message)
                    )}
                    isOpen={true}
                    onConfirm={() => {
                        onRestFormState();
                        setIsOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default PaymentMethodForm;
