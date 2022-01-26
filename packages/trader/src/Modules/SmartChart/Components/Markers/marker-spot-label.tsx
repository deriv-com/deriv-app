import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { addComma, toMoment } from '@deriv/shared';

import MarkerSpot from './marker-spot.jsx';

type MarkerSpotLabelProps = {
    align_label: unknown;
    has_hover_toggle: boolean;
    spot_className: string;
    spot_count: unknown | number | string;
    spot_epoch: unknown | number | string;
    spot_value: unknown | number | string;
    status: unknown;
};

const MarkerSpotLabel = ({
    align_label,
    has_hover_toggle,
    spot_className,
    spot_count,
    spot_epoch,
    spot_value,
    status,
}: MarkerSpotLabelProps) => {
    const [show_label, setShowLabel] = React.useState(!has_hover_toggle);

    const handleHoverToggle = () => {
        setShowLabel(!show_label);
    };

    let marker_spot = <MarkerSpot className={spot_className} spot_count={spot_count} />;

    if (has_hover_toggle) {
        marker_spot = (
            <div className='marker-hover-container' onMouseEnter={handleHoverToggle} onMouseLeave={handleHoverToggle}>
                {marker_spot}
            </div>
        );
    }

    return (
        <div className={'chart-spot-label'}>
            {show_label && (
                <div className='chart-spot-label__info-container'>
                    <div
                        className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${align_label}`}
                    >
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
                        <div
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
    );
};

MarkerSpotLabel.defaultProps = {
    align_label: 'top',
};

export default observer(MarkerSpotLabel);
