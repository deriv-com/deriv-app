import React, { MouseEventHandler } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { RadioGroup } from '@/components';
import { BUY_SELL, MY_ADS_URL, RATE_TYPE } from '@/constants';
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
    localCurrency: string;
    rateType: string;
};

const AdTypeSection = ({ currency, localCurrency, rateType, ...props }: TAdTypeSectionProps) => {
    const {
        control,
        formState: { isDirty, isValid },
        setValue,
        watch,
    } = useFormContext();

    const history = useHistory();
    const isSell = watch('ad-type') === BUY_SELL.SELL;

    const onChangeAdTypeHandler = (userInput: 'buy' | 'sell') => {
        setValue('ad-type', userInput);
        if (rateType === RATE_TYPE.FLOAT) {
            if (userInput === BUY_SELL.SELL) {
                setValue('rate-type', '+0.01');
            } else {
                setValue('rate-type', '-0.01');
            }
        }
    };

    const onCancel = () => {
        if (isDirty) {
            // display cancel modal
        } else history.push(MY_ADS_URL);
    };

    return (
        <div>
            <Controller
                control={control}
                defaultValue={BUY_SELL.BUY}
                name='ad-type'
                render={({ field: { onChange, value } }) => {
                    return (
                        <div className='px-[2.4rem] mb-[3.5rem]'>
                            <RadioGroup
                                name='type'
                                onToggle={event => {
                                    onChangeAdTypeHandler(event.target.value as 'buy' | 'sell');
                                    onChange(event);
                                }}
                                required
                                selected={value}
                                textSize='sm'
                            >
                                <RadioGroup.Item label='Buy USD' value={BUY_SELL.BUY} />
                                <RadioGroup.Item label='Sell USD' value={BUY_SELL.SELL} />
                            </RadioGroup>
                        </div>
                    );
                }}
                rules={{ required: true }}
            />
            <div className='flex flex-col lg:flex-row'>
                <AdFormInput currency={currency} label='Total amount' name='amount' />
                {/* TODO: Add FLOATING type component */}
                <AdFormInput currency={localCurrency} label='Fixed rate' name='rate-type' />
            </div>
            <div className='flex flex-col lg:flex-row'>
                <AdFormInput currency={currency} label='Min order' name='min-order' />
                <AdFormInput currency={currency} label='Max order' name='max-order' />
            </div>
            {isSell && (
                <AdFormTextArea
                    control={control}
                    field='Contact details'
                    label='Your contact details'
                    name='contact-details'
                    required
                />
            )}
            <AdFormTextArea
                control={control}
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
