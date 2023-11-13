import React from 'react';
import { Icon, Loading, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import 'Sass/app/modules/contract/accumulators-stats.scss';
import VideoStream from 'App/Components/Elements/VideoStream';
import { getAccuManualVideoId } from 'Modules/Trading/Helpers/contract-type';

type TAccumulatorsStatsManualModal = {
    icon_classname: string;
    is_dark_theme?: boolean;
    is_manual_open: boolean;
    is_mobile?: boolean;
    title: string;
    toggleManual: () => void;
};

const AccumulatorsStatsManualModal = ({
    icon_classname,
    is_dark_theme,
    is_manual_open,
    is_mobile,
    title,
    toggleManual,
}: TAccumulatorsStatsManualModal) => {
    const [is_loading, setIsLoading] = React.useState(true);
    return (
        <React.Fragment>
            <Icon
                icon='IcInfoOutline'
                onClick={toggleManual}
                size={16}
                className={icon_classname}
                data_testid='dt_ic_info_icon'
            />
            <Modal
                is_open={is_manual_open}
                should_header_stick_body={false}
                title={title}
                toggleModal={toggleManual}
                width={is_mobile ? '328px' : '596px'}
                className='accumulators-stats-manual-modal'
            >
                <Modal.Body className='accumulators-stats-modal-body'>
                    <div className='accumulators-stats-modal-body__video'>
                        {is_loading && <Loading is_fullscreen={false} />}
                        <VideoStream
                            autoplay
                            test_id='dt_accumulators_stats_manual_video'
                            loop
                            onLoad={() => setIsLoading(false)}
                            src={getAccuManualVideoId(is_mobile, is_dark_theme)}
                            width={is_mobile ? 296 : 563}
                        />
                    </div>
                    <Text
                        as='p'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        className='accumulators-stats-modal-body__text'
                    >
                        <Localize i18n_default_text='Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.' />
                    </Text>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export { AccumulatorsStatsManualModal };
