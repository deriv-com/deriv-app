import React          from 'react';
import { FastMarker } from 'smartcharts-beta';

const MarkerMaker = children => {
    const Marker = ({ epoch, price, ...rest }) => {
        const onRef = ref => {
            if (ref) {
                ref.setPosition({ epoch, price });
            }
        };
        return (
            <FastMarker markerRef={onRef}>
                {children(rest)}
            </FastMarker>
        );
    };
    return Marker;
};

const SpotMarker = MarkerMaker(({ caption }) => (
    <div className='spot-marker'>
        { caption }
    </div>
));

export default {
    SpotMarker,
};

