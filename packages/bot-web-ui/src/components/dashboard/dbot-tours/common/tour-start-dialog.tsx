import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from '../../../../stores/useDBotStore';
import { bot_builder_tour_header, onboarding_tour_header, tourDialogAction, tourDialogInfo } from '../config';
import { active_tour, setTourSettings } from '../utils';

const TourStartDialog = observer(() => {
    const { dashboard } = useDBotStore();
    const { active_tab, is_tour_dialog_visible, setTourDialogVisibility, setActiveTour, setShowMobileTourDialog } =
        dashboard;

    const is_mobile = isMobile();
    const tour_token = active_tab === 0 ? 'onboard_tour_token' : 'bot_builder_token';
    const toggleTour = () => {
        if (is_mobile) setShowMobileTourDialog(false);
        setTourDialogVisibility(false);
        setActiveTour('');
        setTourSettings(new Date().getTime(), tour_token);
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
        setActiveTour(active_tour[active_tab]);
        if (is_mobile) setShowMobileTourDialog(false);
        setTourDialogVisibility(false);
        setTourSettings(new Date().getTime(), tour_token);
    };
    const header_text_size = is_mobile ? 'xs' : 's';
    const content_text_size = is_mobile ? 'xxs' : 'xs';

    const tour_headers = active_tab === 0 ? onboarding_tour_header : bot_builder_tour_header;
    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour()}
                confirm_button_text={localize('Start')}
                onConfirm={onHandleConfirm}
                is_mobile_full_width
                className={'dc-dialog tour-dialog'}
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
