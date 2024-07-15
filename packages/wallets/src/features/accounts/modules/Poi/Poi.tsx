import React from 'react';
import { usePOI } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { DocumentService } from '../DocumentService';
import { ManualService } from '../ManualService';

type TPoiProps = {
    onCompletion?: () => void;
};

const Poi: React.FC<TPoiProps> = ({ onCompletion }) => {
    const { data: poiData, isLoading } = usePOI();

    if (isLoading) {
        return <Loader />;
    }

    const service = poiData?.current.service as THooks.POI['current']['service'];

    if (service === 'manual') {
        return <ManualService />;
    }

    return <DocumentService onCompletion={onCompletion} />;
};

export default Poi;
