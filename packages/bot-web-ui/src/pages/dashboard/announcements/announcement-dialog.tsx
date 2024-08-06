import React from 'react';
import { Dialog, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { LabelPairedCheckCaptionFillIcon } from '@deriv/quill-icons';
import './announcement-dialog.scss';
import { TAnnouncement, TContentItem } from './config';

type TAccumulatorAnnouncementDialog = {
    announcement: TAnnouncement;
    isAnnounceDialogOpen: boolean;
    setAnnounceDialogOpen: (isAnnounceDialogOpen: boolean) => void;
    handleOnConfirm: () => void;
    handleOnCancel: () => void;
};

const AnnouncementDialog = ({ announcement, handleOnConfirm, handleOnCancel, isAnnounceDialogOpen, setAnnounceDialogOpen }: TAccumulatorAnnouncementDialog) => {
    const { main_title, confirm_button_text, cancel_button_text, base_classname, title, subtitle, content } = announcement;

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
                        content.map((content: TContentItem) => {
                            return (
                                <div className={`${base_classname}__body-item`} key={content?.id}>
                                    <div>
                                        <LabelPairedCheckCaptionFillIcon />
                                    </div>
                                    <Text as='p' line_height='xl' size='xs'>
                                        <Localize i18n_default_text={content?.text} />
                                    </Text>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </Dialog>
    );
};

export default AnnouncementDialog;
