import React from 'react';
import { Formik } from 'formik';
import * as formik from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionInputs from '../self-exclusion-inputs';
import SelfExclusionContext from '../self-exclusion-context';

jest.mock('../self-exclusion-footer', () => () => <div>SelfExclusionFooter</div>);

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext');

describe('<SelfExclusionInputs />', () => {
    let mock_context = {};

    beforeEach(() => {
        mock_context = {
            currency: 'test currency',
            currency_display: 'test currency',
            footer_ref: null,
            getMaxLength: jest.fn(),
            goToConfirm: jest.fn(),
            is_appstore: false,
            is_app_settings: false,
            is_eu: false,
            is_mf: false,
            is_mlt: false,
            is_mx: false,
            is_tablet: false,
            session_duration_digits: 0,
        };
        mockUseFormikContext.mockReturnValue({
            dirty: false,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            isSubmitting: false,
            isValid: false,
            setFieldValue: jest.fn(),
            values: {},
        });
    });

    it('should render SelfExclusionFooter instead of Next Button', () => {
        mock_context.footer_ref = true;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.getByText('SelfExclusionFooter')).toBeInTheDocument();
    });

    it('should render "Next" button and trigger click', () => {
        mockUseFormikContext.mockReturnValue({
            values: {},
            isSubmitting: false,
            isValid: true,
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            setFieldValue: jest.fn(),
        });

        const mockGoToConfirm = mock_context.goToConfirm;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.queryByText('SelfExclusionFooter')).not.toBeInTheDocument();
        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(mockGoToConfirm).toHaveBeenCalledTimes(1);
    });

    it('should render SelfExclusionInputs component with options mlt and should render "Next" button and trigger click', () => {
        mock_context.is_mlt = true;

        mockUseFormikContext.mockReturnValue({
            values: {
                exclude_until: 1,
                max_balance: 9999,
                max_deposit: 99,
                max_losses: 13,
                max_open_bets: 13,
                max_turnover: 99,
                max_7day_deposit: 777,
                max_7day_losses: 50,
                max_7day_turnover: 70,
                max_30day_deposit: 999,
                max_30day_losses: 999,
                max_30day_turnover: 999,
                session_duration_limit: 0,
                timeout_until: 0,
            },
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            isSubmitting: false,
            isValid: true,
            setFieldValue: jest.fn(),
        });

        const mockGoToConfirm = mock_context.goToConfirm;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const currencies = screen.getAllByText(/test currency/);
        expect(currencies.length).toBeGreaterThan(0);
        expect(
            screen.getByText(
                /If you are a UK resident, to self-exclude from all online gambling companies licensed in Great Britain, go to/
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Self-exclusion on the website only applies to your Deriv.com account and does not include other companies or websites.'
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText(/To self-exclude from all online gambling companies licensed in Great Britain, go to/)
        ).not.toBeInTheDocument();
        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(mockGoToConfirm).toHaveBeenCalledTimes(1);
    });

    it('should render SelfExclusionInputs component with options mx', () => {
        mock_context.is_mx = true;

        mockUseFormikContext.mockReturnValue({
            values: {
                exclude_until: 1,
                max_balance: 9999,
                max_deposit: 99,
                max_losses: 13,
                max_open_bets: 13,
                max_turnover: 99,
                max_7day_deposit: 777,
                max_7day_losses: 50,
                max_7day_turnover: 70,
                max_30day_deposit: 999,
                max_30day_losses: 999,
                max_30day_turnover: 999,
                session_duration_limit: 0,
                timeout_until: 0,
            },
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            isSubmitting: false,
            isValid: true,
            setFieldValue: jest.fn(),
        });

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const currencies = screen.getAllByText(/test currency/);
        expect(currencies.length).toBeGreaterThan(0);
        expect(
            screen.getByText(
                'Self-exclusion on the website only applies to your Deriv.com account and does not include other companies or websites.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(/To self-exclude from all online gambling companies licensed in Great Britain, go to/)
        ).toBeInTheDocument();
        expect(
            screen.queryByText(
                /If you are a UK resident, to self-exclude from all online gambling companies licensed in Great Britain, go to/
            )
        ).not.toBeInTheDocument();
    });

    it('Should trigger handleChange callback when the input field changes in StakeLossAndLimitsInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input = container.querySelector(`input[name="max_turnover"]`);
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input, { target: { value: 200 } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in SessionAndLoginLimitsInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input = container.querySelector(`input[name="session_duration_limit"]`);
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input, { target: { value: 500 } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in MaximumAccountBalanceAndOpenPositionsInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input = container.querySelector(`input[name="max_balance"]`);
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input, { target: { value: 900 } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
        expect(el_input.value).toBe('900');
    });

    it('Should trigger handleChange callback when the input field changes in MaximumDepositLimitInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;
        mock_context.is_mlt = true;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input = container.querySelector(`input[name="max_deposit"]`);
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input, { target: { value: 700 } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
        expect(el_input.value).toBe('700');
    });

    it('Should trigger onChange callback when the date field changes in SessionAndLoginLimitsInputs', () => {
        const mockSetFieldValue = mockUseFormikContext().setFieldValue;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const exclude_date_input = container.querySelector(`input[name="exclude_until"]`);
        expect(exclude_date_input).toBeInTheDocument();
        fireEvent.click(exclude_date_input);
        fireEvent.change(exclude_date_input, { target: { value: '2012-12-12' } });
        expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
        expect(mockSetFieldValue).toHaveBeenCalledWith('exclude_until', '2012-12-12', true);
    });
});
