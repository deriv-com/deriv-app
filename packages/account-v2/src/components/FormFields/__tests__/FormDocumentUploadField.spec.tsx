import React from 'react';
import { Form, Formik } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDocumentUploadField } from '../FormDocumentUploadField';

describe('FormDocumentUploadField', () => {
    beforeAll(() => {
        global.URL.createObjectURL = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders without errors', () => {
        render(
            <Formik initialValues={{ document: null }} onSubmit={jest.fn()}>
                <FormDocumentUploadField
                    icon={null}
                    name='document'
                    title='Drag and drop a file or click to browse your files.'
                />
            </Formik>
        );

        expect(screen.getByText('Drag and drop a file or click to browse your files.')).toBeInTheDocument();
    });

    it('updates form field value on file change', async () => {
        const onSubmit = jest.fn();
        let formValues = { document: null };
        render(
            <Formik initialValues={{ document: null }} onSubmit={onSubmit}>
                {({ values }) => {
                    formValues = values;
                    return (
                        <Form>
                            <FormDocumentUploadField icon={null} name='document' />
                        </Form>
                    );
                }}
            </Formik>
        );

        const file = new File(['test file content'], 'test-file.txt', { type: 'text/plain' });

        await waitFor(() => {
            const input = screen.getByTestId('dt_dropzone_input');
            userEvent.upload(input, file);
        });

        expect(formValues?.document).toEqual(file);
    });
});
