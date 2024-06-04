import React, { RefObject } from 'react';
import { TFileDropzone, truncateFileName } from '@/utils';
import { Text } from '@deriv-com/ui';
import './PreviewSingle.scss';

type TPreviewSingle = TFileDropzone & {
    dropzoneRef: RefObject<HTMLElement>;
};

const PreviewSingle = (props: TPreviewSingle) => {
    const { dropzoneRef, filenameLimit, previewSingle, value } = props;

    if (previewSingle) {
        return <div className='p2p-v2-preview-single__message'>{previewSingle}</div>;
    }

    return (
        <div
            style={{
                maxWidth: `calc(${dropzoneRef.current?.offsetWidth || 365}px - 3.2rem)`,
            }}
        >
            <Text align='center' className='p2p-v2-preview-single__filename' size='xs' weight='bold'>
                {filenameLimit ? truncateFileName(value[0], filenameLimit) : value[0].name}
            </Text>
        </div>
    );
};

export default PreviewSingle;
