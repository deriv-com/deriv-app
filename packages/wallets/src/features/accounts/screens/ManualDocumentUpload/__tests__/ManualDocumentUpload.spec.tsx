import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { FlowProvider } from '../../../../../components';
import ManualDocumentUpload from '../ManualDocumentUpload';

describe('<ManualDocumentUpload />', () => {
    it('should set selected document', () => {
        const screens = {
            manualScreen: <ManualDocumentUpload />,
        };

        render(
            <APIProvider>
                <AuthProvider>
                    <FlowProvider initialValues={{}} screens={screens}>
                        {() => {
                            return <ManualDocumentUpload />;
                        }}
                    </FlowProvider>
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Please upload one of the following documents:')).toBeInTheDocument();
        const passportCard = screen.getByTestId('dt_passport');
        expect(passportCard).toBeInTheDocument();
        passportCard.click();
        expect(screen.getByTestId('dt_passport-document-upload')).toBeInTheDocument();
    });
});
