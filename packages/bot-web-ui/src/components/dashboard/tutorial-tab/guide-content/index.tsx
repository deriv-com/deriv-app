import React from 'react';
import classNames from 'classnames';
import { Dialog, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { removeKeyValue } from 'Utils/settings';
import { useDBotStore } from 'Stores/useDBotStore';

type TGuideList = {
    content?: string;
    id: number;
    src?: string;
    subtype?: string;
    type: string;
    url?: string;
    imageclass?: string;
};

type TGuideContent = {
    guide_list: TGuideList[];
};

const GuideContent = observer(({ guide_list }: TGuideContent) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useDBotStore();
    const {
        dialog_options,
        is_dialog_open,
        onCloseDialog: onOkButtonClick,
        setActiveTab,
        setTourDialogVisibility,
        showVideoDialog,
        setActiveTour,
        setShowMobileTourDialog,
        faq_search_value,
    } = dashboard;

    const [video_guide, setVideoGuide] = React.useState(true);
    const [tour_guides, setTourGuides] = React.useState(true);

    const getLengthOfArrayForTabs = React.useCallback(() => {
        const hasVideoGuide = guide_list.some(({ type }) => type !== 'Tour');
        const hasTourGuide = guide_list.some(({ type }) => type === 'Tour');

        setVideoGuide(hasVideoGuide);
        setTourGuides(hasTourGuide);
    }, [guide_list, video_guide, tour_guides]);

    React.useEffect(() => {
        getLengthOfArrayForTabs();
    }, [getLengthOfArrayForTabs, faq_search_value]);

    const triggerTour = (type: string) => {
        if (type === 'OnBoard') {
            removeKeyValue('onboard_tour_token');
            setActiveTab(DBOT_TABS.DASHBOARD);
            if (is_mobile) setActiveTour('onboarding');
            setTourDialogVisibility(true);
        } else {
            setActiveTab(DBOT_TABS.BOT_BUILDER);
            if (is_mobile) setActiveTour('bot_builder');
            setTourDialogVisibility(true);
            if (is_mobile) setShowMobileTourDialog(true);
        }
    };

    const handleKeyboardEvent = (e: KeyboardEvent) => {
        if (e.key === 'Enter') triggerTour('OnBoard');
    };

    return React.useMemo(
        () => (
            <div className='tutorials-wrap'>
                {tour_guides && (
                    <Text align='center' weight='bold' color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
                        <Localize i18n_default_text='Step-by-step guides' />
                    </Text>
                )}
                {tour_guides && (
                    <div className='tutorials-wrap__group'>
                        {guide_list?.map(({ id, content, src, type, subtype }) => {
                            return (
                                type === 'Tour' && (
                                    <div
                                        className='tutorials-wrap__group__cards tutorials-wrap--tour'
                                        key={id}
                                        onClick={() => triggerTour(subtype)}
                                        onKeyDown={handleKeyboardEvent}
                                    >
                                        <div
                                            className={classNames('tutorials-wrap__placeholder__tours', {
                                                'tutorials-wrap__placeholder--disabled': !src,
                                            })}
                                            style={{
                                                backgroundImage: `url(${src})`,
                                            }}
                                        />
                                        <Text
                                            align='center'
                                            color='prominent'
                                            line_height='s'
                                            size={is_mobile ? 'xxs' : 's'}
                                        >
                                            {content}
                                        </Text>
                                    </div>
                                )
                            );
                        })}
                    </div>
                )}

                {video_guide && (
                    <Text align='center' weight='bold' color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
                        <Localize i18n_default_text='Videos on Deriv Bot' />
                    </Text>
                )}
                {video_guide && (
                    <div className='tutorials-wrap__group'>
                        {guide_list?.map(({ id, content, url, type, src }) => {
                            return (
                                type !== 'Tour' && (
                                    <div className='tutorials-wrap__group__cards tutorials-wrap--placeholder' key={id}>
                                        <div
                                            className={classNames('tutorials-wrap__placeholder', {
                                                'tutorials-wrap__placeholder--disabled': !url,
                                            })}
                                            style={{
                                                backgroundImage: `url(${src})`,
                                            }}
                                        >
                                            <div className='tutorials-wrap__placeholder__button-group'>
                                                <Icon
                                                    className='tutorials-wrap__placeholder__button-group--play'
                                                    width='4rem'
                                                    height='4rem'
                                                    icon={'IcPlayOutline'}
                                                    onClick={() =>
                                                        showVideoDialog({
                                                            type: 'url',
                                                            url,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Text
                                            align='center'
                                            color='prominent'
                                            line_height='s'
                                            size={is_mobile ? 'xxs' : 's'}
                                        >
                                            {content}
                                        </Text>
                                    </div>
                                )
                            );
                        })}
                    </div>
                )}
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    cancel_button_text={localize('Cancel')}
                    onCancel={onOkButtonClick}
                    confirm_button_text={localize('OK')}
                    onConfirm={onOkButtonClick}
                    is_mobile_full_width
                    className={'dc-dialog'}
                    has_close_icon
                    onClose={onOkButtonClick}
                >
                    <iframe width='100%' height='100%' src={dialog_options.url} frameBorder='0' allowFullScreen />
                </Dialog>
            </div>
        ),
        [guide_list, is_dialog_open, video_guide, tour_guides]
    );
});

export default GuideContent;
