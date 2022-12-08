import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getUrlBase, isMobile } from '@deriv/shared';
import 'Sass/app/modules/contract/accumulators-stats.scss';

const AccumulatorsStatsManualModal = ({ title, icon_classname, is_manual_open, toggleManual }) => {
    const is_mobile = isMobile();
    // memoize video sources and open the modal only after we get them to avoid showing half-empty modal
    const getVideoSource = React.useCallback(
        extension => {
            return getUrlBase(
                `/public/images/common/accumulators_stats_manual_${is_mobile ? 'mobile' : 'desktop'}.${extension}`
            );
        },
        [is_mobile]
    );
    return (
        <React.Fragment>
            <Icon icon='IcInfoOutline' onClick={toggleManual} size={16} className={icon_classname} />
            <Modal
                is_open={is_manual_open && !!getVideoSource('mp4') && !!getVideoSource('webm')}
                should_header_stick_body={false}
                title={title}
                toggleModal={toggleManual}
                width={is_mobile ? '328px' : '596px'}
                className='accumulators-stats-manual-modal'
            >
                <Modal.Body className='accumulators-stats-modal-body'>
                    <div className='accumulators-stats-modal-body__video' data-testid='dt_accumulators_stats_manual'>
                        <video width={is_mobile ? 296 : 563} autoPlay loop playsInline>
                            {/* a browser will select a source with extension it recognizes */}
                            <source src={getVideoSource('mp4')} type='video/mp4' />
                            <source src={getVideoSource('webm')} type='video/webm' />
                            {localize('Unfortunately, your browser does not support the video.')}
                        </video>
                    </div>
                    <Text
                        as='p'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        className='accumulators-stats-modal-body__text'
                    >
                        {localize(
                            'Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.'
                        )}
                    </Text>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

AccumulatorsStatsManualModal.propTypes = {
    title: PropTypes.string,
    icon_classname: PropTypes.string,
    is_manual_open: PropTypes.bool,
    toggleManual: PropTypes.func,
};

export { AccumulatorsStatsManualModal };
