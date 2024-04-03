import React from 'react';
import { DerivLightDobPoiIcon, DerivLightNameDobPoiIcon, DerivLightNamePoiIcon } from '@deriv/quill-icons';
import { IDV_ERROR_CODES } from '../../constants';

export const SampleImage = ({ errorStatus }: { errorStatus?: string | null }) => {
    if (errorStatus === IDV_ERROR_CODES.nameMismatch.code) {
        return <DerivLightNamePoiIcon data-testid='dt_poi_name' height='200px' />;
    } else if (errorStatus === IDV_ERROR_CODES.dobMismatch.code) {
        return <DerivLightDobPoiIcon data-testid='dt_poi_dob' height='200px' />;
    }
    return <DerivLightNameDobPoiIcon data-testid='dt_poi_name_dob' height='200px' />;
};
