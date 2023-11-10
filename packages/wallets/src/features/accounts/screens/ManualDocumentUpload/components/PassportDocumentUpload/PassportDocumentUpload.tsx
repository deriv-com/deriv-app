import React from 'react';
import { WalletButton, WalletButtonGroup } from '../../../../../../components/Base';

type TProps = {
    setSelectedDocument: (document: string) => void;
};

const PassportDocumentUpload: React.FC<TProps> = ({ setSelectedDocument }) => {
    return (
        <div data-testid='dt_passport-document-upload'>
            <div>
                <WalletButtonGroup>
                    <WalletButton onClick={() => setSelectedDocument('')} text='Back' variant='outlined' />
                    <WalletButton onClick={() => setSelectedDocument('')} text='Next' />
                </WalletButtonGroup>
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
