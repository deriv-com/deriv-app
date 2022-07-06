import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import RecommendedModal from './recommended-modal.jsx';

const RecommendedBy = ({ recommended_average, recommended_count }) => {
    const [is_recommended_modal_open, setIsRecommendedModalOpen] = React.useState(false);
    const message =
        recommended_count === 1
            ? localize('Recommended by {{recommended_count}} trader', {
                  recommended_count,
              })
            : localize('Recommended by {{recommended_count}} traders', {
                  recommended_count,
              });

    return (
        <React.Fragment>
            <RecommendedModal
                is_recommended_modal_open={is_recommended_modal_open}
                message={message}
                setIsRecommendedModalOpen={setIsRecommendedModalOpen}
            />
            <Popover
                alignment='top'
                className='recommended-by--container'
                message={message}
                onClick={() => setIsRecommendedModalOpen(true)}
            >
                <Icon className='recommended-by--icon' icon='IcThumbsUp' size={14} />
                <Text color='less-prominent' line_height='s' size={isMobile() ? 'xxxs' : 'xs'}>
                    {`${recommended_average}%`}
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
