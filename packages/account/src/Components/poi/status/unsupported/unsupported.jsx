import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Timeline } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { identity_status_codes } from 'Sections/Verification/ProofOfIdentity/proof-of-identity-utils.js';
import Verified from 'Components/poi/status/verified';
import Limited from 'Components/poi/status/limited';
import Expired from 'Components/poi/status/expired';
import DetailComponent from './detail-component.jsx';
import { Documents } from './documents.jsx';
import { getDocumentIndex, DOCUMENT_TYPES } from './constants';
import UploadComplete from '../upload-complete';

const checkNimcStep = documents => {
    let has_nimc = false;
    documents.forEach(document => {
        if (document.document_type === DOCUMENT_TYPES.NIMC_SLIP) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

const Unsupported = ({ country_code, ...props }) => {
    const [detail, setDetail] = React.useState(null);
    const toggleDetail = index => setDetail(index);

    const documents = getDocumentIndex({
        setDetail,
        country_code,
    });

    if (props?.manual) {
        if (props.manual.status === identity_status_codes.pending) return <UploadComplete />;
        else if ([identity_status_codes.rejected, identity_status_codes.suspected].includes(props.manual.status)) {
            if (!props?.allow_poi_resubmission) return <Limited />;
        } else if (props.manual.status === identity_status_codes.verified) {
            return <Verified needs_poa={props.needs_poa} redirect_button={props.redirect_button} />;
        } else if (props.manual.status === identity_status_codes.expired) {
            return (
                <Expired
                    redirect_button={props.redirect_button}
                    handleRequireSubmission={props.handleRequireSubmission}
                />
            );
        }
    }

    if (detail !== null) {
        return (
            <DetailComponent
                is_onfido_supported={country_code === 'ng' && !checkNimcStep(documents[detail].details.documents)}
                country_code={country_code}
                document={documents[detail]}
                root_class='manual-poi'
                onClickBack={() => setDetail(null)}
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
