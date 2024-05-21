import React from 'react';
import Chip from 'AppV2/Components/Chip';
import { ActionSheet, Checkbox } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TFilter = {
    setContractTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
    contractTypeFilter: string[] | [];
};

// TODO: Replace mockAvailableContractsList with real data when BE will be ready (send list of all available contracts based on account)
const mockAvailableContractsList = [
    { tradeType: <Localize i18n_default_text='Accumulators' />, id: 'Accumulators' },
    { tradeType: <Localize i18n_default_text='Vanillas' />, id: 'Vanillas' },
    { tradeType: <Localize i18n_default_text='Turbos' />, id: 'Turbos' },
    { tradeType: <Localize i18n_default_text='Multipliers' />, id: 'Multipliers' },
    { tradeType: <Localize i18n_default_text='Rise/Fall' />, id: 'Rise/Fall' },
    { tradeType: <Localize i18n_default_text='Higher/Lower' />, id: 'Higher/Lower' },
    { tradeType: <Localize i18n_default_text='Touch/No touch' />, id: 'Touch/No touch' },
    { tradeType: <Localize i18n_default_text='Matches/Differs' />, id: 'Matches/Differs' },
    { tradeType: <Localize i18n_default_text='Even/Odd' />, id: 'Even/Odd' },
    { tradeType: <Localize i18n_default_text='Over/Under' />, id: 'Over/Under' },
];

const Filter = ({ setContractTypeFilter, contractTypeFilter }: TFilter) => {
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

    const chipLabelFormatting = () => {
        const arrayLength = contractTypeFilter.length;
        if (!arrayLength) return <Localize i18n_default_text='All trade types' />;
        if (arrayLength === 1)
            return mockAvailableContractsList.find(type => type.id === contractTypeFilter[0])?.tradeType;
        return <Localize i18n_default_text='{{amount}} trade types' values={{ amount: arrayLength }} />;
    };

    return (
        <React.Fragment>
            <Chip
                label={chipLabelFormatting()}
                dropdown
                isDropdownOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                selected={!!changedOptions.length}
            />
            <ActionSheet.Root isOpen={isDropdownOpen} onClose={onActionSheetClose} position='left'>
                <ActionSheet.Portal>
                    <ActionSheet.Header title={<Localize i18n_default_text='Filter by trade types' />} />
                    <ActionSheet.Content className='filter__item__wrapper'>
                        {mockAvailableContractsList.map(({ tradeType, id }) => (
                            <Checkbox
                                label={tradeType}
                                className='filter__item'
                                key={id}
                                onChange={onChange}
                                id={id}
                                checked={changedOptions.includes(id)}
                                size='md'
                                checkboxPosition='right'
                            />
                        ))}
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        primaryAction={{ content: 'Apply', onAction: () => setContractTypeFilter(changedOptions) }}
                        secondaryAction={{ content: 'Clear All', onAction: () => setChangedOptions([]) }}
                        alignment='vertical'
                        shouldCloseOnSecondaryButtonClick={false}
                        // TODO: replace className with disabling props after Quill library updates
                        className={`${changedOptions.length ? '' : 'disabled'}`}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
};

export default Filter;
