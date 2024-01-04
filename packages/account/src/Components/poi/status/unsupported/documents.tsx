import React from 'react';
import { Card } from '@deriv/components';
import { CardWithArrow } from './card-with-arrow';
import { getDocumentIndex } from './constants';

type TDocument = {
    toggleDetail: (index: number) => void;
    documents: ReturnType<typeof getDocumentIndex>;
};

export const Documents = ({ toggleDetail, documents }: TDocument) => (
    <React.Fragment>
        {documents.map((item, index: number) => (
            <Card
                key={item.card?.icon}
                renderContent={() => <CardWithArrow onClick={() => toggleDetail(index)} {...item.card} />}
            />
        ))}
    </React.Fragment>
);
