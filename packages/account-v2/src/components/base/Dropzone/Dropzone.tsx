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
import { StandaloneXmarkRegularIcon as CloseIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import DropzoneFrame from '../../../assets/dropzone/dropzone-frame.svg';
import { WalletText } from '../WalletText';
import './Dropzone.scss';

type TProps = {
    buttonText?: ReactNode;
    className?: string;
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
    className,
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
        <div {...getRootProps()} className={className} ref={rootRef as RefObject<HTMLDivElement>}>
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
                                <WalletText align='center' color='primary' size='xs' weight={titleType}>
                                    {title}
                                </WalletText>
                            )}
                            <WalletText align='center' color={descriptionColor} size={descriptionSize}>
                                {description}
                            </WalletText>
                            {buttonText && (
                                <div className='wallets-dropzone__placeholder-text'>
                                    <Button onClick={open} variant='outlined'>
                                        {buttonText}
                                    </Button>
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
                                <CloseIcon iconSize='sm' onClick={removeFile} />
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
