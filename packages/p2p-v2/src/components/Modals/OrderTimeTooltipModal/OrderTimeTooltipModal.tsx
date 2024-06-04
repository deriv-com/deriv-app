import React, { MouseEventHandler } from 'react';
import { ORDER_TIME_INFO_MESSAGE } from '@/constants';
import { Button, Modal, Text } from '@deriv-com/ui';

type TOrderTimeTooltipModalProps = {
    isModalOpen: boolean;
    onRequestClose: MouseEventHandler<HTMLButtonElement>;
};

const OrderTimeTooltipModal = ({ isModalOpen, onRequestClose }: TOrderTimeTooltipModalProps) => {
    return (
        <Modal ariaHideApp={false} className='h-fit rounded-[8px] p-[2.4rem] pb-0 w-[32.8rem]' isOpen={isModalOpen}>
            <Modal.Body>
                <Text color='prominent' size='sm'>
                    {ORDER_TIME_INFO_MESSAGE}
                </Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderTimeTooltipModal;
