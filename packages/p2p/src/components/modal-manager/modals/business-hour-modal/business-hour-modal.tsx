import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Localize } from 'Components/i18next';
import SeparatorContainerLine from 'Components/separator-container-line';
import './business-hour-modal.scss';

const business_days = [
    {
        day: <Localize i18n_default_text='Monday' />,
        time: <Localize i18n_default_text='Open 24 hours' />,
    },
    {
        day: <Localize i18n_default_text='Tuesday' />,
        time: <Localize i18n_default_text='Open 24 hours' />,
    },
    {
        day: <Localize i18n_default_text='Wednesday' />,
        time: <Localize i18n_default_text='10:30 am - 11:30 pm' />,
    },
    {
        day: <Localize i18n_default_text='Thursday' />,
        time: <Localize i18n_default_text='10:30 am - 11:30 pm' />,
    },
    {
        day: <Localize i18n_default_text='Friday' />,
        time: <Localize i18n_default_text='9:00 am - 9:00 pm' />,
    },
    {
        day: <Localize i18n_default_text='Saturday' />,
        time: <Localize i18n_default_text='9:00 am - 4:30 pm' />,
    },
    {
        day: <Localize i18n_default_text='Sunday' />,
        time: <Localize i18n_default_text='Closed' />,
    },
];

const BusinessHourModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const today = new Date().getDay();

    return (
        <Modal
            className='business-hour-modal'
            has_close_icon
            is_open={is_modal_open}
            title={
                <Text weight='bold'>
                    <Localize i18n_default_text='Business hour' />
                </Text>
            }
            toggleModal={() => hideModal()}
            width='44rem'
        >
            <Modal.Body className='business-hour-modal__body'>
                <Text as='p' size='xs'>
                    <Localize i18n_default_text='You will only accept orders during business hours, and your ads will not be available outside of these hours.' />
                </Text>
                <SeparatorContainerLine className='business-hour-modal__body__separator' />
                <div className='business-hour-modal__body__days'>
                    {business_days.map((day, idx) => {
                        const text_weight = idx === today - 1 ? 'bold' : 'normal';

                        return (
                            <div key={idx} className='business-hour-modal__body__days-hours'>
                                <Text
                                    as='p'
                                    className='business-hour-modal__body__days-hours-day'
                                    size='xs'
                                    weight={text_weight}
                                >
                                    {day.day}
                                </Text>
                                <Text as='p' size='xs' weight={text_weight}>
                                    {day.time}
                                </Text>
                            </div>
                        );
                    })}
                </div>
                <Text as='p' size='xxs'>
                    <Localize i18n_default_text='*Some ads may not be viewable to the counterparty before closing hour due to order processing limits.' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='business-hour-modal__footer'>
                <Button secondary onClick={hideModal} large>
                    <Text weight='bold'>
                        <Localize i18n_default_text='Edit' />
                    </Text>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BusinessHourModal;
