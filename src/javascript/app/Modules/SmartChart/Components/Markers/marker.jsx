import { Marker }   from 'smartcharts-beta';
import { toJS }     from 'mobx';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const ChartMarker = ({
    marker_config,
    marker_content_props,
}) => {
    const { ContentComponent, ...marker_props } = marker_config;

    return (
        <Marker {...toJS(marker_props)}>
            <ContentComponent {...toJS(marker_content_props)} />
        </Marker>
    );
};

ChartMarker.propTypes = {
    marker_config       : PropTypes.object,
    marker_content_props: PropTypes.object,
};

export default observer(ChartMarker);
