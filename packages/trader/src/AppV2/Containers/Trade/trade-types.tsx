import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Chip, Text } from '@deriv-com/quill-ui';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';

type TTemporaryTradeTypesProps = {
    onTradeTypeSelect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    trade_types: ReturnType<typeof getTradeTypesList>;
} & Pick<ReturnType<typeof useTraderStore>, 'contract_type'>;

const TemporaryTradeTypes = ({ contract_type, onTradeTypeSelect, trade_types }: TTemporaryTradeTypesProps) => {
    const isTradeTypeSelected = (value: string) =>
        [contract_type, value].every(type => type.startsWith('vanilla')) ||
        [contract_type, value].every(type => type.startsWith('turbos')) ||
        [contract_type, value].every(type => type.startsWith('rise_fall')) ||
        contract_type === value;
    return (
        <div className='trade__trade-types'>
            {trade_types.map(({ text, value }) => (
                <Chip.Selectable key={value} onChipSelect={onTradeTypeSelect} selected={isTradeTypeSelected(value)}>
                    <Text size='sm'>{text}</Text>
                </Chip.Selectable>
            ))}
        </div>
    );
};

export default React.memo(TemporaryTradeTypes);
