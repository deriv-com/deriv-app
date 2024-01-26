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
import CloseIcon from '../../public/images/close-icon.svg';
import DropzoneFrame from '../../public/images/dropzone-frame.svg';
import { IconButton, WalletButton, WalletText } from '../Base';
import './Dropzone.scss';

type TProps = {
    buttonText?: ReactNode;
    defaultFile?: File;
    description?: ReactNode;
    descriptionColor?: ComponentProps<typeof WalletText>['color'];
    descriptionSize?: ComponentProps<typeof WalletText>['size'];
    fileFormats?: NonNullable<Parameters<typeof useDropzone>[0]>['accept'];
    hasFrame?: boolean;
    hoverMessage?: ReactNode;
    icon: ReactNode;
    maxSize?: NonNullable<Parameters<typeof useDropzone>[0]>['maxSize'];
    noClick?: NonNullable<Parameters<typeof useDropzone>[0]>['noClick'];
    onFileChange?: (file: File) => void;
    title?: ReactNode;
    titleType?: ComponentProps<typeof WalletText>['weight'];
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
    const [file, setFile] = useState<TFile | null>(
        defaultFile ? { file: defaultFile, name: defaultFile.name, preview: URL.createObjectURL(defaultFile) } : null
    );
    const [showHoverMessage, setShowHoverMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            setErrorMessage(null);
        },
        onDropRejected(fileRejections) {
            setErrorMessage(fileRejections?.[0]?.errors?.[0].message);
        },
    });

    useEffect(() => {
        if (file && onFileChange) {
            onFileChange(file.file);
        }
    }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

    const removeFile = useCallback(() => {
        setFile(null);
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
                    { 'wallets-dropzone--active': file }
                )}
            >
                <div className='wallets-dropzone__content'>
                    {showHoverMessage && <WalletText size='sm'>{hoverMessage}</WalletText>}
                    {!showHoverMessage && !file && (
                        <div className='wallets-dropzone__placeholder'>
                            <div className='wallets-dropzone__placeholder-icon'>{icon}</div>
                            {title && (
                                <WalletText align='center' color='primary' size='md' weight={titleType}>
                                    {title}
                                </WalletText>
                            )}
                            <WalletText align='center' color={descriptionColor} size={descriptionSize}>
                                {description}
                            </WalletText>
                            {buttonText && (
                                <div className='wallets-dropzone__placeholder-text'>
                                    <WalletButton onClick={open} variant='outlined'>
                                        {buttonText}
                                    </WalletButton>
                                </div>
                            )}
                            {errorMessage && (
                                <WalletText align='center' color='red' size='2xs'>
                                    {errorMessage}
                                </WalletText>
                            )}
                        </div>
                    )}
                    {!showHoverMessage && file && (
                        <React.Fragment key={file.name}>
                            <div
                                className={classNames('wallets-dropzone__thumb', {
                                    'wallets-dropzone__thumb--has-frame': hasFrame,
                                })}
                                style={{ backgroundImage: `url(${file.preview})` }}
                            >
                                {hasFrame && <DropzoneFrame />}
                                <IconButton
                                    className='wallets-dropzone__remove-file'
                                    data-testid='dt_remove-button'
                                    icon={<CloseIcon width={12} />}
                                    onClick={removeFile}
                                    size='sm'
                                />
                            </div>
                            {description && (
                                <WalletText align='center' color={descriptionColor}>
                                    {description}
                                </WalletText>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dropzone;
