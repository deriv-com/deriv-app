import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import { UploadComplete } from '../upload-complete/upload-complete';
import PoiUnsupportedFailed from 'Components/poi-unsupported-failed';
import uploadFile from 'Components/file-uploader-container/upload-file';
import OnfidoUpload from '../../../../Sections/Verification/ProofOfIdentity/onfido-sdk-view';

import CardDetails from './card-details';
import { SELFIE_DOCUMENT } from './constants';

const STATUS = {
    IS_UPLOADING: 'IS_UPLOADING',
    IS_COMPLETED: 'IS_COMPLETED',
    IS_FAILED: 'IS_FAILED',
};

const DetailComponent = ({
    document,
    onClickBack,
    root_class,
    country_code_key,
    documents_supported,
    onfido_service_token,
    height,
    handleComplete,
    is_onfido_supported,
    is_from_external,
    setIsCfdPoiCompleted,
    is_mt5,
    handlePOIforMT5Complete,
    ...props
}) => {
    const [status, setStatus] = React.useState();
    const [response_error, setError] = React.useState();

    let is_any_failed = false;

    const uploadFiles = data =>
        new Promise((resolve, reject) => {
            const docs = document.details.documents.map(item => item.name);
            const files = Object.values(data).filter(item => [...docs, SELFIE_DOCUMENT.name].includes(item.name));
            const files_length = files.length;
            let file_to_upload_index = 0;
            const results = [];
            const uploadNext = () => {
                const item = files[file_to_upload_index];
                const { file, document_type, pageType, lifetime_valid } = item;
                const expiration_date =
                    typeof data.expiry_date?.format === 'function' ? data.expiry_date.format('YYYY-MM-DD') : undefined;
                uploadFile(file, WS.getSocket, {
                    documentType: document_type,
                    pageType,
                    expirationDate: expiration_date,
                    documentId: data.document_id || '',
                    lifetimeValid: +(lifetime_valid && !expiration_date),
                })
                    .then(response => {
                        file_to_upload_index += 1;
                        if (response.warning || response.error) {
                            is_any_failed = true;
                            setStatus(STATUS.IS_FAILED);
                            setError(
                                response.message || (response.error ? response.error.message : localize('Failed'))
                            );
                            if (file_to_upload_index < files_length) {
                                uploadNext();
                            }
                        } else if (file_to_upload_index < files_length) {
                            results.push(response);
                            uploadNext();
                        } else {
                            resolve(results);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            };

            uploadNext();
        });

    const onComplete = values => {
        setStatus(STATUS.IS_UPLOADING);
        uploadFiles(values).then(() => {
            if (!is_any_failed) {
                if (is_mt5) {
                    handlePOIforMT5Complete();
                } else {
                    setStatus(STATUS.IS_COMPLETED);
                }
            }
        });
    };

    switch (status) {
        case STATUS.IS_UPLOADING:
            return <Loading is_fullscreen={false} is_slow_loading status={[localize('Uploading documents')]} />;
        case STATUS.IS_COMPLETED:
            return <UploadComplete is_from_external={true} needs_poa={false} />;
        case STATUS.IS_FAILED:
            return <PoiUnsupportedFailed error={response_error} />;
        default:
            return (
                <React.Fragment>
                    {is_onfido_supported ? (
                        <React.Fragment>
                            <div className={`${root_class}__detail-header`} onClick={onClickBack}>
                                <Icon icon='IcArrowLeftBold' />
                                <Text
                                    as='p'
                                    size='xs'
                                    weight='bold'
                                    color='prominent'
                                    className={`${root_class}__back-title`}
                                >
                                    {localize('Back')}
                                </Text>
                            </div>
                            <OnfidoUpload
                                country_code={country_code_key}
                                documents_supported={[document.onfido_name]}
                                height={height ?? null}
                                handleComplete={is_mt5 ? handlePOIforMT5Complete : handleComplete}
                                is_from_external={false}
                                {...props}
                            />
                        </React.Fragment>
                    ) : (
                        <CardDetails
                            data={document.details}
                            onComplete={onComplete}
                            goToCards={onClickBack}
                            is_from_external={is_from_external}
                            setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                        />
                    )}
                </React.Fragment>
            );
    }
};

DetailComponent.propTypes = {
    handleComplete: PropTypes.func,
    has_poa: PropTypes.bool,
    onfido_service_token: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    country_code_key: PropTypes.number,
    height: PropTypes.number,
    handlePOIforMT5Complete: PropTypes.func,
    is_mt5: PropTypes.bool,
};

export default DetailComponent;
