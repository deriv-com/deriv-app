import React from 'react';
import { formatDate, formatTime } from '@deriv/shared';
import { Text } from '@deriv/components';

type ContractAuditItemProps = {
    icon: unknown;
    label: string;
    value: unknown | number | string;
    value2: unknown | number | string;
};

const ContractAuditItem = ({ icon, id, label, timestamp, value, value2 }: ContractAuditItemProps) => (
    <div id={id} className='contract-audit__grid'>
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
