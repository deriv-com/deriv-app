import React from 'react';
import { DerivLightDobPoiIcon, DerivLightNameDobPoiIcon, DerivLightNamePoiIcon } from '@deriv/quill-icons';
import { IDV_ERROR_CODES } from '../../constants';

export const SampleImage = ({ errorStatus }: { errorStatus?: string | null }) => {
    if (errorStatus === IDV_ERROR_CODES.nameMismatch.code) {
        return <DerivLightNamePoiIcon height='200px' />;
    } else if (errorStatus === IDV_ERROR_CODES.dobMismatch.code) {
        return <DerivLightDobPoiIcon height='200px' />;
    }
    return <DerivLightNameDobPoiIcon height='200px' />;
};
