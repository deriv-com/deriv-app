import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Submitted from 'Components/poa-submitted';
import uploadFile from 'Components/file-uploader-container/upload-file';
import { WS } from 'Services/ws-methods';
import Onfido from 'Sections/Verification/ProofOfIdentity/onfido.jsx';
import CardDetails from './card-details';

const ACTIONS = {
    ADD_FILE: 'ADD_FILE',
    REMOVE_FILE: 'REMOVE_FILE',
    REMOVE_ALL: 'REMOVE_ALL',
};

const STATUS = {
    is_uploading: 'is_uploading',
    is_completed: 'is_completed',
};

const reducerFiles = (state, { type, payload }) => {
    const target_index = state.findIndex(el => el.step === payload);

    switch (type) {
        case ACTIONS.ADD_FILE:
            return [...state, payload];
        case ACTIONS.REMOVE_FILE:
            return [...state.slice(0, target_index), ...state.slice(target_index + 1)];
        case ACTIONS.REMOVE_ALL:
            return [];
        default:
            return state;
    }
};

const getActiveStep = (files, steps) => {
    let active_step = null;
    if (!files.length) {
        return 0;
    }
    const confirmed_steps = files.map(file => {
        return file.step;
    });

    steps.forEach((step, index) => {
        if (active_step === null && !confirmed_steps.includes(index)) {
            active_step = index;
        }
    });
    return active_step;
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
    ...props
}) => {
    const [status, setStatus] = React.useState();
    const [file_list, dispatchFileList] = React.useReducer(reducerFiles, []);

    const onConfirm = (data, callback) => {
        // if (is_last_step) {
        //     onComplete([...file_list, data]);
        // } else {
        //     dispatchFileList({ type: ACTIONS.ADD_FILE, payload: data });
        //     callback();
        // }
    };

    const onUploadError = () => dispatchFileList({ type: ACTIONS.REMOVE_ALL });

    const uploadFiles = files =>
        new Promise((resolve, reject) => {
            const files_length = files.length;
            let file_to_upload_index = 0;
            const results = [];
            const uploadNext = () => {
                const item = files[file_to_upload_index];
                const { file, document_type, pageType } = item;
                uploadFile(file, WS.getSocket, {
                    documentType: document_type,
                    pageType,
                    expirationDate: '2022-10-30',
                    documentId: '1234',
                })
                    .then(res => {
                        file_to_upload_index += 1;
                        if (file_to_upload_index < files_length) {
                            results.push(res);
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

    const onComplete = files => {
        setStatus(STATUS.is_uploading);

        // const { file, documentType, pageType } = files[0];
        // uploadFile(file, WS.getSocket, documentType, pageType)
        //     .then(rs => {
        //         console.log(rs);
        //         setStatus(STATUS.is_completed);
        //     })
        //     .catch(err => {
        //         onUploadError();
        //         console.log(err);
        //     });

        uploadFiles(files)
            .then(() => {
                setStatus(STATUS.is_completed);
            })
            .catch(() => {
                onUploadError();
            });
    };

    const removeImagePreview = index => dispatchFileList({ type: ACTIONS.REMOVE_FILE, payload: index });

    switch (status) {
        case STATUS.is_uploading:
            return <Loading is_fullscreen={false} is_slow_loading status={[localize('Uploading documents')]} />;
        case STATUS.is_completed:
            return <Submitted />;
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
                            <Onfido
                                country_code={country_code_key}
                                documents_supported={[document.onfido_name]}
                                onfido_service_token={onfido_service_token}
                                height={height ?? null}
                                handleComplete={handleComplete}
                                {...props}
                            />
                        </React.Fragment>
                    ) : (
                        <CardDetails data={document.details} onConfirm={onConfirm} goToCards={onClickBack} />
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
};

export default DetailComponent;
