import React from 'react';
import { formatDate, formatTime } from '@deriv/shared';
import { Text } from '@deriv/components';

type TContractAuditItem = {
    additional_info?: React.ReactNode | string;
    icon?: React.ReactNode;
    id: string;
    label?: string | React.ReactNode;
    timestamp?: number;
    value: React.ReactNode;
    value2?: React.ReactNode;
};

const ContractAuditItem = ({ additional_info, icon, id, label, timestamp, value, value2 }: TContractAuditItem) => (
    <div id={id} className='contract-audit__grid' data-testid={id}>
        {icon && <div className='contract-audit__icon'>{icon}</div>}
        <div className='contract-audit__item'>
            <Text size='xxxs' styles={{ lineHeight: 'unset' }} className='contract-audit__label'>
                {label}
            </Text>
            <div className='contract-audit__value-wrapper'>
                <Text weight='bold' size='xxs' line_height='m' color='prominent' className='contract-audit__value'>
                    {value}
                </Text>
                {value2 && (
                    <Text weight='bold' size='xxs' line_height='m' color='prominent' className='contract-audit__value2'>
                        {value2}
                    </Text>
                )}
                {additional_info && (
                    <Text
                        size='xxxs'
                        line_height='s'
                        color='less-prominent'
                        className='contract-audit__timestamp-value'
                    >
                        {additional_info}
                    </Text>
                )}
            </div>
        </div>
        {timestamp && (
            <div className='contract-audit__timestamp'>
                <Text size='xxxs' align='right' line_height='xs' className='contract-audit__timestamp-value'>
                    {formatDate(timestamp)}
                </Text>
                <Text size='xxxs' align='right' line_height='xs' className='contract-audit__timestamp-value'>
                    {formatTime(timestamp)}
                </Text>
            </div>
        )}
    </div>
);

export default ContractAuditItem;
