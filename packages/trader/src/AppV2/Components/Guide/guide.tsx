import React from 'react';
import { Button, ActionSheet, Heading, Chip, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { availableContracts, CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import TradeDescription from './trade-description';
import Definition from './definition';

type TGuide = {
    is_minimalistic_look?: boolean;
};

const Guide = ({ is_minimalistic_look = false }: TGuide) => {
    const [is_description_opened, setIsDescriptionOpened] = React.useState(false);
    const [selected_contract_type, setSelectedContractType] = React.useState(CONTRACT_LIST.ACCUMULATORS);
    const [selected_definition, setSelectedDefinition] = React.useState<string>();

    const onChipSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectedContractType((e.target as EventTarget & HTMLButtonElement).textContent ?? '');
    };

    const onDefinitionClick = (definition: string) => {
        setSelectedDefinition(definition);
    };

    return (
        <React.Fragment>
            <Button
                color='black'
                variant={is_minimalistic_look ? 'tertiary' : 'secondary'}
                size='md'
                type='button'
                label={is_minimalistic_look ? '' : <Localize i18n_default_text='Guide' />}
                icon={<LabelPairedPresentationScreenSmRegularIcon />}
                iconPosition='start'
                onClick={() => setIsDescriptionOpened(true)}
            />
            <ActionSheet.Root
                isOpen={is_description_opened}
                onClose={() => setIsDescriptionOpened(false)}
                position='left'
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Content className='guide__wrapper'>
                        <Heading.H4 className='guide__title'>
                            <Localize i18n_default_text='Trade types' />
                        </Heading.H4>
                        <div className='guide__menu'>
                            {availableContracts.map(({ tradeType, id }) => (
                                <Chip.Selectable
                                    key={id}
                                    onChipSelect={onChipSelect}
                                    selected={id === selected_contract_type}
                                >
                                    <Text size='sm'>{tradeType}</Text>
                                </Chip.Selectable>
                            ))}
                        </div>
                        <div className='guide__contract-description'>
                            <TradeDescription
                                contract_type={selected_contract_type}
                                onDefinitionClick={onDefinitionClick}
                            />
                            <div className='guide__video-placeholder'>
                                <Text>Coolest video ever</Text>
                            </div>
                        </div>
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        primaryAction={{
                            content: <Localize i18n_default_text='Got it' />,
                            onAction: () => setIsDescriptionOpened(false),
                        }}
                        className='guide__button'
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
            {selected_definition && (
                <Definition definition={selected_definition} onClose={() => setSelectedDefinition('')} />
            )}
        </React.Fragment>
    );
};

export default Guide;
