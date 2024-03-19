import React from 'react';
import { getCFDContents, getOptionsContents } from '@/constants';
import { Text } from '@deriv-com/ui';
import Row from './Row';

const RegulationTitle = ['Non-EU regulation', 'EU regulation'] as const;

const RegulationTableContent = () => (
    <div className='overflow-x-scroll'>
        <table className='border-separate table-auto min-w-[457px] bg-system-light-primary-background'>
            <thead>
                <th className='sticky z-10 border-solid border-r-1 border-b-1 border-system-light-active-background start-0 min-h-40 bg-system-light-primary-background' />
                {RegulationTitle.map(title => (
                    <th
                        className='p-10 text-center border-solid min-h-40 border-r-1 border-y-1 border-system-light-active-background'
                        key={title}
                    >
                        <Text size='sm' weight='bold'>
                            {title}
                        </Text>
                    </th>
                ))}
            </thead>
            <tbody>
                {getCFDContents.map((row, idx) => (
                    <Row key={row.id} {...row} idx={idx} />
                ))}
                {getOptionsContents.map((row, idx) => (
                    <Row key={row.id} {...row} idx={idx} />
                ))}
            </tbody>
        </table>
    </div>
);

export default RegulationTableContent;
