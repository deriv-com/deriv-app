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
    is_tablet?: boolean;
};

const AnnouncementDialog = ({
    announcement,
    handleOnConfirm,
    handleOnCancel,
    is_announce_dialog_open,
    setIsAnnounceDialogOpen,
    is_tablet,
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
            onClose={() => setIsAnnounceDialogOpen(false)}
            className={is_tablet ? `${base_classname} ${base_classname}--tablet` : base_classname}
        >
            <div className={`${base_classname}__body-text`}>
                <div className={`${base_classname}__body-icon`}>
                    <Icon icon='IcTradetypeAccu' className='category-type' color='brand' size='80' />
                </div>
                <div>
                    <Text
                        as='p'
                        line_height='xl'
                        size='xs'
                        align='center'
                        weight='bold'
                        className={`${base_classname}__title`}
                    >
                        <Localize i18n_default_text={title} />
                    </Text>
                    {Array.isArray(content) &&
                        content.map((content_item: TContentItem) => {
                            return (
                                <div className={`${base_classname}__body-item`} key={content_item?.id}>
                                    <div>
                                        <LabelPairedCheckCaptionFillIcon fill='var(--icon-black-plus)' />
                                    </div>
                                    <Text as='p' line_height='xl' size='xs'>
                                        <Localize i18n_default_text={content_item?.text} />
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
