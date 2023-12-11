import { TContractInfo } from '@deriv/shared';
import React from 'react';

type TDelayedAccuBarriersMarkerProps = {
    epoch_array: number[];
    contract_info: TContractInfo;
    granularity?: number;
    is_dark_theme?: boolean;
    is_in_contract_details?: boolean;
    marker_component: React.ComponentType<
        Omit<TDelayedAccuBarriersMarkerProps, 'previous_spot_time' | 'marker_component'>
    >;
    previous_spot_time: number | null;
    price_array: number[];
    type: string;
};

const DelayedAccuBarriersMarker = React.memo(
    ({ marker_component: MarkerComponent, ...props }: TDelayedAccuBarriersMarkerProps) => (
        <MarkerComponent {...{ ...props, previous_spot_time: undefined }} />
    ), // barrier range will get updated only when previous_spot_time changes:
    (prevProps, nextProps) => prevProps.previous_spot_time === nextProps.previous_spot_time
);
DelayedAccuBarriersMarker.displayName = 'DelayedAccuBarriersMarker';

export default DelayedAccuBarriersMarker;
