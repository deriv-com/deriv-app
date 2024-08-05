import React from 'react';
import { Checkbox, Dialog, Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { LabelPairedCheckCaptionFillIcon } from '@deriv/quill-icons';
import { DBOT_TABS } from 'Constants/bot-contents';
import './announcement-dialog.scss';
import { Announcement } from './config';
// import useQsSubmitHandler from '../form-wrappers/useQsSubmitHandler';

type TAccumulatorAnnouncementDialog = {
    announcement: Announcement;
    handleTabChange: (item: number) => void;
    isAnnounceDialogOpen: boolean;
    setAnnounceDialogOpen: (isAnnounceDialogOpen: boolean) => void;
};

const AnnouncementDialog = observer(
    ({ announcement, handleTabChange, isAnnounceDialogOpen, setAnnounceDialogOpen }: TAccumulatorAnnouncementDialog) => {
        const { dashboard, quick_strategy } = useDBotStore();
        const { onSubmit } = quick_strategy;
        const { setActiveTabTutorial } = dashboard;
        const { main_title, confirm_button_text, cancel_button_text, base_classname, title, subtitle, content } = announcement;

        const handleOnCancel = () => {
            handleTabChange(DBOT_TABS.TUTORIAL);
            setActiveTabTutorial(0);
        };

        const handleOnConfirm = () => {
            handleTabChange(DBOT_TABS.BOT_BUILDER);
            setActiveTabTutorial(1);
            onSubmit({ 'tradetype': 'accumulator' })
        };

        return (
            <Dialog
                portal_element_id='modal_root_absolute'
                title={main_title}
                is_visible={isAnnounceDialogOpen}
                confirm_button_text={confirm_button_text}
                onConfirm={handleOnConfirm}
                cancel_button_text={cancel_button_text}
                onCancel={handleOnCancel}
                is_mobile_full_width
                has_close_icon
                onClose={() => setAnnounceDialogOpen(!isAnnounceDialogOpen)}
                className={base_classname}
            >
                <div className={`${base_classname}__body-text`}>
                    <div className={`${base_classname}__body-icon`}>
                        <Icon icon='IcTradetypeAccu' className='category-type' color='brand' size='80' />
                    </div>
                    <Text
                        as='p'
                        size='s'
                        weight='bold'
                        line_height='xxl'
                        align='center'
                        className={`${base_classname}__title`}
                    >
                        <Localize i18n_default_text={title} />
                    </Text>
                    <div>
                        <Text as='p' line_height='xl' size='xs' align='center' className={`${base_classname}__title`}>
                            <Localize i18n_default_text={subtitle} />
                        </Text>
                        {
                            content.map((text: string) => {
                                return (
                                    <div className={`${base_classname}__body-item`}>
                                        <div>
                                            <LabelPairedCheckCaptionFillIcon />
                                        </div>
                                        <Text as='p' line_height='xl' size='xs'>
                                            <Localize i18n_default_text={text} />
                                        </Text>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </Dialog>
        );
    }
);

export default AnnouncementDialog;
