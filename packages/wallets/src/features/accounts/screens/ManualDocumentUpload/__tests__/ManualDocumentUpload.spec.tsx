import React from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { FlowProvider } from '../../../../../components';
import ManualDocumentUpload from '../ManualDocumentUpload';

describe('<ManualDocumentUpload />', () => {
    it('should set selected document', () => {
        const screens = {
            manualScreen: <ManualDocumentUpload />,
        };

        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <FlowProvider initialValues={{}} screens={screens}>
                        {() => {
                            return <ManualDocumentUpload />;
                        }}
                    </FlowProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Please upload one of the following documents:')).toBeInTheDocument();
        const passportCard = screen.getByTestId('dt_passport');
        expect(passportCard).toBeInTheDocument();
        passportCard.click();
        expect(screen.getByTestId('dt_passport-document-upload')).toBeInTheDocument();
    });
});
