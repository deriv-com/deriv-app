import React from 'react';
import { Button, Modal, Text } from '@deriv-com/ui';
import { StarRating } from '@/components';

const RatingModal = () => {
    return (
        <Modal className='w-[44rem]' isOpen={false}>
            <Modal.Header hideBorder hideCloseIcon>
                <Text size='sm' weight='bold'>
                    How would you rate this transaction?
                </Text>
            </Modal.Header>
            <Modal.Body className='px-[2.4rem] py-[0.8rem]'>
                <StarRating ratingValue={5} starsScale={1.5} />
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button className='border-2' color='black' size='lg' textSize='sm' variant='outlined'>
                    Skip
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RatingModal;
