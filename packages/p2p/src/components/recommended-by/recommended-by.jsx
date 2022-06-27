import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';

const RecommendedBy = ({ recommended_average, recommended_count }) => (
    <Popover
        alignment='top'
        className='recommended-by--container'
        message={localize('Recommended by {{recommended_count}} traders', {
            recommended_count,
        })}
    >
        <Icon className='recommended-by--icon' custom_color='var(--status-success)' icon='IcThumbsUp' size={14} />
        <Text color='less-prominent' line_height='s' size={isMobile() ? 'xxxs' : 'xs'}>
            {`${recommended_average}%`}
        </Text>
    </Popover>
);

RecommendedBy.propTypes = {
    recommended_average: PropTypes.number,
    recommended_count: PropTypes.number,
};

export default RecommendedBy;
