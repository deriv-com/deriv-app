import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import React from 'react';
import CardWrapper from 'AppV2/Components/CardWrapper';
import { TContractInfo } from '@deriv/shared';

interface ContractInfoProps {
    contract_info: TContractInfo;
}

const PayoutInfo = ({ contract_info }: ContractInfoProps) => (
    <CardWrapper title={<Localize i18n_default_text='How do I earn a payout?' />}>
        <Text size='sm'>{contract_info?.longcode}</Text>
    </CardWrapper>
);

export default PayoutInfo;
