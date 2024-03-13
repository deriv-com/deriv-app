import React, { ComponentProps } from 'react';
import { Formik, FormikValues } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getManualFormValidationSchema } from '../../../utils/manualFormUtils';
import { ManualFormDocumentUpload } from '../ManualFormDocumentUpload';

describe('ManualFormDocumentUpload', () => {
    const mockProps: ComponentProps<typeof ManualFormDocumentUpload> = {
        selectedDocument: 'passport',
    };

    let formValues: FormikValues = {};

    const renderComponent = (props = mockProps) => {
        const validationSchema = getManualFormValidationSchema(props.selectedDocument, false);
        return render(
            <Formik
                initialValues={{ ...validationSchema.getDefault(), documentNumber: '12345' }}
                onSubmit={jest.fn()}
                validationSchema={validationSchema}
            >
                {({ values }) => {
                    formValues = values;
                    return <ManualFormDocumentUpload {...props} />;
                }}
            </Formik>
        );
    };

    it('should render with one FileUpload when document type is passport', () => {
        renderComponent();

        expect(screen.getByText(/Upload the page of your passport that contains your photo/)).toBeInTheDocument();
        expect(screen.getByTestId('dt_dropzone_input')).toBeInTheDocument();
    });

    it('should render with two FileUploads when document type is nimc_slip', () => {
        renderComponent({ selectedDocument: 'nimc_slip' });

        expect(screen.getByText(/Upload your NIMC slip/)).toBeInTheDocument();
        expect(
            screen.getByText(/Upload your proof of age: birth certificate or age declaration document/)
        ).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_dropzone_input')).toHaveLength(2);
    });

    it('should throw error message when wrong file type is uploaded', async () => {
        renderComponent();
        const file = new File(['test file content'], 'test-file.txt', { type: 'text/plain' });

        await waitFor(() => {
            const elDropZone = screen.getByTestId('dt_dropzone_input');
            userEvent.upload(elDropZone, file);
        });

        expect(formValues?.front).toBeNull();
        expect(await screen.findByText(/File type must be one of/)).toBeInTheDocument();
    });

    it('should throw an error if not wrapped with Formik', () => {
        expect(() => render(<ManualFormDocumentUpload {...mockProps} />)).toThrow();
    });
});
