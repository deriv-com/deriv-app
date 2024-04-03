import React from 'react';
import { useResidenceList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';

type TCountrySelector = {
    disabled?: boolean;
    errorMessage?: React.ReactNode;
    label: string;
    name: string;
};

export const CountrySelector = ({ disabled, errorMessage, label, name, ...field }: TCountrySelector) => {
    const { data: residenceList } = useResidenceList();

    return (
        <Dropdown
            {...field}
            disabled={disabled}
            dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
            errorMessage={errorMessage}
            isFullWidth
            label={label}
            list={residenceList}
            name={name}
            /*eslint-disable @typescript-eslint/no-empty-function */
            onSelect={() => {}}
            variant='prompt'
        />
    );
};
