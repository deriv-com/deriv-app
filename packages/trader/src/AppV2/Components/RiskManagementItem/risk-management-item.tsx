import React from 'react';
import { ActionSheet, Text, TextField, ToggleSwitch } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import RiskManagementInfoModal from '../RiskManagementInfoModal';
import DealCancellationRemainingTime from '../DealCancellationRemainingTime/deal-cancellation-remaining-time';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import { CONTRACT_TYPES, isAccumulatorContract, isValidToCancel } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';

type RiskManagementItemProps = {
    label: React.ReactNode;
    modal_body_content: React.ReactNode;
    validation_message?: React.ReactNode;
    is_deal_cancellation?: boolean;
};

const RiskManagementItem = observer(
    ({ label, modal_body_content, validation_message, is_deal_cancellation = false }: RiskManagementItemProps) => {
        const [toggle, setToggle] = React.useState(false);
        const [isOpen, setIsOpen] = React.useState(false);
        const dummy_boolean = false; // This will be flag from backend
        const { has_take_profit } = useTraderStore();
        const { contract_info } = useContractDetails();
        const { contract_type } = contract_info;
        const is_valid_to_cancel = isValidToCancel(contract_info);
        const is_accumulator = isAccumulatorContract(contract_type);

        const info_message = {
            [CONTRACT_TYPES.ACCUMULATOR]: (
                <Localize i18n_default_text='Take profit can’t be adjusted for ongoing accumulator contracts.' />
            ),
            [CONTRACT_TYPES.MULTIPLIER.UP || CONTRACT_TYPES.MULTIPLIER.DOWN]:
                is_valid_to_cancel && !is_deal_cancellation ? (
                    <Localize i18n_default_text='Take profit and stop loss are unavailable while deal cancellation is enabled.' />
                ) : (
                    ''
                ),
        } as const;

        return (
            <div className='risk-management-item--container'>
                <div className='risk-management-item'>
                    <span className='risk-management-item--title'>
                        <Text size='sm'>{label}</Text>
                        <RiskManagementInfoModal
                            header_content={label}
                            body_content={modal_body_content}
                            info_message={info_message[contract_type as keyof typeof info_message] || ''}
                        />
                    </span>
                    {!is_deal_cancellation &&
                        (has_take_profit && is_accumulator ? (
                            <Text size='sm'>5 USD</Text>
                        ) : (
                            <ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
                        ))}
                    {is_valid_to_cancel && is_deal_cancellation && <DealCancellationRemainingTime />}
                </div>
                {toggle && (
                    <TextField
                        variant='fill'
                        inputSize='md'
                        textAlignment='center'
                        value='5.00 USD'
                        onClick={() => setIsOpen(true)}
                        onFocus={() => setIsOpen(true)}
                    />
                )}
                <ActionSheet.Root expandable isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ActionSheet.Portal>
                        <ActionSheet.Header title={label} />
                        <ActionSheet.Content>
                            <TextField
                                variant='fill'
                                inputSize='md'
                                textAlignment='center'
                                value='5.00 USD'
                                message={validation_message}
                            />
                        </ActionSheet.Content>
                        <ActionSheet.Footer
                            shouldCloseOnPrimaryButtonClick
                            primaryAction={{
                                content: localize('Save'),
                                onAction: () => {
                                    //do the save
                                },
                            }}
                        />
                    </ActionSheet.Portal>
                </ActionSheet.Root>
            </div>
        );
    }
);
export default RiskManagementItem;
