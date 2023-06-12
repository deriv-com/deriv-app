import React from 'react';
import classNames from 'classnames';
import { Dialog, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { removeKeyValue } from '../../../utils/settings';
import { tour_type } from '../joyride-config';

type TGuideContent = {
    dialog_options: { [key: string]: string };
    faq_search_value: string;
    guide_list: [];
    is_dialog_open: boolean;
    onOkButtonClick: () => void;
    setActiveTab: (tab_title: number) => void;
    setHasTourEnded: (param: boolean) => boolean;
    setOnBoardTourRunState: (param: boolean) => boolean;
    setTourActive: (param: boolean) => boolean;
    setTourDialogVisibility: (param: boolean) => boolean;
    showVideoDialog: (param: { [key: string]: string }) => void;
};

const GuideContent = ({
    dialog_options,
    faq_search_value,
    guide_list,
    is_dialog_open,
    onOkButtonClick,
    setActiveTab,
    setHasTourEnded,
    setOnBoardTourRunState,
    setTourActive,
    setTourDialogVisibility,
    showVideoDialog,
}: TGuideContent) => {
    const triggerTour = (type: string) => {
        const storage = JSON.parse(localStorage?.dbot_settings);
        if (type === 'OnBoard') {
            if (storage.onboard_tour_token) {
                removeKeyValue('onboard_tour_token');
                removeKeyValue('onboard_tour_status');
                removeKeyValue('bot_builder_status');
            }
            tour_type.key = 'onboard_tour';
            setHasTourEnded(false);
            if (is_mobile) {
                setTourActive(true);
                setOnBoardTourRunState(true);
            } else {
                setTourDialogVisibility(true);
            }
            setActiveTab(DBOT_TABS.DASHBOARD);
        } else {
            if (storage.bot_builder_token) {
                removeKeyValue('bot_builder_token');
                removeKeyValue('bot_builder_status');
                removeKeyValue('onboard_tour_status');
            }
            tour_type.key = 'bot_builder';
            setHasTourEnded(false);
            setTourDialogVisibility(true);
            setActiveTab(DBOT_TABS.BOT_BUILDER);
        }
    };
    const is_mobile = isMobile();

    return React.useMemo(
        () => (
            <div className='tutorials-wrap'>
                {guide_list?.length > 0 && (
                    <Text align='center' weight='bold' color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
                        Step-by-step guides
                    </Text>
                )}
                <div className='tutorials-wrap__group'>
                    {guide_list &&
                        guide_list.map(({ id, content, src, type, subtype }) => {
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
                        Videos on DBot
                    </Text>
                )}
                <div className='tutorials-wrap__group'>
                    {guide_list &&
                        guide_list.map(({ id, content, url, type, src }) => {
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
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    dialog_options: dashboard.dialog_options,
    faq_search_value: dashboard.faq_search_value,
    is_dialog_open: dashboard.is_dialog_open,
    onOkButtonClick: dashboard.onCloseDialog,
    setActiveTab: dashboard.setActiveTab,
    setHasTourEnded: dashboard.setHasTourEnded,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourActive: dashboard.setTourActive,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    showVideoDialog: dashboard.showVideoDialog,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(GuideContent);
