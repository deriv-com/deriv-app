import React, { CSSProperties, ReactNode, RefObject, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { IconButton, WalletButton, WalletText } from '../Base';
import CloseIcon from '../../public/images/close-icon.svg';
import './Dropzone.scss';

type TProps = {
    buttonText?: ReactNode;
    description?: ReactNode;
    fileFormats?: NonNullable<Parameters<typeof useDropzone>[0]>['accept'];
    height?: CSSProperties['height'];
    hoverMessage?: ReactNode;
    icon: ReactNode;
    maxSize?: NonNullable<Parameters<typeof useDropzone>[0]>['maxSize'];
    minHeight?: CSSProperties['minHeight'];
    minWidth?: CSSProperties['minWidth'];
    width?: CSSProperties['width'];
};

const Dropzone: React.FC<TProps> = ({
    buttonText = 'Upload',
    description,
    fileFormats,
    height,
    hoverMessage = 'Drop file here',
    icon,
    maxSize,
    minHeight,
    minWidth,
    width,
}) => {
    const [files, setFiles] = useState<
        {
            name: string;
            preview: string;
        }[]
    >([]);
    const [showHoverMessage, setShowHoverMessage] = useState(false);
    const { getInputProps, getRootProps, open, rootRef } = useDropzone({
        noClick: true,
        accept: fileFormats,
        maxSize,
        multiple: false,
        onDragEnter: () => setShowHoverMessage(true),
        onDragLeave: () => setShowHoverMessage(false),
        onDrop: acceptedFiles => {
            setShowHoverMessage(false);

            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });

    const removeFile = useCallback(
        (file: { name: string; preview: string }) => () => {
            setFiles(prev => prev.filter(f => f.name !== file.name));
        },
        []
    );

    return (
        <div
            {...getRootProps()}
            ref={rootRef as RefObject<HTMLDivElement>}
            style={{ height, minHeight, minWidth, width }}
        >
            {/* @ts-expect-error props types error */}
            <input {...getInputProps()} />
            <div
                className={classNames(
                    'wallets-dropzone',
                    { 'wallets-dropzone--hover': showHoverMessage },
                    { 'wallets-dropzone--active': files.length > 0 }
                )}
            >
                <div className='wallets-dropzone__content'>
                    {showHoverMessage && <WalletText size='sm'>{hoverMessage}</WalletText>}
                    {!showHoverMessage && !files.length && (
                        <div className='wallets-dropzone__placeholder'>
                            <div className='wallets-dropzone__placeholder-icon'>{icon}</div>
                            <div className='wallets-dropzone__placeholder-text'>
                                <WalletButton onClick={open} text={buttonText} variant='outlined' />
                            </div>
                        </div>
                    )}
                    {files.length > 0 &&
                        files.map(file => (
                            <div
                                className='wallets-dropzone__thumb'
                                key={file.name}
                                style={{ backgroundImage: `url(${file.preview})` }}
                            >
                                <IconButton
                                    className='wallets-dropzone__remove-file'
                                    icon={<CloseIcon width={12} />}
                                    onClick={removeFile(file)}
                                    size='sm'
                                />
                            </div>
                        ))}
                    {!showHoverMessage && description && <WalletText size='md'>{description}</WalletText>}
                </div>
            </div>
        </div>
    );
};

export default Dropzone;
