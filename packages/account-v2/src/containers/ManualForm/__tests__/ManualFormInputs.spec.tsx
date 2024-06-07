import React, { ComponentProps } from 'react';
import { Formik } from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getManualFormValidationSchema } from '../../../utils/manualFormUtils';
import { ManualFormInputs } from '../ManualFormInputs';

describe('ManualFormInputs', () => {
    const mockProps: ComponentProps<typeof ManualFormInputs> = {
        isExpiryDateRequired: false,
        selectedDocument: 'passport',
    };

    const renderComponent = (props = mockProps) => {
        const validationSchema = getManualFormValidationSchema(props.selectedDocument, props.isExpiryDateRequired);

        return render(
            <Formik initialValues={{}} onSubmit={jest.fn()} validationSchema={validationSchema}>
                <ManualFormInputs {...props} />
            </Formik>
        );
    };

    const labelExpiryDate = 'Expiry date*';

    it('should render the correct inputs', () => {
        renderComponent();
        const inputs = screen.getByRole('textbox');
        const elExpiryDate = screen.queryByLabelText(labelExpiryDate);

        expect(inputs).toBeInTheDocument();
        expect(elExpiryDate).not.toBeInTheDocument();
    });

    it('should render the correct inputs when expiry date is required', () => {
        renderComponent({ ...mockProps, isExpiryDateRequired: true });
        const inputs = screen.getAllByRole('textbox');
        const elExpiryDate = screen.getByLabelText(labelExpiryDate);

        expect(inputs).toHaveLength(2);
        expect(elExpiryDate).toBeInTheDocument();
    });

    it('should throw error when document number field has invalid value', async () => {
        renderComponent({ ...mockProps, isExpiryDateRequired: true });
        const elDocumentNumber = screen.getByLabelText('Passport number*');

        userEvent.type(elDocumentNumber, '123');
        userEvent.clear(elDocumentNumber);

        userEvent.tab();

        const error = await screen.findByText(/Passport number is required/);

        expect(error).toBeInTheDocument();
    });

    it('should throw error when expiry date field has invalid value', async () => {
        renderComponent({ ...mockProps, isExpiryDateRequired: true });
        const elExpiryDate = screen.getByLabelText(labelExpiryDate);

        fireEvent.focus(elExpiryDate);

        fireEvent.blur(elExpiryDate);

        const error = await screen.findByText(/Expiry date is required/);

        expect(error).toBeInTheDocument();
    });

    it('should throw error when ManualFormInputs is not wrapped with Formik', () => {
        expect(() => render(<ManualFormInputs {...mockProps} />)).toThrowError();
    });
});
