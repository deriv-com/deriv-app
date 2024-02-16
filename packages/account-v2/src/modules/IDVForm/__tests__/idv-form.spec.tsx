import React, { ComponentProps } from 'react';
import { Formik } from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IDVForm } from '../idv-form';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

type TIDVFormProps = ComponentProps<typeof IDVForm>;

describe('IDVForm', () => {
    const renderComponent = (props: TIDVFormProps = { selectedCountry: {} }) => {
        return render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <IDVForm {...props} />
            </Formik>
        );
    };

    it('should render IDVForm', () => {
        renderComponent();

        expect(screen.getByText(/Choose the document type/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter your document number/i)).toBeInTheDocument();
    });

    it('should throw error when IDVform is not wrapped with Formik', () => {
        expect(() => render(<IDVForm selectedCountry={{}} />)).toThrowError();
    });
});
