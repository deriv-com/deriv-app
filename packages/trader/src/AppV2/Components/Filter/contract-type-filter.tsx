import React from 'react';
import { ActionSheet, Checkbox, Chip, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-lib/translations';

type TContractTypeFilter = {
    contractTypeFilter: string[] | [];
    onApplyContractTypeFilter: (filterValues: string[]) => void;
};

const availableContracts = [
    <Localize i18n_default_text='Accumulators' key='Accumulators' />,
    <Localize i18n_default_text='Vanillas' key='Vanillas' />,
    <Localize i18n_default_text='Turbos' key='Turbos' />,
    <Localize i18n_default_text='Multipliers' key='Multipliers' />,
    <Localize i18n_default_text='Rise/Fall' key='Rise/Fall' />,
    <Localize i18n_default_text='Higher/Lower' key='Higher/Lower' />,
    <Localize i18n_default_text='Touch/No touch' key='Touch/No touch' />,
    <Localize i18n_default_text='Matches/Differs' key='Matches/Differs' />,
    <Localize i18n_default_text='Even/Odd' key='Even/Odd' />,
    <Localize i18n_default_text='Over/Under' key='Over/Under' />,
];

const ContractTypeFilter = ({ contractTypeFilter, onApplyContractTypeFilter }: TContractTypeFilter) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [changedOptions, setChangedOptions] = React.useState<string[]>(contractTypeFilter);

    const onActionSheetClose = () => {
        setIsDropdownOpen(false);
        setChangedOptions(contractTypeFilter);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => {
        const newSelectedOption = (e.target as EventTarget & HTMLInputElement).id;

        if (changedOptions.includes(newSelectedOption)) {
            setChangedOptions([...changedOptions.filter(item => item !== newSelectedOption)]);
        } else {
            setChangedOptions([...changedOptions, newSelectedOption]);
        }
    };

    const getChipLabel = () => {
        const arrayLength = contractTypeFilter.length;
        if (!arrayLength) return <Localize i18n_default_text='All trade types' key='All trade types' />;
        if (arrayLength === 1) return availableContracts.find(type => type.key === contractTypeFilter[0])?.key;
        return <Localize i18n_default_text='{{amount}} trade types' values={{ amount: arrayLength }} key='Amount' />;
    };

    return (
        <React.Fragment>
            <Chip.Standard
                className='filter__chip'
                dropdown
                isDropdownOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                selected={!!changedOptions.length}
                size='md'
            >
                <Text size='sm'>{getChipLabel()}</Text>
            </Chip.Standard>
            <ActionSheet.Root isOpen={isDropdownOpen} onClose={onActionSheetClose} position='left'>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Filter by trade types' />} />
                    <ActionSheet.Content className='filter__item__wrapper'>
                        {availableContracts.map(contract => (
                            <Checkbox
                                checked={changedOptions.includes(contract.key as string)}
                                checkboxPosition='right'
                                className='filter__item'
                                id={contract.key as string}
                                key={contract.key}
                                label={contract}
                                onChange={onChange}
                                size='md'
                            />
                        ))}
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        isSecondaryButtonDisabled={!changedOptions.length}
                        primaryAction={{
                            content: <Localize i18n_default_text='Apply' />,
                            onAction: () => onApplyContractTypeFilter(changedOptions),
                        }}
                        secondaryAction={{
                            content: <Localize i18n_default_text='Clear All' />,
                            onAction: () => setChangedOptions([]),
                        }}
                        shouldCloseOnSecondaryButtonClick={false}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
};

export default ContractTypeFilter;
