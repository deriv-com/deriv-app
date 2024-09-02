import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import VideoPlayer from '@deriv/components/src/components/video-player/video-player';

const AccumulatorStatsDescription = ({ onActionSheetClose }: { onActionSheetClose: () => void }) => {
    return (
        <ActionSheet.Portal showHandlebar={false}>
            <div className='stats-description'>
                <VideoPlayer
                    className='stats-description__player'
                    data_testid='dt_video_player'
                    is_mobile
                    src='https://customer-hhvo3ceuqt00w8g8.cloudflarestream.com/cfd0bd25af245c1c987106a247cbb81a/watch'
                />
                <div className='stats-description__content'>
                    <div className='stats-description__content__title'>
                        <Text size='lg' bold>
                            <Localize i18n_default_text='Stats' />
                        </Text>
                    </div>
                    <div className='stats-description__content__description'>
                        <Text>
                            <Localize i18n_default_text='Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.' />
                        </Text>
                    </div>
                </div>
            </div>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Got it' />,
                    onAction: onActionSheetClose,
                }}
            />
        </ActionSheet.Portal>
    );
};

export default AccumulatorStatsDescription;
