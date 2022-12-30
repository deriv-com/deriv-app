import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';
import { tour_type, setTourSettings, tour_status_ended } from './joyride-config';

type TTourTriggrerDialog = {
    active_tab: number;
    is_tour_dialog_visible: boolean;
    has_tour_ended: boolean;
    setHasTourEnded: (param: boolean) => void;
    setTourActive: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    setBotBuilderTourState: (param: boolean) => void;
};

const TourTriggrerDialog = ({
    active_tab,
    is_tour_dialog_visible,
    has_tour_ended,
    setTourDialogVisibility,
    setBotBuilderTourState,
    setOnBoardTourRunState,
    setTourActive,
    setHasTourEnded,
}: TTourTriggrerDialog) => {
    const toggleTour = (value: boolean, type: string) => {
        if (tour_type.key === 'onboard_tour') {
            if (type === 'onConfirm') {
                if (active_tab === 0) {
                    setTourActive(value);
                    setOnBoardTourRunState(value);
                } else {
                    setBotBuilderTourState(value);
                }
                setHasTourEnded(value);
            } else {
                setBotBuilderTourState(value);
            }
            tour_type.key = 'onboard_tour';
        } else if (tour_type.key === 'bot_builder') {
            if (type === 'onConfirm') {
                if (active_tab === 0) {
                    setTourActive(value);
                    setOnBoardTourRunState(value);
                } else {
                    setBotBuilderTourState(value);
                }
                setHasTourEnded(value);
            } else {
                setTourSettings(new Date().getTime(), 'bot_builder_token');
            }
            tour_type.key = 'bot_builder';
        }
        setTourDialogVisibility(false);
    };

    const getTourContent = (type: string) => {
        return (
            <>
                {type === 'content' && active_tab === 0 ? (
                    !has_tour_ended ? (
                        <Localize
                            key={0}
                            i18n_default_text={'Hi! Hit <0>Start</0> for a quick tour to help you get started.'}
                            components={[<strong key={0} />]}
                        />
                    ) : (
                        <Localize
                            key={0}
                            i18n_default_text={'If yes, go to <0>Tutorials</0>.'}
                            components={[<strong key={0} />]}
                        />
                    )
                ) : (
                    <>
                        {type === 'header' &&
                            !has_tour_ended &&
                            (active_tab === 1 ? localize("Let's build a Bot!") : localize('Get started on DBot'))}
                        {type === 'header' &&
                            has_tour_ended &&
                            (active_tab === 1 ? localize('Congratulations!') : localize('Want to retake the tour?'))}
                    </>
                )}
                {type === 'content' &&
                    active_tab === 1 &&
                    (!has_tour_ended ? (
                        <>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={
                                        'Learn how to build your bot from scratch using a simple strategy.'
                                    }
                                />
                            </div>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={'Hit the <0>Start</0> button to begin and follow the tutorial.'}
                                    components={[<strong key={0} />]}
                                />
                            </div>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={
                                        'Note: You can also find this tutorial in the <0>Tutorials</0> tab.'
                                    }
                                    components={[<strong key={0} />]}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={
                                        'You have successfully created your bot using a simple strategy.'
                                    }
                                />
                            </div>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={'Now, <0>run the bot</0> to test out the stategy.'}
                                    components={[<strong key={0} />]}
                                />
                            </div>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={
                                        'Note: If you wish to learn more about the Bot Builder, you can proceed to the <0>Tutorials</0> tab.'
                                    }
                                    components={[<strong key={0} />]}
                                />
                            </div>
                        </>
                    ))}
            </>
        );
    };
    const confirm_button = active_tab === 0 ? localize('Got it, thanks!') : localize('OK');
    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour(false, 'onCancel')}
                confirm_button_text={
                    has_tour_ended
                        ? active_tab === 0
                            ? localize('Got it, thanks!')
                            : localize('OK')
                        : localize('Start')
                }
                onConfirm={() => {
                    const status = tour_status_ended.key === 'finished';
                    toggleTour(status ? false : !has_tour_ended, 'onConfirm');
                    return status ? (tour_status_ended.key = '') : null;
                }}
                is_mobile_full_width
                className={classNames('dc-dialog', {
                    'tour-dialog': active_tab === 0 || active_tab === 1,
                    'tour-dialog--end': (active_tab === 0 || active_tab === 1) && has_tour_ended,
                })}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent'>
                        {is_tour_dialog_visible && getTourContent('header')}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text color='prominent'>{is_tour_dialog_visible && getTourContent('content')}</Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    active_tab: dashboard.active_tab,
    setTourActive: dashboard.setTourActive,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    has_tour_ended: dashboard.has_tour_ended,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setHasTourEnded: dashboard.setHasTourEnded,
}))(TourTriggrerDialog);
