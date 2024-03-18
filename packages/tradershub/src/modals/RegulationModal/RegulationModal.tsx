import React from 'react';
import { getCFDContents, getOptionsContents } from '@/constants';
import { useQueryParams } from '@/hooks';
import { Modal, Text } from '@deriv-com/ui';
import Row from './Row';

const RegulationModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal className='w-full md:max-w-[743px]' isOpen={isModalOpen('RegulationModal')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal}>
                <Text size='sm' weight='bold'>
                    Regulation
                </Text>
            </Modal.Header>
            <Modal.Body className='p-16 md:p-24'>
                <div className='overflow-x-scroll'>
                    <table className='border-separate table-auto min-w-[457px] md:min-w-[695px] bg-system-light-primary-background'>
                        <thead>
                            <tr className=''>
                                <th className='sticky z-10 border-solid border-r-1 border-b-1 border-system-light-active-background start-50 min-h-40 bg-system-light-primary-background' />
                                <th className='p-10 border-solid min-h-40 border-r-1 border-y-1 border-system-light-active-background'>
                                    <Text size='sm' weight='bold'>
                                        Non-EU regulation
                                    </Text>
                                </th>
                                <th className='p-10 border-solid min-h-40 border-r-1 border-y-1 border-system-light-active-background'>
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
            </Modal.Body>
        </Modal>
    );
};

export default RegulationModal;
