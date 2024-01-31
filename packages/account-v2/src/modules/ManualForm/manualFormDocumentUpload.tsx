import React, { Fragment } from 'react';
import { WalletText } from '../../components/base/WalletText';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getTitleForDocumentUpload } from '../../helpers/manualFormHelpers';

type TManualFormDocumentUploadProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormDocumentUpload = ({ selectedDocument }: TManualFormDocumentUploadProps) => (
    <Fragment>
        <WalletText>{getTitleForDocumentUpload(selectedDocument)}</WalletText>
        <div className='flex gap-1200 w-full justify-between'>
            <div className='border-100 border-solid w-full'>Drop file 1</div>
            <div className='border-100 border-solid w-full'>Drop file 2</div>
        </div>
    </Fragment>
);
