import React from 'react';
import { MobileFullPageModal, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import {
    convertToGMTWithOverflow,
    convertToMinutesRange,
    formatTime,
    getDaysOfWeek,
    isTimeEdited,
    splitTimeRange,
} from 'Utils/business-hours';
import BusinessHourModalEdit from './business-hour-modal-edit';
import BusinessHourModalFooter from './business-hour-modal-footer';
import BusinessHourModalMain from './business-hour-modal-main';
import './business-hour-modal.scss';

type TTimeRange = {
    start_min: number | null;
    end_min: number | null;
};

type TBusinessDay = {
    day: string;
    short_day: string;
    time: JSX.Element;
    start_time: string | null;
    end_time: string | null;
    value: string;
};

const HeaderRenderer = ({ show_edit }: { show_edit: boolean }) => (
    <Text weight='bold'>
        {show_edit ? (
            <Localize i18n_default_text='Edit business hour' />
        ) : (
            <Localize i18n_default_text='Business hours' />
        )}
    </Text>
);

const BusinessHourModal = () => {
    const { isMobile } = useDevice();
    const { hideModal, is_modal_open, showModal, useSavedState } = useModalManagerContext();
    const { my_profile_store } = useStores();
    const { business_hours, setEditedBusinessHours, edited_business_hours } = my_profile_store;

    const [show_edit, setShowEdit] = useSavedState('show_edit', false);
    const [is_disabled, setIsDisabled] = React.useState(true);
    const ref = React.useRef<{ getEditedData: () => void } | null>(null);

    const formatBusinessDays = (intervals: TTimeRange[]): TBusinessDay[] => {
        const daysOfWeek = getDaysOfWeek();

        return intervals.map((interval, index) => {
            const dayIndex = index % 7;
            const dayInfo = daysOfWeek[dayIndex];

            let timeLabel: JSX.Element;
            let startTime: string | null = null;
            let endTime: string | null = null;

            if (interval.start_min !== null && interval.end_min !== null) {
                startTime = formatTime(interval.start_min);
                endTime = formatTime(interval.end_min);
                if (interval.end_min - interval.start_min === 1440) {
                    timeLabel = <Localize i18n_default_text='Open 24 hours' />;
                } else {
                    timeLabel = (
                        <span>
                            {startTime} - {endTime}
                        </span>
                    );
                }
            } else {
                timeLabel = <Localize i18n_default_text='Closed' />;
            }

            return {
                day: dayInfo.label,
                short_day: dayInfo.shortLabel,
                time: timeLabel,
                start_time: startTime,
                end_time: endTime,
                value: dayInfo.value,
            };
        });
    };

    const onClickSave = () => {
        const values = ref.current?.getEditedData();
        const result = convertToMinutesRange(values ?? []).filter(
            ({ start_min, end_min }) => start_min !== null && end_min !== null
        );
        const offset = new Date().getTimezoneOffset();
        const converted_result = convertToGMTWithOverflow(result, offset).filter(
            ({ start_min, end_min }) => !(start_min === 0 && end_min === 0)
        );

        my_profile_store.handleBusinessHoursSubmit(converted_result, () => setShowEdit(false));
    };

    const getTimezoneOffset = () => {
        const offset = new Date().getTimezoneOffset();
        return offset;
    };

    const business_hours_input = formatBusinessDays(splitTimeRange(business_hours, getTimezoneOffset()));

    const onClickCancel = () => {
        const edited_data = ref.current?.getEditedData() ?? [];
        const is_edited = isTimeEdited(business_hours_input, edited_data);
        setEditedBusinessHours(edited_data);
        if (is_edited && show_edit) {
            showModal({
                key: 'AdCancelModal',
                props: {
                    cancel_text: localize('Discard'),
                    confirm_label: localize('Keep editing'),
                    message: localize('All unsaved changes to your business hours will be lost.'),
                    onConfirm: () => {
                        setEditedBusinessHours([]);
                    },
                    should_hide_all_modals: false,
                    should_restore_state: true,
                    title: localize('Discard changes?'),
                },
            });
        } else if (show_edit) {
            setShowEdit(false);
        } else {
            hideModal();
        }
    };

    if (isMobile) {
        return (
            <MobileFullPageModal
                className='business-hour-modal'
                body_className='business-hour-modal__body'
                is_modal_open={is_modal_open}
                renderPageFooterChildren={() => (
                    <BusinessHourModalFooter
                        onClickCancel={onClickCancel}
                        onClickSave={onClickSave}
                        setShowEdit={setShowEdit}
                        show_edit={show_edit}
                    />
                )}
                renderPageHeaderElement={<HeaderRenderer show_edit={show_edit} />}
                pageHeaderReturnFn={() => (show_edit ? setShowEdit(false) : hideModal())}
            >
                {show_edit ? (
                    <BusinessHourModalEdit
                        data={business_hours_input}
                        is_disabled={is_disabled}
                        ref={ref}
                        saved_details={edited_business_hours}
                        setIsDisabled={setIsDisabled}
                    />
                ) : (
                    <BusinessHourModalMain business_days={business_hours_input} />
                )}
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className='business-hour-modal'
            is_open={is_modal_open}
            has_close_icon={!show_edit}
            should_close_on_click_outside={false}
            title={<HeaderRenderer show_edit={show_edit} />}
            toggleModal={onClickCancel}
            width='44rem'
        >
            <Modal.Body className='business-hour-modal__body'>
                {show_edit ? (
                    <BusinessHourModalEdit
                        data={business_hours_input}
                        is_disabled={is_disabled}
                        ref={ref}
                        saved_details={edited_business_hours}
                        setIsDisabled={setIsDisabled}
                    />
                ) : (
                    <BusinessHourModalMain business_days={business_hours_input} />
                )}
            </Modal.Body>
            <Modal.Footer className='business-hour-modal__footer'>
                <BusinessHourModalFooter
                    is_disabled={is_disabled}
                    onClickSave={onClickSave}
                    onClickCancel={onClickCancel}
                    setShowEdit={setShowEdit}
                    show_edit={show_edit}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(BusinessHourModal);
