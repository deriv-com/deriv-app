import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SelfExclusionInputs from '../self-exclusion-inputs';
import SelfExclusionContext from '../self-exclusion-context';
import { Formik } from 'formik';
import * as formik from 'formik';

let mockContext = {};

jest.mock('../self-exclusion-footer', () => () => <div>SelfExclusionFooter</div>);

const useFormikContextMock = jest.spyOn(formik, 'useFormikContext');

beforeEach(() => {
    mockContext = {
        is_appstore: false,
        is_eu: false,
        footer_ref: null,
        goToConfirm: jest.fn(),
        is_app_settings: false,
        currency: 'test currency',
        currency_display: 'test currency',
        getMaxLength: jest.fn(),
        is_mf: false,
        is_mlt: false,
        is_mx: false,
        is_tablet: false,
        session_duration_digits: 0,
    };
    useFormikContextMock.mockReturnValue({
        values: {},
        isSubmitting: false,
        isValid: false,
        dirty: false,
        errors: {},
        handleBlur: jest.fn(),
        handleChange: jest.fn(),
        setFieldValue: jest.fn(),
    });
});

describe('<SelfExclusionInputs />', () => {
    it('should render SelfExclusionFooter instead of Next Button', () => {
        mockContext.footer_ref = true;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.getByText('SelfExclusionFooter')).toBeInTheDocument();
    });

    it('should render "Next" button and trigger click', () => {
        useFormikContextMock.mockReturnValue({
            values: {},
            isSubmitting: false,
            isValid: true,
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            setFieldValue: jest.fn(),
        });

        const onClick = mockContext.goToConfirm;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.queryByText('SelfExclusionFooter')).not.toBeInTheDocument();
        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render SelfExclusionInputs component with options mlt and should render "Next" button and trigger click', () => {
        mockContext.is_mlt = true;

        useFormikContextMock.mockReturnValue({
            values: {
                max_turnover: 99,
                max_losses: 13,
                max_7day_turnover: 70,
                max_7day_losses: 50,
                max_30day_turnover: 999,
                max_30day_losses: 999,
                session_duration_limit: 0,
                timeout_until: 0,
                exclude_until: 1,
                max_balance: 9999,
                max_open_bets: 13,
                max_deposit: 99,
                max_7day_deposit: 777,
                max_30day_deposit: 999,
            },
            isSubmitting: false,
            isValid: true,
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            setFieldValue: jest.fn(),
        });

        const onClick = mockContext.goToConfirm;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const arrCurrency = screen.getAllByText(/test currency/);
        expect(arrCurrency.length).toBeGreaterThan(0);
        expect(
            screen.getByText(
                'Self-exclusion on the website only applies to your Deriv.com account and does not include other companies or websites.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /If you are a UK resident, to self-exclude from all online gambling companies licensed in Great Britain, go to/
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText(/To self-exclude from all online gambling companies licensed in Great Britain, go to/)
        ).not.toBeInTheDocument();

        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render SelfExclusionInputs component with options mx', () => {
        mockContext.is_mx = true;

        useFormikContextMock.mockReturnValue({
            values: {
                max_turnover: 99,
                max_losses: 13,
                max_7day_turnover: 70,
                max_7day_losses: 50,
                max_30day_turnover: 999,
                max_30day_losses: 999,
                session_duration_limit: 0,
                timeout_until: 0,
                exclude_until: 1,
                max_balance: 9999,
                max_open_bets: 13,
                max_deposit: 99,
                max_7day_deposit: 777,
                max_30day_deposit: 999,
            },
            isSubmitting: false,
            isValid: true,
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            setFieldValue: jest.fn(),
        });

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const arrCurrency = screen.getAllByText(/test currency/);
        expect(arrCurrency.length).toBeGreaterThan(0);
        expect(
            screen.getByText(
                'Self-exclusion on the website only applies to your Deriv.com account and does not include other companies or websites.'
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText(
                /If you are a UK resident, to self-exclude from all online gambling companies licensed in Great Britain, go to/
            )
        ).not.toBeInTheDocument();
        expect(
            screen.getByText(/To self-exclude from all online gambling companies licensed in Great Britain, go to/)
        ).toBeInTheDocument();
    });

    it('Should trigger handleChange callback when the input field changes in StakeLossAndLimitsInputs', () => {
        const handleChange = useFormikContextMock().handleChange;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const inputEl = container.querySelector(`input[name="max_turnover"]`);
        expect(inputEl).toBeInTheDocument();
        fireEvent.change(inputEl, { target: { value: 200 } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in SessionAndLoginLimitsInputs', () => {
        const handleChange = useFormikContextMock().handleChange;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const inputEl = container.querySelector(`input[name="session_duration_limit"]`);
        expect(inputEl).toBeInTheDocument();
        fireEvent.change(inputEl, { target: { value: 500 } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in MaximumAccountBalanceAndOpenPositionsInputs', () => {
        const handleChange = useFormikContextMock().handleChange;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const inputEl = container.querySelector(`input[name="max_balance"]`);
        expect(inputEl).toBeInTheDocument();
        fireEvent.change(inputEl, { target: { value: 900 } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(inputEl.value).toBe('900');
    });

    it('Should trigger handleChange callback when the input field changes in MaximumDepositLimitInputs', () => {
        const handleChange = useFormikContextMock().handleChange;
        mockContext.is_mlt = true;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const inputEl = container.querySelector(`input[name="max_deposit"]`);
        expect(inputEl).toBeInTheDocument();
        fireEvent.change(inputEl, { target: { value: 700 } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(inputEl.value).toBe('700');
    });

    it('Should trigger onChange callback when the date field changes in SessionAndLoginLimitsInputs', () => {
        const onChange = useFormikContextMock().setFieldValue;

        const { container } = render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const input_exclude_date = container.querySelector(`input[name="exclude_until"]`);
        expect(input_exclude_date).toBeInTheDocument();
        fireEvent.click(input_exclude_date);
        fireEvent.change(input_exclude_date, { target: { value: '2012-12-12' } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('exclude_until', '2012-12-12', true);
    });
});
