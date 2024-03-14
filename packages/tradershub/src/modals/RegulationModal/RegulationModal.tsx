import React from 'react';
import { Modal } from '@/components';
import { getCFDContents, getOptionsContents } from '@/constants';
import { Text } from '@deriv-com/ui';
import Row from './Row';

const RegulationModal = () => (
    <Modal className='w-full md:max-w-[743px]'>
        <Modal.Header title='Non-EU and EU regulations' />
        <Modal.Content className='p-16 md:p-24'>
            <div className='overflow-x-scroll'>
                <table className='border-separate table-auto min-w-[457px] md:min-w-[695px] bg-system-light-primary-background'>
                    <thead>
                        <tr className=''>
                            <th className='sticky z-10 border-solid border-r-1 border-b-1 border-system-light-active-background start-50 min-h-40 bg-system-light-primary-background' />
                            <th className='border-solid p-10 min-h-40 border-r-1 border-y-1 border-system-light-active-background'>
                                <Text size='sm' weight='bold'>
                                    Non-EU regulation
                                </Text>
                            </th>
                            <th className='border-solid p-10 min-h-40 border-r-1 border-y-1 border-system-light-active-background'>
                                <Text size='sm' weight='bold'>
                                    EU regulation
                                </Text>
                            </th>
                        </tr>
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
        </Modal.Content>
    </Modal>
);

export default RegulationModal;
