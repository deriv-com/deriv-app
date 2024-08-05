import React from 'react';
import { Checkbox, Dialog, Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { LabelPairedCheckCaptionFillIcon } from '@deriv/quill-icons';
import { DBOT_TABS } from 'Constants/bot-contents';
import './announcement-dialog.scss';
import { ANNOUNCEMENTS } from './config';
// import useQsSubmitHandler from '../form-wrappers/useQsSubmitHandler';

type TAccumulatorAnnouncementDialog = {
    handleTabChange: (item: number) => void;
    isAnnounceDialogOpen: boolean;
    setAnnounceDialogOpen: (isAnnounceDialogOpen: boolean) => void;
};

const AnnouncementDialog = observer(
    ({ handleTabChange, isAnnounceDialogOpen, setAnnounceDialogOpen }: TAccumulatorAnnouncementDialog) => {
        const { dashboard, quick_strategy } = useDBotStore();
        const { setActiveTabTutorial } = dashboard;
        const accumulator_announcement = ANNOUNCEMENTS['ACCUMULATOR_ANNOUNCE'];
        const { title, confirm_button_text, cancel_button_text, base_classname, details } = accumulator_announcement;

        const handleOnCancel = () => {
            handleTabChange(DBOT_TABS.TUTORIAL);
            setActiveTabTutorial(0);
        };

        const handleOnConfirm = () => {
            //
        };

        return (
            <Dialog
                portal_element_id='modal_root_absolute'
                title={title}
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
                        <Localize i18n_default_text='Accumulator Options' />
                    </Text>
                    <div>
                        <Text as='p' line_height='xl' size='xs' align='center' className={`${base_classname}__title`}>
                            <Localize i18n_default_text='Boost your trading strategy with Accumulators' />
                        </Text>
                        <div className={`${base_classname}__body-item`}>
                            <div>
                                <LabelPairedCheckCaptionFillIcon />
                            </div>
                            <Text as='p' line_height='xl' size='xs'>
                                <Localize
                                    i18n_default_text={
                                        'Leverage Accumulators to enhance potential profits with a structured approach.'
                                    }
                                />
                            </Text>
                        </div>
                        <div className={`${base_classname}__body-item`}>
                            <div>
                                <LabelPairedCheckCaptionFillIcon />
                            </div>
                            <Text as='p' line_height='xl' size='xs'>
                                <Localize
                                    i18n_default_text={
                                        'Customize your investment period and price levels to fit your trading goals.'
                                    }
                                />
                            </Text>
                        </div>
                        <div className={`${base_classname}__body-item`}>
                            <div>
                                <LabelPairedCheckCaptionFillIcon />
                            </div>
                            <Text as='p' line_height='xl' size='xs'>
                                <Localize
                                    i18n_default_text={'Manage risks while capitalizing on market opportunities.'}
                                />
                            </Text>
                        </div>
                    </div>

                    {/* <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                    <Localize i18n_default_text='Close your contract now or keep it running. If you decide to keep it running, you can check and close it later on the ' />
                    <Text weight='bold' as='span' line_height='s' size='xs'>
                        <Localize i18n_default_text='Reports' />
                    </Text>
                    <Localize i18n_default_text='page.' />
                </Text> */}
                </div>
            </Dialog>
        );
    }
);

export default AnnouncementDialog;
