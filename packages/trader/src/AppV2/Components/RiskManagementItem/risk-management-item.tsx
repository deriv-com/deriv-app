import React from 'react';
import { ActionSheet, Text, TextField, TextFieldWithSteppers, ToggleSwitch } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import RiskManagementInfoModal from '../RiskManagementInfoModal';
import DealCancellationRemainingTime from '../DealCancellationRemainingTime/deal-cancellation-remaining-time';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import { CONTRACT_TYPES, isAccumulatorContract, isValidToCancel } from '@deriv/shared';

type RiskManagementItemProps = {
    label: React.ReactNode;
    modal_body_content: React.ReactNode;
    is_deal_cancellation?: boolean;
    value?: number | null;
    type?: string;
};

const RiskManagementItem = observer(
    ({ label, modal_body_content, is_deal_cancellation = false, value, type }: RiskManagementItemProps) => {
        const [isToggleOn, setIsToggleOn] = React.useState(Boolean(value));
        const [isSheetOpen, setIsSheetOpen] = React.useState(false);
        const [isEnabled, setIsEnabled] = React.useState(false);
        const [stepperValue, setStepperValue] = React.useState(0);
        const { contract_info, contract } = useContractDetails();
        const { contract_type, currency } = contract_info;
        const { validation_errors, updateLimitOrder, clearContractUpdateConfigValues } = contract;
        const is_valid_to_cancel = isValidToCancel(contract_info);
        const is_accumulator = isAccumulatorContract(contract_type);

        React.useEffect(() => {
            if (value) {
                setStepperValue(value);
                setIsToggleOn(Boolean(value));
            }
            return () => clearContractUpdateConfigValues();
        }, [clearContractUpdateConfigValues, value]);

        const isDealCancellation = is_valid_to_cancel;
        const finalValue = Math.abs(value as number);

        const errorKey = `contract_update_${type}` as 'contract_update_stop_loss' | 'contract_update_take_profit';
        const errorMessage = validation_errors[errorKey]?.[0] ?? '';

        const messageForMultiplier =
            is_valid_to_cancel && !is_deal_cancellation ? (
                <Localize i18n_default_text='Take profit and stop loss are unavailable while deal cancellation is enabled.' />
            ) : null;

        const info_message = {
            [CONTRACT_TYPES.ACCUMULATOR]: (
                <Localize i18n_default_text='Take profit can’t be adjusted for ongoing accumulator contracts.' />
            ),
            [CONTRACT_TYPES.MULTIPLIER.UP]: messageForMultiplier,
            [CONTRACT_TYPES.MULTIPLIER.DOWN]: messageForMultiplier,
        };

        const onChange = (
            e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: number | string | boolean } }
        ) => {
            const { value } = e.target;
            setStepperValue(value as number);
            contract.onChange?.({
                name: `contract_update_${type}`,
                value,
            });
        };

        const handleToggleSwitch = (value: boolean) => {
            clearContractUpdateConfigValues();
            if (value) {
                setIsSheetOpen(true);
                setStepperValue(0);
                setIsEnabled(true);
            } else {
                contract.onChange?.({
                    name: `has_contract_update_${type}`,
                    value,
                });
                updateLimitOrder();
                setIsToggleOn(!isToggleOn);
            }
        };

        const onSave = () => {
            if (isEnabled) {
                contract.onChange?.({
                    name: `has_contract_update_${type}`,
                    value: true,
                });
                setIsEnabled(false);
            }
            updateLimitOrder();
        };
        return (
            <div className='risk-management-item__container'>
                <div className='risk-management-item'>
                    <span className='risk-management-item__title'>
                        <Text size='sm'>{label}</Text>
                        <RiskManagementInfoModal
                            header_content={label}
                            body_content={modal_body_content}
                            info_message={info_message[contract_type as keyof typeof info_message] || ''}
                        />
                    </span>
                    {!is_deal_cancellation &&
                        (is_accumulator ? (
                            <Text size='sm'>
                                {finalValue} {currency}
                            </Text>
                        ) : (
                            <ToggleSwitch
                                disabled={isDealCancellation}
                                checked={isToggleOn}
                                onChange={handleToggleSwitch}
                            />
                        ))}
                    {is_valid_to_cancel && is_deal_cancellation && <DealCancellationRemainingTime />}
                </div>
                {!is_accumulator && isToggleOn && (
                    <TextField
                        variant='fill'
                        inputSize='md'
                        disabled={isSheetOpen}
                        textAlignment='center'
                        value={`${finalValue.toFixed(2)} ${currency}`}
                        onClick={() => {
                            clearContractUpdateConfigValues();
                            setStepperValue(finalValue);
                            setIsSheetOpen(true);
                        }}
                        onFocus={() => setIsSheetOpen(true)}
                    />
                )}
                <ActionSheet.Root
                    expandable
                    isOpen={isSheetOpen}
                    position='left'
                    onClose={() => {
                        setIsEnabled(false);
                        setIsSheetOpen(false);
                    }}
                >
                    <ActionSheet.Portal>
                        <ActionSheet.Header title={label} />
                        <ActionSheet.Content>
                            {isSheetOpen && (
                                <TextFieldWithSteppers
                                    variant='fill'
                                    inputSize='md'
                                    textAlignment='center'
                                    status={errorMessage ? 'error' : 'neutral'}
                                    name={type}
                                    unitRight={currency}
                                    value={Math.abs(stepperValue)}
                                    onChange={onChange}
                                    decimals={0}
                                    message={errorMessage}
                                />
                            )}
                        </ActionSheet.Content>
                        <ActionSheet.Footer
                            isPrimaryButtonDisabled={!!errorMessage || finalValue == stepperValue}
                            shouldCloseOnPrimaryButtonClick
                            primaryAction={{
                                content: <Localize i18n_default_text='Save' />,
                                onAction: onSave,
                            }}
                        />
                    </ActionSheet.Portal>
                </ActionSheet.Root>
            </div>
        );
    }
);
export default RiskManagementItem;
