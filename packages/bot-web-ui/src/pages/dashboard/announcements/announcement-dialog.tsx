import React from 'react';
import { Dialog, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { LabelPairedCheckCaptionFillIcon } from '@deriv/quill-icons';
import './announcement-dialog.scss';
import { TAnnounce, TContentItem } from './config';

type TAccumulatorAnnouncementDialog = {
    announcement: TAnnounce;
    is_announce_dialog_open: boolean;
    setIsAnnounceDialogOpen: (is_announce_dialog_open: boolean) => void;
    handleOnConfirm: () => void;
    handleOnCancel: () => void;
};

const AnnouncementDialog = ({
    announcement,
    handleOnConfirm,
    handleOnCancel,
    is_announce_dialog_open,
    setIsAnnounceDialogOpen,
}: TAccumulatorAnnouncementDialog) => {
    const { main_title, confirm_button_text, cancel_button_text, base_classname, title, content } = announcement;
    return (
        <Dialog
            portal_element_id='modal_root_absolute'
            title={main_title}
            is_visible={is_announce_dialog_open}
            confirm_button_text={confirm_button_text}
            onConfirm={handleOnConfirm}
            cancel_button_text={cancel_button_text}
            onCancel={handleOnCancel}
            is_mobile_full_width
            has_close_icon
            onClose={() => setIsAnnounceDialogOpen(!is_announce_dialog_open)}
            className={base_classname}
        >
            <div className={`${base_classname}__body-text`}>
                <div className={`${base_classname}__body-icon`}>
                    <Icon icon='IcTradetypeAccu' className='category-type' color='brand' size='80' />
                </div>
                <div>
                    <Text as='p' line_height='xl' size='xs' align='center' className={`${base_classname}__title`}>
                        <Localize i18n_default_text={title} />
                    </Text>
                    {Array.isArray(content) &&
                        content.map((content: TContentItem) => {
                            return (
                                <div className={`${base_classname}__body-item`} key={content?.id}>
                                    <div>
                                        <LabelPairedCheckCaptionFillIcon fill='var(--icon-black-plus)' />
                                    </div>
                                    <Text as='p' line_height='xl' size='xs'>
                                        <Localize i18n_default_text={content?.text} />
                                    </Text>
                                </div>
                            );
                        })}
                </div>
            </div>
        </Dialog>
    );
};

export default AnnouncementDialog;
