import React from 'react';
import classNames from 'classnames';
import { Dialog, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from '../../../../stores/useDBotStore';
import { setTourSettings, tour_type } from '../utils';

const TourStartDialog = observer(() => {
    const { dashboard } = useDBotStore();
    const {
        active_tab,
        has_tour_ended,
        is_tour_dialog_visible,
        setTourDialogVisibility,
        toggleOnConfirm,
        setBotBuilderTourState,
        setOnBoardTourRunState,
        setTourActive,
    } = dashboard;

    const is_mobile = isMobile();

    const toggleTour = (value: boolean, type: string) => {
        const current_tour_type_key = tour_type.key;

        if (current_tour_type_key === 'onboard_tour' || current_tour_type_key === 'bot_builder') {
            if (type === 'onConfirm') {
                toggleOnConfirm(active_tab, value);
            } else {
                setTourSettings(new Date().getTime(), `${current_tour_type_key}_token`);
            }
        }
        setTourDialogVisibility(false);
    };

    const getTourHeaders = () => {
        if (active_tab === DBOT_TABS.BOTBUILDER) {
            return is_mobile ? localize('Bot Builder guide') : localize("Let's build a Bot!");
        }
        return localize('Get started on Deriv Bot');
    };

    const getTourContent = () => {
        return (
            <>
                {active_tab === DBOT_TABS.DASHBOARD ? (
                    <Localize
                        key={0}
                        i18n_default_text='Hi! Hit <0>Start</0> for a quick tour.'
                        components={[<strong key={0} />]}
                    />
                ) : (
                    <>
                        <div className='dc-dialog__content__description__text'>
                            <Localize key={0} i18n_default_text={tourDialogInfo} />
                        </div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize key={0} i18n_default_text={tourDialogAction} components={[<strong key={0} />]} />
                        </div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Note: You can also find this tutorial in the <0>Tutorials</0> tab.'}
                                components={[<strong key={0} />]}
                            />
                        </div>
                    </>
                )}
            </>
        );
    };

    const tourDialogInfo = is_mobile
        ? localize('Here’s a quick guide on how to use Deriv Bot on the go.')
        : localize('Learn how to build your bot from scratch using a simple strategy.');

    const tourDialogAction = is_mobile
        ? localize(
              'You can import a bot from your mobile device or from Google drive, see a preview in the bot builder, and start trading by running the bot.'
          )
        : localize('Hit the <0>Start</0> button to begin and follow the tutorial.');

    const onHandleConfirm = () => {
        if (active_tab === DBOT_TABS.DASHBOARD) {
            setTourActive(true);
            setOnBoardTourRunState(true);
        } else {
            setBotBuilderTourState(true);
        }
        setTourDialogVisibility(false);
    };

    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour(false, 'onCancel')}
                confirm_button_text={localize('Start')}
                onConfirm={onHandleConfirm}
                is_mobile_full_width
                className={classNames('dc-dialog tour-dialog', {
                    'tour-dialog--end': has_tour_ended,
                })}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent' size={is_mobile ? 'xs' : 's'}>
                        {getTourHeaders()}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text size={is_mobile ? 'xxs' : 'xs'} color='prominent'>
                        {getTourContent()}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default TourStartDialog;
