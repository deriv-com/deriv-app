import React from 'react';
import { useResidenceList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';

type TCountrySelector = {
    errorMessage?: React.ReactNode;
    handleSelect: (value: string) => void;
    label: string;
    name: string;
};

export const CountrySelector = ({ errorMessage, handleSelect, label, name }: TCountrySelector) => {
    const { data: residenceList } = useResidenceList();

    return (
        <Dropdown
            dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
            errorMessage={errorMessage}
            label={label}
            list={residenceList}
            name={name}
            onSelect={handleSelect}
            variant='prompt'
        />
    );
};
