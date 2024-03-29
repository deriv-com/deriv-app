import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PreferredCountriesModal } from '@/components/Modals';
import { AD_CONDITION_TYPES, DUMMY_COUNTRIES } from '@/constants';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { AdConditionContentHeader } from '../AdConditionContentHeader';

type TPreferredCountriesSelectorProps = {
    onClick: (value: number) => void;
    selectedValues: string[];
    type: typeof AD_CONDITION_TYPES[keyof typeof AD_CONDITION_TYPES];
};

//TODO: replace dummyCountries after creation and integration of the country list hook

const PreferredCountriesSelector = ({ type }: TPreferredCountriesSelectorProps) => {
    const { isMobile } = useDevice();
    const { getValues, setValue } = useFormContext();
    const dummyCountries = Object.keys(DUMMY_COUNTRIES).map(key => ({
        text: DUMMY_COUNTRIES[key]?.country_name,
        value: key,
    }));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(
        getValues('preferred-countries')
            ? getValues('preferred-countries')
            : dummyCountries.map(country => country.value)
    );

    const onSelectValues = (value: string) => {
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter(val => val !== value));
        } else {
            setSelectedValues([...selectedValues, value]);
        }
    };

    const getSelectedCountriesText = () => {
        const selectedCountries = getValues('preferred-countries');
        if (selectedCountries?.length === dummyCountries.length) {
            return 'All countries';
        }
        return selectedCountries?.map(value => DUMMY_COUNTRIES[value]?.country_name).join(', ');
    };

    return (
        <div className='flex flex-col gap-[0.8rem]'>
            <AdConditionContentHeader type={type} />
            <div
                className='flex items-center justify-between w-[32.8rem] h-16 rounded-[4px] border border-solid border-[#d6dadb] px-[1.6rem] py-0.25 cursor-pointer'
                onClick={() => setIsModalOpen(true)}
            >
                <Text
                    className='w-full overflow-hidden text-ellipsis whitespace-nowrap'
                    color='less-prominent'
                    size={isMobile ? 'md' : 'sm'}
                >
                    {getSelectedCountriesText()}
                </Text>
                <LabelPairedChevronRightSmRegularIcon />
            </div>
            {isModalOpen && (
                <PreferredCountriesModal
                    countryList={dummyCountries}
                    isModalOpen={isModalOpen}
                    onClickApply={() => {
                        setValue('preferred-countries', selectedValues);
                        () => setIsModalOpen(false);
                    }}
                    onRequestClose={() => setIsModalOpen(false)}
                    onSelect={onSelectValues}
                    selectedCountries={selectedValues}
                    setSelectedCountries={setSelectedValues}
                />
            )}
        </div>
    );
};

export default PreferredCountriesSelector;
