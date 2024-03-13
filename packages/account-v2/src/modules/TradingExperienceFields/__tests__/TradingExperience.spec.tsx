import React from 'react';
import { Form, Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradingExperienceFields } from '../TradingExperienceFields';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

beforeEach(() => {
    jest.restoreAllMocks();
});

const initialValues = {
    binaryOptionsTradingExperience: '',
    binaryOptionsTradingFrequency: '',
    cfdTradingExperience: '',
    cfdTradingFrequency: '',
    forexTradingExperience: '',
    forexTradingFrequency: '',
    otherTradingInstrumentsExperience: '',
    otherTradingInstrumentsFrequency: '',
};

describe('TradingExperienceFields', () => {
    it('renders all form fields', () => {
        render(
            <Formik initialValues={initialValues} onSubmit={jest.fn()}>
                <Form>
                    <TradingExperienceFields />;
                </Form>
            </Formik>
        );

        expect(screen.getByRole('combobox', { name: 'Forex trading experience' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Forex trading frequency' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Binary options trading experience' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Binary options trading frequency' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'CFD trading experience' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'CFD trading frequency' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Other trading instruments experience' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Other trading instruments frequency' })).toBeInTheDocument();
    });
});
