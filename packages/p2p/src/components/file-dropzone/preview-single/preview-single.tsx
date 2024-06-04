import React, { RefObject } from 'react';
import { Text } from '@deriv/components';
import { TFileDropzone } from 'Types';
import { truncateFileName } from 'Utils/file-uploader';

type TPreviewSingle = {
    dropzone_ref: RefObject<HTMLElement>;
} & TFileDropzone;

const PreviewSingle = (props: TPreviewSingle) => {
    const { dropzone_ref, filename_limit, preview_single, value } = props;

    if (preview_single) {
        return <div className='preview-single__message'>{preview_single}</div>;
    }

    return (
        <Text
            align='center'
            className='preview-single__filename'
            size='xxs'
            styles={{
                maxWidth: `calc(${dropzone_ref.current?.offsetWidth || 365}px - 3.2rem)`,
            }}
            weight='bold'
        >
            {filename_limit ? truncateFileName(value[0], filename_limit) : value[0].name}
        </Text>
    );
};

export default PreviewSingle;
