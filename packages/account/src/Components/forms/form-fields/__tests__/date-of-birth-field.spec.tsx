import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import DateOfBirthField from '../date-of-birth-field';

describe('Tesing <DateOfBirthField/> component', () => {
    it('should render properties', () => {
        const props: Partial<React.ComponentProps<typeof DateOfBirthField>> = {
            name: 'test-name',
            portal_id: 'test-portal-id',
        };
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                {/* @ts-expect-error [TODO] need to fix types for  DateOfBirthField component*/}
                <DateOfBirthField {...props} />
            </Formik>
        );

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});
