import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { LabelPairedCheckCaptionFillIcon } from '@deriv/quill-icons';
import { rudderStackSendCloseEvent } from '../../../analytics/rudderstack-common-events';
import { IconAnnounceModal } from './announcement-components';
import { TAnnounce, TContentItem } from './config';
import './announcement-dialog.scss';

type TAccumulatorAnnouncementDialog = {
    announcement: TAnnounce;
    is_announce_dialog_open: boolean;
    setIsAnnounceDialogOpen: (is_announce_dialog_open: boolean) => void;
    handleOnConfirm: () => void;
    handleOnCancel: (() => void) | null;
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
    const {
        id,
        main_title,
        confirm_button_text,
        cancel_button_text,
        base_classname,
        title,
        content,
        numbered_content,
        plain_text,
        unordered_list,
        media,
    } = announcement;
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
            onClose={() => {
                setIsAnnounceDialogOpen(false);
                rudderStackSendCloseEvent({
                    subform_name: 'announcements',
                    announcement_name: main_title,
                });
            }}
            className={is_tablet ? `${base_classname} ${base_classname}--tablet` : base_classname}
        >
            <div className={`${base_classname}__body-text`}>
                <div className={`${base_classname}__body-icon--${id.toLowerCase()}`}>
                    <IconAnnounceModal announce_id={id} />
                </div>
                {Array.isArray(media) && (
                    <>
                        {media.map((src, index) => (
                            <img className={`${base_classname}__image`} key={index} src={src} alt={src} />
                        ))}
                    </>
                )}
                <div className={`${base_classname}__body-main-content`}>
                    <Text as='p' size='xs' className={`${base_classname}__title--${id.toLowerCase()}`}>
                        {title}
                    </Text>
                    {Array.isArray(content) &&
                        content.map((content_item: TContentItem) => {
                            return (
                                <div className={`${base_classname}__body-item`} key={content_item?.id}>
                                    <div>
                                        <LabelPairedCheckCaptionFillIcon fill='var(--icon-black-plus)' />
                                    </div>
                                    <Text as='p' line_height='l' size='xs'>
                                        {content_item?.text}
                                    </Text>
                                </div>
                            );
                        })}
                    {Array.isArray(unordered_list) && (
                        <ul className={`${base_classname}__unordered_list`} key={0}>
                            {unordered_list.map((content_item: TContentItem) => (
                                <li key={content_item?.id}>
                                    <Text as='p' line_height='l' size='xs'>
                                        {content_item?.text}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                    )}
                    {Array.isArray(numbered_content) && (
                        <ol className={`${base_classname}__body-item--numbered`}>
                            {numbered_content.map((content: TContentItem) => (
                                <Text
                                    as='li'
                                    line_height='xl'
                                    size='xs'
                                    key={content?.id}
                                    styles={{ listStyle: 'auto' }}
                                >
                                    {content?.text}
                                </Text>
                            ))}
                        </ol>
                    )}
                    {Array.isArray(plain_text) && (
                        <div>
                            {plain_text.map((plain_text_item: TContentItem) => (
                                <span key={plain_text_item?.id}>
                                    <Text
                                        line_height='m'
                                        size='xs'
                                        key={plain_text_item.id}
                                        styles={{ listStyle: 'auto' }}
                                    >
                                        {plain_text_item.text}
                                    </Text>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default AnnouncementDialog;
