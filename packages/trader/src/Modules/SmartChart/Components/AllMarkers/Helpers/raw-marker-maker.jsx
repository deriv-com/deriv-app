import React from 'react';
import { RawMarker } from 'Modules/SmartChart';

const RawMarkerMaker = draw_callback => {
    const Marker = ({ epoch_array, price_array, should_redraw, ...rest }) => {
        return (
            <RawMarker
                shouldRedraw={should_redraw}
                epoch_array={epoch_array}
                price_array={price_array}
                draw_callback={args => draw_callback({ ...args, ...rest })}
            />
        );
    };
    return Marker;
};

export default RawMarkerMaker;
