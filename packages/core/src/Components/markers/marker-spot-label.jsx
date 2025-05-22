import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { addComma, toMoment } from '@deriv/shared';

import MarkerSpot from './marker-spot.jsx';
import { localize } from '@deriv/translations';

const MarkerSpotLabel = ({
    align_label,
    has_hover_toggle,
    is_value_hidden,
    spot_className,
    spot_count,
    spot_epoch,
    spot_value,
    spot_profit,
    status,
}) => {
    const [show_label, setShowLabel] = React.useState(!has_hover_toggle);

    const handleHoverToggle = () => {
        setShowLabel(!show_label);
    };

    let marker_spot = <MarkerSpot className={spot_className} spot_count={spot_count} />;

    if (has_hover_toggle) {
        marker_spot = (
            <div
                data-testid='dt_marker_hover_container'
                className='marker-hover-container'
                onMouseEnter={handleHoverToggle}
                onMouseLeave={handleHoverToggle}
            >
                {marker_spot}
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className={'chart-spot-label'}>
                {show_label && !is_value_hidden && (
                    <div className='chart-spot-label__info-container'>
                        <div
                            data-testid='dt_time_value_container'
                            className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${align_label}`}
                        >
                            {spot_epoch && (
                                <div className='chart-spot-label__time-container'>
                                    <Icon
                                        icon='IcClockOutline'
                                        height={10}
                                        width={10}
                                        className='chart-spot-label__time-icon'
                                    />
                                    <Text as='p' color='prominent' size='xxxs'>
                                        {toMoment(+spot_epoch).format('HH:mm:ss')}
                                    </Text>
                                </div>
                            )}
                            <div
                                data-testid='dt_value_container'
                                className={classNames('chart-spot-label__value-container', {
                                    'chart-spot-label__value-container--won': status === 'won',
                                    'chart-spot-label__value-container--lost': status === 'lost',
                                })}
                            >
                                <p>{addComma(spot_value)}</p>
                            </div>
                        </div>
                    </div>
                )}
                {marker_spot}
            </div>
            {spot_profit && (
                <div
                    className={classNames('chart-spot-label-profit', {
                        'chart-spot-label-profit--won': status === 'won',
                        'chart-spot-label-profit--lost': status === 'lost',
                    })}
                >
                    <div
                        className={classNames('chart-spot-label__value-container', {
                            'chart-spot-label__value-container--won': status === 'won',
                            'chart-spot-label__value-container--lost': status === 'lost',
                        })}
                    >
                        <Text as='p' size='xxs'>
                            {localize('Total profit/loss:')}
                        </Text>
                        <Text as='p' size='xs'>{`${parseFloat(spot_profit) > 0 ? '+' : ''}${spot_profit}`}</Text>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

MarkerSpotLabel.defaultProps = {
    align_label: 'top',
    is_value_hidden: false,
};

MarkerSpotLabel.propTypes = {
    align_label: PropTypes.oneOf(['top', 'middle', 'bottom']),
    has_hover_toggle: PropTypes.bool,
    is_value_hidden: PropTypes.bool,
    spot_className: PropTypes.string,
    spot_count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spot_epoch: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spot_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spot_profit: PropTypes.string,
    status: PropTypes.oneOf(['won', 'lost', '']),
};
export default observer(MarkerSpotLabel);
