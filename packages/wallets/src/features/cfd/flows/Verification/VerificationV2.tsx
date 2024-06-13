import React, { useEffect } from 'react';
import { usePOA, usePOI } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { PoaScreen } from '../../../accounts';
import { POIFlow } from './flows';

const Loading = () => {
    return (
        <div style={{ height: 400, width: 600 }}>
            <Loader />
        </div>
    );
};

const Verification = () => {
    const { data: poaData, isLoading: isPoaDataLoading } = usePOA();
    const { data: poiData, isLoading: isPoiDataLoading } = usePOI();

    // console.log(poiData);

    if (isPoiDataLoading || isPoaDataLoading || !poiData?.status || !poaData?.status) {
        return <Loading />;
    }

    const shouldSubmitPOI = ['pending', 'rejected', 'verified'].includes(poiData?.status);
    const shouldSubmitPOA = ['pending', 'rejected', 'verified'].includes(poaData?.status);

    if (shouldSubmitPOI) {
        // console.log('shouldSubmitPOI', shouldSubmitPOI);
        return <POIFlow poiData={poiData} />;
    }

    if (shouldSubmitPOA) {
        // return <PoaScreen />;
    }

    // console.log('none');

    return null;
};

export default Verification;
