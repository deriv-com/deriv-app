import React from 'react';
import { usePOI } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { IDVService, Onfido } from './components';

type TDocumentServiceProps = {
    onCompletion?: VoidFunction;
    onDocumentNotAvailable?: VoidFunction;
};

const DocumentService: React.FC<TDocumentServiceProps> = ({ onCompletion, onDocumentNotAvailable }) => {
    const { data: poiData, isLoading } = usePOI();
    if (!poiData || isLoading) return <Loader />;

    const service = poiData.current.service as THooks.POI['current']['service'];

    if (service === 'onfido') {
        return <Onfido onCompletion={onCompletion} />;
    }

    if (service === 'idv') {
        return <IDVService onCompletion={onCompletion} onDocumentNotAvailable={onDocumentNotAvailable} />;
    }

    return null;
};

export default DocumentService;
