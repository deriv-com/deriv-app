import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { WalletsActionScreen } from '../../../../components/WalletsActionScreen';
import { ErrorCode } from '../../constants';
import './PoiUploadError.scss';

type PoiUploadErrorProps = {
    errorCode: keyof typeof ErrorCode;
};

const errorCodeToDescriptionMapper: Record<keyof typeof ErrorCode, string> = {
    DuplicateUpload: 'Document already uploaded',
};

const PoiUploadError = ({ errorCode }: PoiUploadErrorProps) => {
    return (
        <div className='wallets-poi-upload-error'>
            <WalletsActionScreen
                description={errorCodeToDescriptionMapper[errorCode]}
                icon={<DerivLightDeclinedPoiIcon height={120} width={120} />}
                title='Proof of identity documents upload failed'
            />
        </div>
    );
};

export default PoiUploadError;
