import React from 'react';
import { ActionSheet, Heading, Chip, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { AVAILABLE_CONTRACTS, CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import TradeDescription from './Description/trade-description';

type TDescriptionModal = {
    is_open?: boolean;
    onClose: () => void;
    onChipSelect: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onTermClick: (term: string) => void;
    selected_contract_type: string;
};

const DescriptionModal = ({
    is_open,
    onClose,
    onChipSelect,
    onTermClick,
    selected_contract_type,
}: TDescriptionModal) => {
    //TODO: temporary, until we'll have ordered list, coming from contract type selection
    const order = [
        CONTRACT_LIST['RISE/FALL'],
        CONTRACT_LIST.ACCUMULATORS,
        CONTRACT_LIST.MULTIPLIERS,
        CONTRACT_LIST.VANILLAS,
        CONTRACT_LIST.TURBOS,
        CONTRACT_LIST['HIGHER/LOWER'],
        CONTRACT_LIST['TOUCH/NO TOUCH'],
        CONTRACT_LIST['MATCHES/DIFFERS'],
        CONTRACT_LIST['EVEN/ODD'],
        CONTRACT_LIST['OVER/UNDER'],
    ];

    const ordered_contract_list = [...AVAILABLE_CONTRACTS].sort(
        (a, b) => order.findIndex(item => item === a.id) - order.findIndex(item => item === b.id)
    );

    return (
        <ActionSheet.Root isOpen={is_open} onClose={onClose} position='left'>
            <ActionSheet.Portal shouldCloseOnDrag>
                <ActionSheet.Content className='guide__wrapper'>
                    <Heading.H4 className='guide__title'>
                        <Localize i18n_default_text='Trade types' />
                    </Heading.H4>
                    <div className='guide__menu'>
                        {ordered_contract_list.map(({ tradeType, id }) => (
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
                        <TradeDescription contract_type={selected_contract_type} onTermClick={onTermClick} />
                        <div className='guide__video-placeholder'>
                            <Text>Coolest video ever</Text>
                        </div>
                    </div>
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Got it' />,
                        onAction: onClose,
                    }}
                    className='guide__button'
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
};

export default DescriptionModal;
