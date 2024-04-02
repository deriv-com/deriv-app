import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TCountryListItem } from 'types';
import { PreferredCountriesModal } from '@/components/Modals';
import { AD_CONDITION_TYPES } from '@/constants';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { AdConditionContentHeader } from '../AdConditionContentHeader';
import './PreferredCountriesSelector.scss';

type TPreferredCountriesSelectorProps = {
    countryList: TCountryListItem;
    type: typeof AD_CONDITION_TYPES[keyof typeof AD_CONDITION_TYPES];
};

//TODO: replace dummyCountries after creation and integration of the country list hook

const PreferredCountriesSelector = ({ countryList, type }: TPreferredCountriesSelectorProps) => {
    const { isMobile } = useDevice();
    const { getValues, setValue } = useFormContext();
    const countries = Object.keys(countryList).map(key => ({
        text: countryList[key]?.country_name,
        value: key,
    }));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(
        getValues('preferred-countries') ? getValues('preferred-countries') : countries.map(country => country.value)
    );

    const getSelectedCountriesText = () => {
        const selectedCountries = getValues('preferred-countries');
        if (selectedCountries?.length === countries.length) {
            return 'All countries';
        }
        return selectedCountries?.map((value: string) => countryList[value]?.country_name).join(', ');
    };

    return (
        <div className='p2p-v2-preferred-countries-selector'>
            <AdConditionContentHeader type={type} />
            <div className='p2p-v2-preferred-countries-selector__field' onClick={() => setIsModalOpen(true)}>
                <Text
                    className='p2p-v2-preferred-countries-selector__field__text'
                    color='less-prominent'
                    size={isMobile ? 'md' : 'sm'}
                >
                    {getSelectedCountriesText()}
                </Text>
                <LabelPairedChevronRightSmRegularIcon />
            </div>
            {isModalOpen && (
                <PreferredCountriesModal
                    countryList={countries}
                    isModalOpen={isModalOpen}
                    onClickApply={() => {
                        setValue('preferred-countries', selectedValues);
                        setIsModalOpen(false);
                    }}
                    onRequestClose={() => setIsModalOpen(false)}
                    selectedCountries={selectedValues}
                    setSelectedCountries={setSelectedValues}
                />
            )}
        </div>
    );
};

export default PreferredCountriesSelector;
