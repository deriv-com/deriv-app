import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { WalletButton } from '../../../../components/Base';
import { WalletsActionScreen } from '../../../../components/WalletsActionScreen';
import { ErrorCode } from '../../constants';
import './PoiUploadError.scss';
import { useFlow } from '../../../../components/FlowProvider';

type PoiUploadErrorProps = {
    errorCode: keyof typeof ErrorCode;
};

const errorCodeToDescriptionMapper: Record<keyof typeof ErrorCode, string> = {
    DuplicateUpload: 'It seems you’ve submitted this document before. Upload a new document.',
};

const PoiUploadError = ({ errorCode }: PoiUploadErrorProps) => {
    const { switchScreen } = useFlow();

    return (
        <div className='wallets-poi-upload-error'>
            <WalletsActionScreen
                description={errorCodeToDescriptionMapper[errorCode]}
                icon={<DerivLightDeclinedPoiIcon height={120} width={120} />}
                renderButtons={() => (
                    <WalletButton onClick={() => switchScreen('manualScreen')} size='lg'>
                        Try again
                    </WalletButton>
                )}
                title='Proof of identity documents upload failed'
            />
        </div>
    );
};

export default PoiUploadError;
