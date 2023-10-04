import React from 'react';
import classNames from 'classnames';
import { Dialog, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { removeKeyValue } from 'Utils/settings';
import { useDBotStore } from 'Stores/useDBotStore';

type TGuideContent = {
    guide_list: [];
};

const GuideContent = observer(({ guide_list }: TGuideContent) => {
    const { dashboard } = useDBotStore();
    const {
        dialog_options,
        faq_search_value,
        is_dialog_open,
        onCloseDialog: onOkButtonClick,
        setActiveTab,
        setTourDialogVisibility,
        showVideoDialog,
        setActiveTour,
        setShowMobileTourDialog,
    } = dashboard;

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
    const is_mobile = isMobile();

    return React.useMemo(
        () => (
            <div className='tutorials-wrap'>
                {guide_list?.length > 0 && (
                    <Text align='center' weight='bold' color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
                        {localize('Step-by-step guides')}
                    </Text>
                )}
                <div className='tutorials-wrap__group'>
                    {guide_list?.map(({ id, content, src, type, subtype }) => {
                        return (
                            type === 'Tour' && (
                                <div
                                    className='tutorials-wrap__group__cards tutorials-wrap--tour'
                                    key={id}
                                    onClick={() => triggerTour(subtype)}
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
                {guide_list?.length > 0 && (
                    <Text align='center' weight='bold' color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
                        {localize('Videos on Deriv Bot')}
                    </Text>
                )}
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
                    {!guide_list.length && (
                        <div className='tutorials-wrap__group__nosearch'>
                            <Text as='h1' weight='bold' line_height='xxs'>
                                {localize('No results found "{{ faq_search_value }}"', {
                                    faq_search_value,
                                })}
                            </Text>
                        </div>
                    )}
                </div>
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
        [guide_list, is_dialog_open]
    );
});

export default GuideContent;
