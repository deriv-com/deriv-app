import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const DetailComponent = ({ onClickBack, root_class, children }) => {
    // const ref = React.useRef();
    // const [image_preview, setImagePreview] = React.useState(null);
    // const [temp_file, setTempFile] = React.useState(null);
    const [file_list, setFileList] = React.useState([]);
    // const [state_machine, setMachineState] = React.useState('upload');
    //
    // React.useEffect(() => {
    //     if (file_list.length === required_documents) {
    //         setMachineState('selfie');
    //     }
    // }, [setMachineState, required_documents, file_list]);

    // const getSocketFunc = (...args) => console.log('func called with ', ...args);
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
    const confirm = (files, callback) => {
        console.log('Submit files', files);
        callback();
    };

    const removeImagePreview = item => setFileList(file_list.filter(file => file.name !== item.name));

    const children_with_props = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { onCancel: onClickBack, onConfirm: confirm, root_class });
        }
        return child;
    });

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
                    console.log(item);
                    return (
                        <div key={item.name} className={`${root_class}__preview-name`}>
                            <Text size='xxxs' color='less-prominent' weight='bold'>
                                {item.name}
                            </Text>
                            <Icon icon='IcCloseCircle' onClick={() => removeImagePreview(item)} />
                        </div>
                    );
                })}
            </div>
            <div className={`${root_class}__detail-grid`}>{children_with_props}</div>
        </div>
    );
};

export { DetailComponent };
