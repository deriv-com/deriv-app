import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { Modal } from '../../../../components/Modal';
import { getCFDContents, getOptionsContents } from '../../../../constants/regulators-modal-content';
import Row from './Row';

const RegulationModal = () => (
    <Modal className='w-full md:max-w-[743px]'>
        <Modal.Header title='Non-EU and EU regulations' />
        <Modal.Content className='p-800 md:p-1200'>
            {/* <table className='regulators-compare-table__table'> */}
            <table className='table-auto'>
                <thead>
                    <tr>
                        <th />
                        <th className='p-500'>
                            <Text size='sm' weight='bold'>
                                Non-EU regulation
                            </Text>
                        </th>
                        <th className='p-500'>
                            <Text size='sm' weight='bold'>
                                EU regulation
                            </Text>
                        </th>
                    </tr>
                </thead>
                <tbody>
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
