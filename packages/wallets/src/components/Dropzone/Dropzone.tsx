import React, {
    ComponentProps,
    DetailedHTMLProps,
    InputHTMLAttributes,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useState,
} from 'react';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { DerivLightDropzoneFrameIcon, DerivLightIcCloudUploadIcon, LegacyClose2pxIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { IconButton } from '../Base';
import './Dropzone.scss';

type TProps = {
    buttonText?: ReactNode;
    defaultFile?: File;
    description?: ReactNode;
    descriptionColor?: ComponentProps<typeof Text>['color'];
    descriptionSize?: ComponentProps<typeof Text>['size'];
    fileFormats?: NonNullable<Parameters<typeof useDropzone>[0]>['accept'];
    hasFrame?: boolean;
    hoverMessage?: ReactNode;
    icon: ReactNode;
    maxSize?: NonNullable<Parameters<typeof useDropzone>[0]>['maxSize'];
    noClick?: NonNullable<Parameters<typeof useDropzone>[0]>['noClick'];
    onFileChange?: (file?: File) => void;
    title?: ReactNode;
    titleType?: ComponentProps<typeof Text>['weight'];
};

type TFile = {
    file: File;
    name: string;
    preview: string;
};

const Dropzone: React.FC<TProps> = ({
    buttonText,
    defaultFile,
    description,
    descriptionColor = 'general',
    descriptionSize = 'md',
    fileFormats,
    hasFrame = false,
    hoverMessage = 'Drop file here',
    icon,
    maxSize,
    noClick = false,
    onFileChange,
    title = false,
    titleType = 'normal',
}) => {
    const { localize } = useTranslations();

    const getFileErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'file-too-large':
                return localize('File size should be 8MB or less');
            default:
                return localize('File uploaded is not supported');
        }
    };

    const [file, setFile] = useState<TFile | null>(
        defaultFile ? { file: defaultFile, name: defaultFile.name, preview: URL.createObjectURL(defaultFile) } : null
    );

    const { isDesktop } = useDevice();
    const [showHoverMessage, setShowHoverMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const { getInputProps, getRootProps, open, rootRef } = useDropzone({
        accept: fileFormats,
        maxSize,
        multiple: false,
        noClick,
        onDragEnter: () => setShowHoverMessage(true),
        onDragLeave: () => setShowHoverMessage(false),
        onDrop: acceptedFiles => {
            setShowHoverMessage(false);
            const acceptedFile = acceptedFiles?.[0];
            if (acceptedFile) {
                setFile({
                    file: acceptedFile,
                    name: acceptedFile.name,
                    preview: URL.createObjectURL(acceptedFile),
                });
            }
        },
        onDropAccepted() {
            setErrorMessage(undefined);
        },
        onDropRejected(fileRejections) {
            if (fileRejections?.[0]?.errors?.[0].message) {
                const message = getFileErrorMessage(fileRejections[0].errors[0].code);
                setErrorMessage(message);
            }
        },
    });

    useEffect(() => {
        if (onFileChange) {
            onFileChange(file?.file);
        }
    }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

    const removeFile = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setFile(null);
        e.stopPropagation();
    }, []);

    const resetError = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setErrorMessage(undefined);
        e.stopPropagation();
    }, []);

    return (
        <div {...getRootProps()} className='wallets-dropzone__container' ref={rootRef as RefObject<HTMLDivElement>}>
            <input
                {...(getInputProps() as DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>)}
                data-testid='dt_dropzone-input'
            />
            <div
                className={classNames(
                    'wallets-dropzone',
                    { 'wallets-dropzone--hover': showHoverMessage },
                    { 'wallets-dropzone--active': file },
                    { 'wallets-dropzone--error': errorMessage }
                )}
            >
                <div className='wallets-dropzone__content'>
                    {showHoverMessage && <Text size='sm'>{hoverMessage}</Text>}
                    {!showHoverMessage && !errorMessage && !file && (
                        <div className='wallets-dropzone__placeholder'>
                            <div className='wallets-dropzone__placeholder-icon'>{icon}</div>
                            {title && (
                                <Text align='center' color='primary' size='md' weight={titleType}>
                                    {title}
                                </Text>
                            )}
                            <Text align='center' color={descriptionColor} size={descriptionSize}>
                                {description}
                            </Text>
                            {buttonText && (
                                <div className='wallets-dropzone__placeholder-text'>
                                    <Button
                                        borderWidth='sm'
                                        className='wallets-dropzone__button'
                                        color='black'
                                        onClick={open}
                                        textSize={isDesktop ? 'sm' : 'md'}
                                        variant='outlined'
                                    >
                                        {buttonText}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {!showHoverMessage && file && (
                        <React.Fragment key={file.name}>
                            {file.file.type.indexOf('pdf') !== -1 ? (
                                <div className='wallets-dropzone__thumb wallets-dropzone__thumb--pdf'>
                                    <IconButton
                                        className='wallets-dropzone__remove-file'
                                        data-testid='dt_remove-button'
                                        icon={<LegacyClose2pxIcon iconSize='xs' width={12} />}
                                        onClick={removeFile}
                                        size='sm'
                                    />
                                    <DerivLightIcCloudUploadIcon height={50} width={50} />
                                    <Text align='center' size='sm'>
                                        {file.name.length > 30 ? `${file.name.slice(0, 30)}....pdf` : file.name}
                                    </Text>
                                </div>
                            ) : (
                                <div
                                    className={classNames('wallets-dropzone__thumb', {
                                        'wallets-dropzone__thumb--has-frame': hasFrame,
                                    })}
                                    style={{ backgroundImage: `url(${file.preview})` }}
                                >
                                    {/* TODO: Change implementation to use quill icons after version update */}
                                    {hasFrame && <DerivLightDropzoneFrameIcon height='80px' width='130px' />}
                                    <IconButton
                                        className='wallets-dropzone__remove-file'
                                        data-testid='dt_remove-button'
                                        icon={<LegacyClose2pxIcon iconSize='xs' width={12} />}
                                        onClick={removeFile}
                                        size='sm'
                                    />
                                </div>
                            )}
                            {description && (
                                <Text align='center' color={descriptionColor}>
                                    {description}
                                </Text>
                            )}
                        </React.Fragment>
                    )}
                    {errorMessage && (
                        <div className='wallets-dropzone__error'>
                            <IconButton
                                className='wallets-dropzone__remove-file'
                                data-testid='dt_remove-button'
                                icon={<LegacyClose2pxIcon iconSize='xs' width={12} />}
                                onClick={resetError}
                                size='sm'
                            />
                            <Text align='center' color='red'>
                                {errorMessage}
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dropzone;
