import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import RecommendedModal from './recommended-modal.jsx';

const RecommendedBy = ({ recommended_average, recommended_count }) => {
    const [is_recommended_modal_open, setIsRecommendedModalOpen] = React.useState(false);
    const getRecommendedMessage = () => {
        if (recommended_count) {
            if (recommended_count === 1) {
                return localize('Recommended by {{recommended_count}} trader', {
                    recommended_count,
                });
            }
            return localize('Recommended by {{recommended_count}} traders', {
                recommended_count,
            });
        }
        return localize('Recommended by 0 traders');
    };

    return (
        <React.Fragment>
            <RecommendedModal
                is_recommended_modal_open={is_recommended_modal_open}
                message={getRecommendedMessage()}
                setIsRecommendedModalOpen={setIsRecommendedModalOpen}
            />
            <Popover
                alignment='top'
                className='recommended-by--container'
                message={getRecommendedMessage()}
                onClick={isMobile() ? () => setIsRecommendedModalOpen(true) : () => {}}
            >
                <Icon
                    className='recommended-by--icon'
                    custom_color='var(--status-success)'
                    icon='IcThumbsUp'
                    size={14}
                />
                <Text color='less-prominent' line_height='s' size={isMobile() ? 'xxxs' : 'xs'}>
                    {`${recommended_average !== null ? recommended_average : 0}%`}
                </Text>
            </Popover>
        </React.Fragment>
    );
};

RecommendedBy.propTypes = {
    recommended_average: PropTypes.number,
    recommended_count: PropTypes.number,
};

export default RecommendedBy;
