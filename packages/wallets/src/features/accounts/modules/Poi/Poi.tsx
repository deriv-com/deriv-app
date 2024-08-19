import React, { useState } from 'react';
import { usePOI } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { DocumentService } from '../DocumentService';
import { ManualService } from '../ManualService';

type TPoiProps = {
    onCompletion?: VoidFunction;
};

const Poi: React.FC<TPoiProps> = ({ onCompletion }) => {
    const { data: poiData, isLoading } = usePOI();
    const [renderManualService, setRenderManualService] = useState(false);

    if (isLoading) {
        return <Loader />;
    }

    const service = poiData?.current.service as THooks.POI['current']['service'];

    if (service === 'manual' || renderManualService) {
        return <ManualService onCompletion={onCompletion} />;
    }

    return (
        <DocumentService
            onCompletion={onCompletion}
            onDocumentNotAvailable={() => {
                setRenderManualService(true);
            }}
        />
    );
};

export default Poi;
