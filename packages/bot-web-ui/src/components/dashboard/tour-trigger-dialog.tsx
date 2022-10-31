import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TourTriggrerDialog = {
    setTourActive: (param: boolean) => void;
    is_tour_dialog_visible: boolean;
    setTourDialogVisibility: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
};

const TourTriggrerDialog = ({
    is_tour_dialog_visible,
    setTourDialogVisibility,
    setOnBoardTourRunState,
    setTourActive,
}: TourTriggrerDialog) => {
    const handleChange = () => {
        setTourActive(true);
        setOnBoardTourRunState(true);
        setTourDialogVisibility(false);
    };
    const closTourChange = () => {
        setTourDialogVisibility(false);
        setOnBoardTourRunState(false);
        setTourActive(false);
    };
    return (
        <div>
            <Dialog
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
                        {localize('Get started on DBot')}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text color='prominent' size='s'>
                        <Localize
                            key={0}
                            i18n_default_text='Hi [first name]! Hit <0>Start</0> for a quick <1>tour</1> to help you get started.'
                            components={[<strong key={1} />, <i key={2} />]}
                        />
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
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
}))(TourTriggrerDialog);
