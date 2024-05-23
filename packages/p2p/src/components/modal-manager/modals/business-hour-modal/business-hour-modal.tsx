import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Localize } from 'Components/i18next';
import SeparatorContainerLine from 'Components/separator-container-line';
import BusinessHourModalEdit from './business-hour-modal-edit';
import './business-hour-modal.scss';

const business_days = [
    {
        day: <Localize i18n_default_text='Monday' />,
        short_day: <Localize i18n_default_text='M' />,
        time: <Localize i18n_default_text='Open 24 hours' />,
        start_time: '12:00 am',
        end_time: '12:00 am',
        value: 'monday',
    },
    {
        day: <Localize i18n_default_text='Tuesday' />,
        short_day: <Localize i18n_default_text='T' />,
        time: <Localize i18n_default_text='Open 24 hours' />,
        start_time: '12:00 am',
        end_time: '12:00 am',
        value: 'tuesday',
    },
    {
        day: <Localize i18n_default_text='Wednesday' />,
        short_day: <Localize i18n_default_text='W' />,
        time: <Localize i18n_default_text='10:30 am - 11:30 pm' />,
        start_time: '10:30 am',
        end_time: '11:30 pm',
        value: 'wednesday',
    },
    {
        day: <Localize i18n_default_text='Thursday' />,
        short_day: <Localize i18n_default_text='T' />,
        time: <Localize i18n_default_text='10:30 am - 11:30 pm' />,
        start_time: '10:30 am',
        end_time: '11:30 pm',
        value: 'thursday',
    },
    {
        day: <Localize i18n_default_text='Friday' />,
        short_day: <Localize i18n_default_text='F' />,
        time: <Localize i18n_default_text='9:00 am - 9:00 pm' />,
        start_time: '09:00 am',
        end_time: '09:00 pm',
        value: 'friday',
    },
    {
        day: <Localize i18n_default_text='Saturday' />,
        short_day: <Localize i18n_default_text='S' />,
        time: <Localize i18n_default_text='9:00 am - 4:30 pm' />,
        start_time: '09:00 am',
        end_time: '04:30 pm',
        value: 'saturday',
    },
    {
        day: <Localize i18n_default_text='Sunday' />,
        short_day: <Localize i18n_default_text='S' />,
        time: <Localize i18n_default_text='Closed' />,
        value: 'sunday',
    },
];

const BusinessHourModal = () => {
    const [show_edit, setShowEdit] = React.useState(true);
    const { hideModal, is_modal_open } = useModalManagerContext();
    const today = new Date().getDay();

    return (
        <Modal
            className='business-hour-modal'
            has_close_icon
            is_open={is_modal_open}
            title={
                <Text weight='bold'>
                    {show_edit ? (
                        <Localize i18n_default_text='Edit business hour' />
                    ) : (
                        <Localize i18n_default_text='Business hour' />
                    )}
                </Text>
            }
            toggleModal={() => hideModal()}
            width='44rem'
        >
            <Modal.Body className='business-hour-modal__body'>
                {show_edit ? (
                    <BusinessHourModalEdit data={business_days} />
                ) : (
                    <>
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
                    </>
                )}
            </Modal.Body>
            <Modal.Footer className='business-hour-modal__footer'>
                {show_edit ? (
                    <div className='business-hour-modal__footer-buttons'>
                        <Button secondary onClick={() => setShowEdit(true)} large>
                            <Localize i18n_default_text='Cancel' />
                        </Button>
                        <Button primary large>
                            <Localize i18n_default_text='Edit' />
                        </Button>
                    </div>
                ) : (
                    <Button secondary onClick={() => setShowEdit(true)} large>
                        <Localize i18n_default_text='Edit' />
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default BusinessHourModal;
