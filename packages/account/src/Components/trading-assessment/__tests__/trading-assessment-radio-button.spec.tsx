import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TradingAssessmentRadioButton from '../trading-assessment-radio-buttons';
import { TTradingAssessmentForm } from 'Types';
import { Form, Formik } from 'formik';
import userEvent from '@testing-library/user-event';

describe('TradingAssessmentRadioButton', () => {
    const mockOnChange = jest.fn();
    const mockSetEnableNextSection = jest.fn();

    const baseProps = {
        disabled_items: [],
        text: 'Do you understand that you could potentially lose 100% of the money you use to trade?',
        list: [
            { text: 'Yes', value: 'Yes' },
            { text: 'No', value: 'No' },
        ],
        onChange: mockOnChange,
        values: {
            cfd_experience: '',
            cfd_frequency: '',
            cfd_trading_definition: '',
            leverage_impact_trading: '',
            leverage_trading_high_risk_stop_loss: '',
            required_initial_margin: '',
            risk_tolerance: '',
            source_of_experience: '',
            trading_experience_financial_instruments: '',
            trading_frequency_financial_instruments: '',
        },
        form_control: 'risk_tolerance' as keyof TTradingAssessmentForm,
        setEnableNextSection: mockSetEnableNextSection,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render on the DOM', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <TradingAssessmentRadioButton {...baseProps} />
                </Form>
            </Formik>
        );
        const radioButtons = screen.getAllByRole('radio');
        expect(radioButtons).toHaveLength(2);
    });

    it('should render the correct text', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <TradingAssessmentRadioButton {...baseProps} />
                </Form>
            </Formik>
        );
        const text = screen.getByText(baseProps.text);
        expect(text).toBeInTheDocument();
    });

    it('should updates values and calls onChange when a radio item is selected', async () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <TradingAssessmentRadioButton {...baseProps} />
                </Form>
            </Formik>
        );
        const radioButtons = screen.getAllByRole('radio');
        userEvent.click(radioButtons[0]);
        expect(radioButtons[0]).toBeChecked();
        await waitFor(() => {
            expect(mockSetEnableNextSection).toHaveBeenCalled();
            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    it('calls setEnableNextSection based on existence of form_control value in values', () => {
        const propsWithValue = {
            ...baseProps,
            values: {
                cfd_experience: '',
                cfd_frequency: '',
                cfd_trading_definition: '',
                leverage_impact_trading: '',
                leverage_trading_high_risk_stop_loss: '',
                required_initial_margin: '',
                risk_tolerance: 'Yes',
                source_of_experience: '',
                trading_experience_financial_instruments: '',
                trading_frequency_financial_instruments: '',
            },
        };

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <TradingAssessmentRadioButton {...propsWithValue} />
                </Form>
            </Formik>
        );
        expect(mockSetEnableNextSection).toHaveBeenCalledWith(true);

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <TradingAssessmentRadioButton {...baseProps} />
                </Form>
            </Formik>
        );
        expect(mockSetEnableNextSection).toHaveBeenCalledWith(false);
    });
});
