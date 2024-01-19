import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { Modal } from '../../../../components/Modal';
import { getCFDContents, getOptionsContents } from '../../../../constants/regulators-modal-content';
import Row from './Row';

const RegulationModal = () => (
    <Modal className='w-full md:max-w-[743px]'>
        <Modal.Header title='Non-EU and EU regulations' />
        <Modal.Content className='p-800 md:p-1200'>
            <table className='table-auto min-w-[457px] md:min-w-[695px] border-75 border-system-light-active-background border-solid'>
                <thead>
                    <tr>
                        <th className='sticky bg-system-light-primary-background inset-y-50 start-50 min-h-2000' />
                        <th className='border-solid p-500 min-h-2000 border-75 border-system-light-active-background'>
                            <Text size='sm' weight='bold'>
                                Non-EU regulation
                            </Text>
                        </th>
                        <th className='border-solid p-500 min-h-2000 border-75 border-system-light-active-background'>
                            <Text size='sm' weight='bold'>
                                EU regulation
                            </Text>
                        </th>
                    </tr>
                </thead>
                <tbody className=''>
                    {getCFDContents().map(row => (
                        <Row key={row.id} {...row} />
                    ))}
                    {getOptionsContents().map(row => (
                        <Row key={row.id} {...row} />
                    ))}
                </tbody>
            </table>
        </Modal.Content>
    </Modal>
);

export default RegulationModal;
