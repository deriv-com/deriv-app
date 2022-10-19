import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TourTriggrerDialog = {
    setTourActive: (param: boolean) => void;
    is_tour_dialog_visible: boolean;
    setTourDialogVisibility: (param: boolean) => void;
};

const TourTriggrerDialog = ({ setTourActive, is_tour_dialog_visible, setTourDialogVisibility }: TourTriggrerDialog) => {
    const handleChange = () => {
        setTourActive(true);
        setTourDialogVisibility(false);
    };
    const closTourChange = () => {
        setTourDialogVisibility(false);
    };
    return (
        <div>
            <Dialog
                //title={dialog_options.title}
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={closTourChange}
                confirm_button_text={localize('Start')}
                onConfirm={handleChange}
                is_mobile_full_width
                className={'dc-dialog onboarding-tour-guide'}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent' size='s'>
                        Get started on DBot
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text color='prominent' size='s'>
                        Hi [first name]! Hit <strong>Start</strong> for a quick tour to help you get started.
                    </Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    setTourActive: dashboard.setTourActive,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
}))(TourTriggrerDialog);
