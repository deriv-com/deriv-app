import React from 'react';
import { useResidenceList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';

type TCountrySelector = {
    errorMessage?: React.ReactNode;
    label: string;
    name: string;
};

export const CountrySelector = ({ errorMessage, label, name }: TCountrySelector) => {
    const { data: residenceList } = useResidenceList();

    return (
        <Dropdown
            dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
            errorMessage={errorMessage}
            label={label}
            list={residenceList}
            name={name}
            /*eslint-disable @typescript-eslint/no-empty-function */
            onSelect={() => {}}
            variant='prompt'
        />
    );
};
