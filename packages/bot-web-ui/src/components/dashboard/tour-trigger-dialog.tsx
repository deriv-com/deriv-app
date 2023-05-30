import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { tour_type, setTourSettings, tour_status_ended } from './joyride-config';

type TTourTriggrerDialog = {
    active_tab: number;
    has_tour_ended: boolean;
    is_tour_dialog_visible: boolean;
    setTourDialogVisibility: (param: boolean) => void;
    toggleOnConfirm: (active_tab: number, value: boolean) => void;
};

const TourTriggrerDialog = ({
    active_tab,
    has_tour_ended,
    is_tour_dialog_visible,
    setTourDialogVisibility,
    toggleOnConfirm,
}: TTourTriggrerDialog) => {
    const is_mobile = isMobile();

    const toggleTour = (value: boolean, type: string) => {
        if (tour_type.key === 'onboard_tour') {
            if (type === 'onConfirm') {
                toggleOnConfirm(active_tab, value);
            } else {
                setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
            }
            tour_type.key = 'onboard_tour';
        } else if (tour_type.key === 'bot_builder') {
            if (type === 'onConfirm') {
                toggleOnConfirm(active_tab, value);
            } else {
                setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
            }
            tour_type.key = 'bot_builder';
        }
        setTourDialogVisibility(false);
    };

    const dashboardTourContent = () => {
        if (!has_tour_ended) {
            return (
                <Localize
                    key={0}
                    i18n_default_text={'Hi! Hit <0>Start</0> for a quick tour to help you get started.'}
                    components={[<strong key={0} />]}
                />
            );
        }
        return (
            <Localize key={0} i18n_default_text={'If yes, go to <0>Tutorials</0>.'} components={[<strong key={0} />]} />
        );
    };

    const getTourHeaders = (tour_check: boolean, tab_id: number) => {
        let text;
        if (!tour_check) {
            if (tab_id === 1) text = localize(is_mobile ? 'Bot Builder guide' : "Let's build a Bot!");
            else text = localize('Get started on DBot');
        } else if (tab_id === 1) text = localize('Congratulations');
        else text = localize('Want to retake the tour?');
        return text;
    };

    const getTourContent = (type: string) => {
        return (
            <>
                {type === 'header' && getTourHeaders(has_tour_ended, active_tab)}
                {type === 'content' && active_tab === 0 && dashboardTourContent()}
                {type === 'content' &&
                    active_tab === 1 &&
                    (!has_tour_ended ? (
                        <>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={
                                        is_mobile
                                            ? 'Here’s a quick guide on how to use DBot on the go.'
                                            : 'Learn how to build your bot from scratch using a simple strategy.'
                                    }
                                />
                            </div>
                            <div className='dc-dialog__content__description__text'>
                                <Localize
                                    key={0}
                                    i18n_default_text={
                                        is_mobile
                                            ? 'You can import a bot from your mobile device or from Google drive, see a preview in the bot builder, and start trading by running the bot.'
                                            : 'Hit the <0>Start</0> button to begin and follow the tutorial.'
                                    }
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
                                    i18n_default_text={'Now, <0>run the bot</0> to test out the strategy.'}
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

    const onHandleConfirm = React.useCallback(() => {
        const status = tour_status_ended.key === 'finished';
        toggleTour(status ? false : !has_tour_ended, 'onConfirm');
        tour_status_ended.key = '';
        return status ? tour_status_ended.key : null;
    }, [has_tour_ended, active_tab]);

    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour(false, 'onCancel')}
                confirm_button_text={has_tour_ended ? confirm_button : localize('Start')}
                onConfirm={onHandleConfirm}
                is_mobile_full_width
                className={classNames('dc-dialog', {
                    'tour-dialog': active_tab === 0 || active_tab === 1,
                    'tour-dialog--end': (active_tab === 0 || active_tab === 1) && has_tour_ended,
                })}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent' size={is_mobile ? 'xs' : 's'}>
                        {is_tour_dialog_visible && getTourContent('header')}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text size={is_mobile ? 'xxs' : 's'} color='prominent'>
                        {is_tour_dialog_visible && getTourContent('content')}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    active_tab: dashboard.active_tab,
    has_tour_ended: dashboard.has_tour_ended,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    toggleOnConfirm: dashboard.toggleOnConfirm,
}))(TourTriggrerDialog);
