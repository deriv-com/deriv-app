import React from 'react';
import classNames from 'classnames';
import { Dialog, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from '../../../../stores/useDBotStore';
import { bot_builder_tour_header, onboarding_tour_header, tourDialogAction, tourDialogInfo } from '../config';
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
    const current_tour_type_key = tour_type?.key;
    const toggleTour = (value: boolean, type: string) => {
        if (type === 'onConfirm') toggleOnConfirm(active_tab, value);
        setTourSettings(new Date().getTime(), `${current_tour_type_key}_token`);
        setTourDialogVisibility(false);
    };

    const onboard_tour = active_tab === DBOT_TABS.DASHBOARD;

    const getTourContent = () => {
        return (
            <>
                {onboard_tour ? (
                    <Localize
                        key={0}
                        i18n_default_text='Hi! Hit <0>Start</0> for a quick tour.'
                        components={[<strong key={0} />]}
                    />
                ) : (
                    <>
                        <div className='dc-dialog__content__description__text'>{tourDialogInfo}</div>
                        <div className='dc-dialog__content__description__text'>{tourDialogAction}</div>
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

    const onHandleConfirm = () => {
        setTourActive(true);
        if (onboard_tour) setOnBoardTourRunState(true);
        else setBotBuilderTourState(true);
        setTourDialogVisibility(false);
    };
    const header_text_size = is_mobile ? 'xs' : 's';
    const content_text_size = is_mobile ? 'xxs' : 'xs';

    const tour_headers = active_tab === 0 ? onboarding_tour_header : bot_builder_tour_header;

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
                    <Text weight='bold' color='prominent' size={header_text_size}>
                        {tour_headers}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text size={content_text_size} color='prominent'>
                        {getTourContent()}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default TourStartDialog;
