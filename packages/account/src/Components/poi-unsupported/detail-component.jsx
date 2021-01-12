import React from 'react';
import { Loading, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Details from './details.jsx';

const ACTIONS = {
    ADD_FILE: 'ADD_FILE',
    REMOVE_FILE: 'REMOVE_FILE',
};

const reducerFiles = (state, { type, payload }) => {
    const target_index = state.findIndex(el => el.document_type === payload);

    switch (type) {
        case ACTIONS.ADD_FILE:
            return [...state, payload];
        case ACTIONS.REMOVE_FILE:
            return [...state.slice(0, target_index), ...state.slice(target_index + 1)];
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
        return file.document_type;
    });

    steps.forEach((step, index) => {
        if (active_step === null && !confirmed_steps.includes(step.document_type)) {
            active_step = index;
        }
    });
    return active_step;
};

const DetailComponent = ({ steps, onClickBack, root_class }) => {
    const [is_completed, setIsCompleted] = React.useState(false);
    const [file_list, dispatchFileList] = React.useReducer(reducerFiles, []);
    const active_step = getActiveStep(file_list, steps);

    const getSocketFunc = (...args) => console.log('func called with ', ...args);
    const confirm = (data, callback) => {
        dispatchFileList({ type: ACTIONS.ADD_FILE, payload: data });
        callback();
    };

    const confirmSelfie = selfie => {
        const files = [...file_list, selfie];
        console.log(files);
        setIsCompleted(true);
    };

    const removeImagePreview = document_type => dispatchFileList({ type: ACTIONS.REMOVE_FILE, payload: document_type });

    if (is_completed) {
        return <Loading is_fullscreen={false} is_slow_loading status={[localize('Uploading documents')]} />;
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
                            <Icon icon='IcCloseCircle' onClick={() => removeImagePreview(item.document_type)} />
                        </div>
                    );
                })}
            </div>
            <div className={`${root_class}__detail-grid`}>
                {active_step !== null ? (
                    <Details
                        step={steps[active_step]}
                        nCancel={onClickBack}
                        onConfirm={confirm}
                        root_class={root_class}
                    />
                ) : (
                    <Details
                        step={{
                            document_type: 'selfie',
                            icon: 'IcSelfie',
                            title: localize('Upload your selfie'),
                            description: localize(
                                'Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.'
                            ),
                        }}
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
