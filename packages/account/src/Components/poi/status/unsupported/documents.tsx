import React from 'react';
import { Card } from '@deriv/components';
import { CardWithArrow } from './card-with-arrow';
import { FormikValues } from 'formik';

type TDocument = {
    toggleDetail: (index: number) => void;
    documents: object[];
};

export const Documents = ({ toggleDetail, documents }: TDocument) =>
    documents.map((item: FormikValues, index: number) => (
        <Card
            style={{
                margin: '1.6rem 0',
                height: '11.2rem',
            }}
            key={index}
            renderContent={() => <CardWithArrow onClick={() => toggleDetail(index)} {...item.card} />}
        />
    ));
