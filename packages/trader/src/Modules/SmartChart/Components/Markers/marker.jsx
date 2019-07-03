import { Marker }   from 'smartcharts-beta';
import { toJS }     from 'mobx';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const ChartMarker = ({
    is_contract_replay,
    marker_config,
    marker_content_props,
}) => {
    const { ContentComponent, ...marker_props } = marker_config;

    // Remove CSS transition on chart-marker-line when
    // viewing expired contract because it appears sluggish over time
    // -> charts seems to be doing heavy js scripting when rendering static charts
    // TODO: remove this once smartcharts is more optimized
    if (is_contract_replay && marker_props.yPositioner === 'none') {
        marker_props.className += ' chart-marker-line__no-transition';
    }

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
