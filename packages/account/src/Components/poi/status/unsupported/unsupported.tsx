import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Timeline } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { identity_status_codes } from 'Sections/Verification/ProofOfIdentity/proof-of-identity-utils.js';
import DetailComponent from './detail-component';
import { Documents } from './documents.jsx';
import { getDocumentIndex, DOCUMENT_TYPES } from './constants';
import UploadComplete from '../upload-complete';
import { FormikValues } from 'formik';

const checkNimcStep = (documents: FormikValues) => {
    let has_nimc = false;
    documents.forEach((document: FormikValues) => {
        if (document.document_type === DOCUMENT_TYPES.NIMC_SLIP) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

type TUnsupported = {
    country_code: string;
    handlePOIforMT5Complete: () => void;
    manual: {
        status: string;
    };
};

const Unsupported = ({ country_code, handlePOIforMT5Complete, ...props }: Partial<TUnsupported>) => {
    const [detail, setDetail] = React.useState<number | null>(null);
    const toggleDetail = (index: number) => setDetail(index);

    const documents = getDocumentIndex({
        country_code,
    });

    if (props?.manual?.status === identity_status_codes.pending) return <UploadComplete />;

    if (detail !== null) {
        return (
            <DetailComponent
                is_onfido_supported={country_code === 'ng' && !checkNimcStep(documents[detail].details.documents)}
                country_code_key={country_code}
                document={documents[detail]}
                root_class='manual-poi'
                onClickBack={() => setDetail(null)}
                handlePOIforMT5Complete={handlePOIforMT5Complete}
                {...props}
            />
        );
    }

    return (
        <Timeline
            className={classNames('manual-poi', {
                'manual-poi--mobile': isMobile(),
            })}
            disabled_items={[2]}
        >
            <Timeline.Item item_title={localize('Please upload one of the following documents:')}>
                <Documents documents={documents} toggleDetail={toggleDetail} />
            </Timeline.Item>
            <Timeline.Item item_title={localize('Upload your selfie')}>
                <div />
            </Timeline.Item>
        </Timeline>
    );
};
export default Unsupported;
