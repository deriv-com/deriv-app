import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import DetailGrid from './detail-grid.jsx';
import ImagePreview from './image-preview.jsx';
import FileUploader from '../file-uploader-container/file-uploader.jsx';

const root_class = 'unsupported-country-poi';

const FileUploaderContainer = ({ children }) => <div className={`${root_class}__upload-container`}>{children}</div>;

const DetailComponent = ({ onClickBack, icon, title, description, onChange, required_documents = 1 }) => {
    const ref = React.useRef();
    const [image_preview, setImagePreview] = React.useState(null);
    const [temp_file, setTempFile] = React.useState(null);
    const [file_list, setFileList] = React.useState([]);
    const [state_machine, setMachineState] = React.useState('upload');

    React.useEffect(() => {
        if (file_list.length === required_documents) {
            setMachineState('selfie');
        }
    }, [setMachineState, required_documents, file_list]);

    const getSocketFunc = (...args) => console.log('func called with ', ...args);

    const onFileDrop = e => {
        // TODO add proper validation for image selection
        setImagePreview(URL.createObjectURL(e.files[0]));
        setTempFile(e.files[0]);
    };

    const resetFileUpload = () => {
        setImagePreview(null);
    };

    const matches = which => state_machine === which;

    const confirm = () => {
        setFileList([...file_list, temp_file]);
        setImagePreview(null);
    };

    const removeImagePreview = item => setFileList(file_list.filter(file => file.name !== item.name));

    return (
        <div className={`${root_class}__detail`}>
            <div className={`${root_class}__detail-header`} onClick={onClickBack}>
                <Icon icon='IcArrowLeftBold' />
                <Text as='p' size='xs' weight='bold' color='prominent' className={`${root_class}__back-title`}>
                    {localize('Back')}
                </Text>
            </div>
            <div className={`${root_class}__preview-name-container`}>
                {file_list.map(item => (
                    <div key={item.name} className={`${root_class}__preview-name`}>
                        <Text size='xxxs' color='less-prominent' weight='bold'>
                            {item.name}
                        </Text>
                        <Icon icon='IcCloseCircle' onClick={() => removeImagePreview(item)} />
                    </div>
                ))}
            </div>
            <div className={`${root_class}__detail-grid`}>
                {matches('selfie') && !image_preview && (
                    <React.Fragment>
                        <Icon icon='IcSelfie' size={236} />
                        <Text as='p' size='s' weight='bold' color='prominent'>
                            {localize('Upload your selfie')}
                        </Text>
                        <Text as='p' size='xs'>
                            {localize(
                                'Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.'
                            )}
                        </Text>
                        <FileUploaderContainer>
                            <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
                        </FileUploaderContainer>
                        <DetailGrid root_class={root_class} />
                    </React.Fragment>
                )}
                {matches('selfie') && image_preview && (
                    <React.Fragment>
                        <ImagePreview image_preview={image_preview} root_class={root_class} />
                        <Text as='p' size='s' weight='bold' color='prominent'>
                            {localize('Confirm your documents')}
                        </Text>
                        <div className={`${root_class}__confirm-buttons`}>
                            <Button large onClick={resetFileUpload} secondary>
                                {localize('Upload a different file')}
                            </Button>
                            <Button large onClick={confirm} primary>
                                {localize('Confirm')}
                            </Button>
                        </div>
                    </React.Fragment>
                )}
                {matches('upload') && !image_preview && (
                    <React.Fragment>
                        <Icon icon={icon} size={236} />
                        <Text as='p' size='s' weight='bold' color='prominent'>
                            {title}
                        </Text>
                        <Text as='p' size='xs'>
                            {description}
                        </Text>
                        <FileUploaderContainer>
                            <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
                        </FileUploaderContainer>
                        <DetailGrid root_class={root_class} />
                    </React.Fragment>
                )}
                {matches('upload') && image_preview && (
                    <React.Fragment>
                        <ImagePreview image_preview={image_preview} root_class={root_class} />
                        <Text as='p' size='s' weight='bold' color='prominent'>
                            {localize('Confirm your document')}
                        </Text>
                        <Text as='p' size='xs'>
                            {localize('After confirming, you’ll be asked to upload the back of your identity card.')}
                        </Text>
                        <div className={`${root_class}__confirm-buttons`}>
                            <Button large onClick={resetFileUpload} secondary>
                                {localize('Upload a different file')}
                            </Button>
                            <Button large onClick={confirm} primary>
                                {localize('Confirm')}
                            </Button>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export { DetailComponent };
