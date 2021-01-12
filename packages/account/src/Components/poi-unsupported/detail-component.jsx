import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Details from './details.jsx';
import Selfi from './selfie.jsx';

const ACTIONS = {
    ADD_FILE: 'ADD_FILE',
    REMOVE_FILE: 'REMOVE_FILE',
};

const reducerFiles = (state = [], { type, payload }) => {
    switch (type) {
        case ACTIONS.ADD_FILE:
            return [...state, payload];
        case ACTIONS.REMOVE_FILE:
            return [...state.slice(0, payload), ...state.slice(payload + 1)];
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

const DetailComponent = ({ steps, onClickBack, root_class }) => {
    // const ref = React.useRef();
    // const [image_preview, setImagePreview] = React.useState(null);
    // const [temp_file, setTempFile] = React.useState(null);
    const [is_completed, setIsCompleted] = React.useState(false);
    const [file_list, dispatchFileList] = React.useReducer(reducerFiles, []);
    const active_step = getActiveStep(file_list, steps);
    // const [state_machine, setMachineState] = React.useState('upload');
    //
    // React.useEffect(() => {
    //     if (file_list.length === required_documents) {
    //         setMachineState('selfie');
    //     }
    // }, [setMachineState, required_documents, file_list]);

    const getSocketFunc = (...args) => console.log('func called with ', ...args);
    // const onFileDrop = e => {
    //     // TODO add proper validation for image selection
    //     setImagePreview(URL.createObjectURL(e.files[0]));
    //     setTempFile(e.files[0]);
    // };
    //
    // const resetFileUpload = () => {
    //     setImagePreview(null);
    // };
    //
    // const matches = which => state_machine === which;
    //
    const confirm = (data, callback) => {
        dispatchFileList({ type: ACTIONS.ADD_FILE, payload: data });
        callback();
    };

    const confirmSelfie = file => {
        setIsCompleted(true);
    };

    const removeImagePreview = index => dispatchFileList({ type: ACTIONS.REMOVE_FILE, payload: index });

    if (is_completed) {
        return (
            <Text size='xxxs' color='less-prominent' weight='bold'>
                Your proof of identity was submitted successfully
            </Text>
        );
    }

    return (
        <div className={`${root_class}__detail`}>
            <div className={`${root_class}__detail-header`} onClick={onClickBack}>
                <Icon icon='IcArrowLeftBold' />
                <Text as='p' size='xs' weight='bold' color='prominent' className={`${root_class}__back-title`}>
                    {localize('Back')}
                </Text>
            </div>
            <div className={`${root_class}__preview-name-container`}>
                {file_list.map(item => {
                    return (
                        <div key={item.file.name} className={`${root_class}__preview-name`}>
                            <Text size='xxxs' color='less-prominent' weight='bold'>
                                {item.file.name}
                            </Text>
                            <Icon icon='IcCloseCircle' onClick={() => removeImagePreview(item.step)} />
                        </div>
                    );
                })}
            </div>
            <div className={`${root_class}__detail-grid`}>
                {active_step !== null ? (
                    <Details
                        step={steps[active_step]}
                        active_step={active_step}
                        nCancel={onClickBack}
                        onConfirm={confirm}
                        root_class={root_class}
                    />
                ) : (
                    <Details
                        step={{
                            icon: 'IcSelfie',
                            title: localize('Upload your selfie'),
                            description: localize(
                                'Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.'
                            ),
                        }}
                        active_step='selfie'
                        nCancel={onClickBack}
                        onConfirm={confirmSelfie}
                        root_class={root_class}
                    />
                )}
            </div>
        </div>
    );
};

export { DetailComponent };
