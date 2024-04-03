import React, { MouseEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { AD_CONDITION_TYPES } from '@/constants';
import { Text, useDevice } from '@deriv-com/ui';
import { AdConditionBlockSelector } from '../AdConditionBlockSelector';
import { AdFormController } from '../AdFormController';
import { AdSummary } from '../AdSummary';
import { PreferredCountriesSelector } from '../PreferredCountriesSelector';

type TAdConditionsSection = {
    currency: string;
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: MouseEventHandler<HTMLButtonElement>;
    localCurrency?: string;
    rateType: string;
};

const AdConditionsSection = ({ currency, localCurrency, rateType, ...props }: TAdConditionsSection) => {
    const {
        formState: { errors },
        getValues,
        setValue,
        watch,
    } = useFormContext();
    const { isMobile } = useDevice();
    const labelSize = isMobile ? 'md' : 'sm';

    const onClickBlockSelector = (value: number, type: string) => {
        if (type === AD_CONDITION_TYPES.JOINING_DATE) {
            setValue('min-join-days', value);
        } else {
            setValue('min-completion-rate', value);
        }
    };

    const minJoinDays = watch('min-join-days');
    const minCompletionRate = watch('min-completion-rate');
    return (
        <div className='flex flex-col p-[1.6rem] w-full lg:p-0'>
            <AdSummary
                currency={currency}
                localCurrency={localCurrency}
                offerAmount={errors.amount ? '' : getValues('amount')}
                priceRate={getValues('rate-value')}
                rateType={rateType}
                type={getValues('ad-type')}
            />
            <div className='flex flex-col my-[2.4rem]'>
                <Text color='prominent' size={labelSize}>
                    Counterparty conditions (optional)
                </Text>
                <Text color='less-prominent' size={labelSize}>
                    Only users who match these criteria will see your ad.
                </Text>
            </div>
            <AdConditionBlockSelector
                onClick={value => onClickBlockSelector(value, AD_CONDITION_TYPES.JOINING_DATE)}
                selectedValue={minJoinDays && Number(minJoinDays)}
                type={AD_CONDITION_TYPES.JOINING_DATE}
            />
            <AdConditionBlockSelector
                onClick={value => onClickBlockSelector(value, AD_CONDITION_TYPES.COMPLETION_RATE)}
                selectedValue={minCompletionRate && Number(minCompletionRate)}
                type={AD_CONDITION_TYPES.COMPLETION_RATE}
            />
            <PreferredCountriesSelector type={AD_CONDITION_TYPES.PREFERRED_COUNTRIES} />
            <AdFormController {...props} isNextButtonDisabled={!!errors} />
        </div>
    );
};

export default AdConditionsSection;
