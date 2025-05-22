import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import { BARRIER_COLORS } from '@deriv/shared';

const MarkerLine = ({ label, line_style, marker_config, status }) => {
    // TODO: Find a more elegant solution
    if (!marker_config) return <div />;
    return (
        <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
            {label === marker_config.LINE_END.content_config.label && (
                <Icon
                    icon='IcContractExitTimeCircle'
                    className='chart-marker-line__icon'
                    color={status === 'lost' ? 'red' : 'green'}
                    custom_color={status === 'lost' ? BARRIER_COLORS.RED : BARRIER_COLORS.GREEN}
                    size={24}
                />
            )}
            {label === marker_config.LINE_START.content_config.label && (
                <Icon
                    icon='IcContractStartTimeCircle'
                    className='chart-marker-line__icon chart-marker-line__icon--time'
                    color='secondary'
                    size={24}
                />
            )}
            {label === marker_config.LINE_RESET.content_config.label && (
                <Icon
                    icon='IcContractResetTimeCircle'
                    className='chart-marker-line__icon chart-marker-line__icon--time'
                    color='secondary'
                    size={24}
                />
            )}
        </div>
    );
};

MarkerLine.propTypes = {
    label: PropTypes.string,
    line_style: PropTypes.string,
    marker_config: PropTypes.object,
    status: PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerLine);
