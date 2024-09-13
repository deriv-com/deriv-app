import React from 'react';
import { ActionSheet, Checkbox, Chip, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';

type TContractTypeFilter = {
    contractTypeFilter: string[] | [];
    onApplyContractTypeFilter: (filterValues: string[]) => void;
};

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

    return (
        <React.Fragment>
            <Chip.Standard
                className='filter__chip'
                dropdown
                isDropdownOpen={isDropdownOpen}
                label={<Localize i18n_default_text='Trade types' key='trade_types_label' />}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                selected={!!changedOptions.length}
                size='md'
            >
                {!!changedOptions.length && (
                    <Text>
                        {/* Chip component throws a missing unique "key" prop error in quill-ui on test links, hence added a key */}
                        <React.Fragment key='trade_types_count'>({changedOptions.length})</React.Fragment>
                    </Text>
                )}
            </Chip.Standard>
            <ActionSheet.Root isOpen={isDropdownOpen} onClose={onActionSheetClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Filter by trade types' />} />
                    <ActionSheet.Content className='filter__item__wrapper'>
                        {AVAILABLE_CONTRACTS.map(({ tradeType, id }) => (
                            <Checkbox
                                checked={changedOptions.includes(id)}
                                checkboxPosition='right'
                                className='filter__item'
                                id={id}
                                key={id}
                                label={tradeType}
                                onChange={onChange}
                                size='md'
                            />
                        ))}
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='horizontal'
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
