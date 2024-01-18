import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TPaymentMethodFormConfig, TPaymentMethodFormValues, TSelectedPaymentMethod } from 'types';
import { p2p } from '@deriv/api';
import { TextArea } from '../../../../../components';
import { ClickableText } from '../../../../../components/ClickableText';
import { Dropdown } from '../../../../../components/Dropdown';
import { TextField } from '../../../../../components/TextField';
import { VALID_SYMBOLS_PATTERN } from '../../../../../constants';
import CloseCircle from '../../../../../public/ic-close-circle.svg';
import { PaymentMethodsHeader } from '../PaymentMethodsHeader';
import PaymentMethodFormFooter from './PaymentMethodFormFooter';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    onClear?: () => void;
    onFormSubmit: (data: TPaymentMethodFormValues) => void;
    onGoBack?: () => void;
    onSelectPaymentMethod?: (paymentMethod: TSelectedPaymentMethod) => void;
    paymentMethodFormConfig: TPaymentMethodFormConfig;
};

const PaymentMethodForm = ({
    onClear,
    onFormSubmit,
    onGoBack,
    onSelectPaymentMethod,
    paymentMethodFormConfig,
}: TPaymentMethodFormProps) => {
    const {
        control,
        formState: { isDirty, isSubmitting, isValid },
        handleSubmit,
    } = useForm({ mode: 'all' });
    const { paymentMethod, title, type } = paymentMethodFormConfig;
    const { data: availablePaymentMethods } = p2p.paymentMethods.useGet();
    const availablePaymentMethodsList = useMemo(() => {
        const listItems = availablePaymentMethods?.map(availablePaymentMethod => ({
            text: availablePaymentMethod?.display_name,
            value: availablePaymentMethod?.id,
        }));
        return listItems || [];
    }, [availablePaymentMethods]);

    return (
        <div className='p2p-v2-payment-method-form'>
            <PaymentMethodsHeader onGoBack={onGoBack} title={title} />
            <form
                className='p2p-v2-payment-method-form__form'
                onSubmit={handleSubmit(data => {
                    onFormSubmit({
                        paymentMethodId: String(paymentMethod?.id),
                        type,
                        values: { ...data, method: String(paymentMethod?.method) },
                    });
                })}
            >
                <div className='p2p-v2-payment-method-form__field-wrapper'>
                    {paymentMethodFormConfig.paymentMethod ? (
                        // TODO: Remember to translate this
                        <TextField
                            disabled
                            label='Choose your payment method'
                            renderRightIcon={() =>
                                type === 'EDIT' ? null : (
                                    <CloseCircle
                                        className='p2p-v2-payment-method-form__icon--close'
                                        fill='#999999'
                                        height={30}
                                        onClick={() => {
                                            onClear?.();
                                        }}
                                        width={20}
                                    />
                                )
                            }
                            value={paymentMethod?.display_name}
                        />
                    ) : (
                        <>
                            <Dropdown
                                label='Payment method'
                                list={availablePaymentMethodsList}
                                name='Payment method'
                                onSelect={(value: string) => {
                                    const paymentMethod = availablePaymentMethods?.find(p => p.id === value);
                                    if (paymentMethod) {
                                        onSelectPaymentMethod?.({
                                            displayName: paymentMethod?.display_name,
                                            fields: paymentMethod?.fields,
                                            method: value,
                                        });
                                    }
                                }}
                                // TODO: Remember to translate this
                                value={paymentMethod?.display_name || ''}
                                variant='comboBox'
                            />
                            <ClickableText color='less-prominent' size='xs'>
                                {/* TODO: Remember to translate these */}
                                Don’t see your payment method?{' '}
                                <ClickableText
                                    color='red'
                                    onClick={() => {
                                        const paymentMethod = availablePaymentMethods?.find(p => p.id === 'other');
                                        if (paymentMethod) {
                                            onSelectPaymentMethod?.({
                                                displayName: paymentMethod?.display_name,
                                                fields: paymentMethod?.fields,
                                                method: 'other',
                                            });
                                        }
                                    }}
                                    size='xs'
                                >
                                    Add new.
                                </ClickableText>
                            </ClickableText>
                        </>
                    )}
                </div>
                {Object.keys(paymentMethod?.fields || {})?.map(field => {
                    const paymentMethodField = paymentMethod?.fields?.[field];
                    return (
                        <div className='p2p-v2-payment-method-form__field-wrapper' key={field}>
                            {field === 'instructions' ? (
                                <Controller
                                    control={control}
                                    defaultValue={paymentMethodField?.value || ''}
                                    name={field}
                                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                                        return (
                                            <TextArea
                                                hint={error?.message}
                                                isInvalid={!!error?.message}
                                                label={paymentMethodField?.display_name}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                    rules={{
                                        pattern: {
                                            message: `${paymentMethodField?.display_name} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;`, // TODO: Remember to translate this
                                            value: VALID_SYMBOLS_PATTERN,
                                        },
                                        required: paymentMethodField?.required ? 'This field is required.' : false,
                                    }}
                                />
                            ) : (
                                <Controller
                                    control={control}
                                    defaultValue={paymentMethodField?.value || ''}
                                    name={field}
                                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                                        return (
                                            <TextField
                                                errorMessage={error?.message}
                                                isInvalid={!!error?.message}
                                                label={paymentMethodField?.display_name}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                    rules={{
                                        pattern: {
                                            message: `${paymentMethodField?.display_name} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;`, // TODO: Remember to translate this
                                            value: VALID_SYMBOLS_PATTERN,
                                        },
                                        required: paymentMethodField?.required ? 'This field is required.' : false,
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
                <PaymentMethodFormFooter
                    isDirty={isDirty}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    onGoBack={onGoBack}
                    paymentMethod={paymentMethod}
                    type={type}
                />
            </form>
        </div>
    );
};

export default PaymentMethodForm;
