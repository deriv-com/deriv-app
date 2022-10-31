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
    setBotBuilderTourState: (param: boolean) => void;
    active_tab: number;
};

const TourTriggrerDialog = ({
    is_tour_dialog_visible,
    setTourDialogVisibility,
    setBotBuilderTourState,
    setOnBoardTourRunState,
    setTourActive,
    active_tab,
}: TourTriggrerDialog) => {
    const handleChange = () => {
        if (active_tab === 0) {
            setTourActive(true);
            setOnBoardTourRunState(true);
        } else {
            setBotBuilderTourState(true);
        }
        setTourDialogVisibility(false);
    };
    const closeTourChange = () => {
        if (active_tab === 0) {
            setTourActive(false);
            setOnBoardTourRunState(false);
        } else {
            setBotBuilderTourState(false);
        }

        setTourDialogVisibility(false);
    };

    const getTourContent = () => {
        return (
            <>
                {active_tab === 0 && (
                    <Localize
                        key={0}
                        i18n_default_text={
                            'Hi [first name]! Hit <0>Start</0> for a quick <1>tour</1> to help you get started.'
                        }
                        components={[<strong key={1} />, <i key={2} />]}
                    />
                )}
                {active_tab === 1 && (
                    <>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Learn how to build your bot from scratch using a simple strategy.'}
                            />
                        </div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Hit the <0>Start</0> button to begin and follow the tutorial.'}
                                components={[<strong key={1} />]}
                            />
                        </div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Note: You can also find this tutorial in the <0>Tutorials</0> tab.'}
                                components={[<strong key={1} />]}
                            />
                        </div>
                    </>
                )}
            </>
        );
    };
    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={closeTourChange}
                confirm_button_text={localize('Start')}
                onConfirm={handleChange}
                is_mobile_full_width
                className={'dc-dialog onboarding-tour-guide'}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent'>
                        {active_tab === 1 ? localize("Let's build a Bot") : localize('Get started on DBot')}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text color='prominent'>{getTourContent()}</Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    active_tab: dashboard.active_tab,
    setTourActive: dashboard.setTourActive,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
}))(TourTriggrerDialog);
