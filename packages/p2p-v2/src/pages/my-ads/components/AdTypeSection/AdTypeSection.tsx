import React, { MouseEventHandler } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RadioGroup, FloatingRate } from '@/components';
import { BUY_SELL, RATE_TYPE } from '@/constants';
import { useQueryString } from '@/hooks';
import { getValidationRules, restrictDecimalPlace } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import { AdFormController } from '../AdFormController';
import { AdFormInput } from '../AdFormInput';
import { AdFormTextArea } from '../AdFormTextArea';
import './AdTypeSection.scss';

type TAdTypeSectionProps = {
    currency: string;
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: MouseEventHandler<HTMLButtonElement>;
    localCurrency?: string;
    onCancel: () => void;
    rateType: string;
};

const AdTypeSection = ({ currency, localCurrency, onCancel, rateType, ...props }: TAdTypeSectionProps) => {
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const isEdit = !!advertId;
    const { isMobile } = useDevice();
    const {
        control,
        formState: { isValid },
        getValues,
        setValue,
        trigger,
        watch,
    } = useFormContext();

    const isSell = watch('ad-type') === BUY_SELL.SELL;
    const textSize = isMobile ? 'md' : 'sm';

    const onChangeAdTypeHandler = (userInput: 'buy' | 'sell') => {
        setValue('ad-type', userInput);
        setValue('payment-method', []);
        if (rateType === RATE_TYPE.FLOAT) {
            if (userInput === BUY_SELL.SELL) {
                setValue('rate-value', '+0.01');
            } else {
                setValue('rate-value', '-0.01');
            }
        }
    };

    const triggerValidation = (fieldNames: string[]) => {
        // Loop through the provided field names
        fieldNames.forEach(fieldName => {
            // Check if the field has a value
            if (getValues(fieldName)) {
                // Trigger validation for the field
                trigger(fieldName);
            }
        });
    };

    return (
        <div className='p2p-v2-ad-type-section'>
            {!isEdit && (
                <Controller
                    control={control}
                    defaultValue={BUY_SELL.BUY}
                    name='ad-type'
                    render={({ field: { onChange, value } }) => {
                        return (
                            <div className='mb-[3.5rem]'>
                                <RadioGroup
                                    name='type'
                                    onToggle={event => {
                                        onChangeAdTypeHandler(event.target.value as 'buy' | 'sell');
                                        onChange(event);
                                    }}
                                    required
                                    selected={value}
                                    textSize={textSize}
                                >
                                    <RadioGroup.Item label='Buy USD' value={BUY_SELL.BUY} />
                                    <RadioGroup.Item label='Sell USD' value={BUY_SELL.SELL} />
                                </RadioGroup>
                            </div>
                        );
                    }}
                    rules={{ required: true }}
                />
            )}
            <div className='flex flex-col lg:flex-row lg:gap-[1.6rem]'>
                <AdFormInput
                    isDisabled={isEdit}
                    label='Total amount'
                    name='amount'
                    rightPlaceholder={
                        <Text color='general' size={textSize}>
                            {currency}
                        </Text>
                    }
                    triggerValidationFunction={() => triggerValidation(['min-order', 'max-order'])}
                />

                {rateType === RATE_TYPE.FLOAT ? (
                    <Controller
                        control={control}
                        name='rate-value'
                        render={({ field: { onChange, value }, fieldState: { error } }) => {
                            return (
                                <FloatingRate
                                    changeHandler={e => restrictDecimalPlace(e, onChange)}
                                    errorMessages={error?.message ?? ''}
                                    fiatCurrency={currency}
                                    localCurrency={localCurrency ?? ''}
                                    onChange={onChange}
                                    value={value}
                                />
                            );
                        }}
                        rules={{ validate: getValidationRules('rate-value', getValues) }}
                    />
                ) : (
                    <AdFormInput
                        label='Fixed rate'
                        name='rate-value'
                        rightPlaceholder={
                            <Text color='general' size={textSize}>
                                {localCurrency}
                            </Text>
                        }
                    />
                )}
            </div>
            <div className='flex flex-col lg:flex-row lg:gap-[1.6rem]'>
                <AdFormInput
                    label='Min order'
                    name='min-order'
                    rightPlaceholder={
                        <Text color='general' size={textSize}>
                            {currency}
                        </Text>
                    }
                    triggerValidationFunction={() => triggerValidation(['amount', 'max-order'])}
                />
                <AdFormInput
                    label='Max order'
                    name='max-order'
                    rightPlaceholder={
                        <Text color='general' size={textSize}>
                            {currency}
                        </Text>
                    }
                    triggerValidationFunction={() => triggerValidation(['amount', 'min-order'])}
                />
            </div>
            {isSell && (
                <AdFormTextArea field='Contact details' label='Your contact details' name='contact-details' required />
            )}
            <AdFormTextArea
                field='Instructions'
                hint='This information will be visible to everyone'
                label='Instructions(optional)'
                name='instructions'
            />
            <AdFormController {...props} isNextButtonDisabled={!isValid} onCancel={onCancel} />
        </div>
    );
};

export default AdTypeSection;
