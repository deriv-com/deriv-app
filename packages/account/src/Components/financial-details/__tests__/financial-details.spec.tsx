import { FormikValues } from 'formik';
import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinancialDetails from '../financial-details';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

const modal_root_el = document.createElement('div');
modal_root_el.setAttribute('id', 'modal_root');
document.body.appendChild(modal_root_el);

describe('<FinancialDetails />', () => {
    const mock_props: React.ComponentProps<typeof FinancialDetails> = {
        getCurrentStep: jest.fn(),
        goToNextStep: jest.fn(),
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        validate: jest.fn(() => ({ errors: {} })),
        goToPreviousStep: jest.fn(() => ({ errors: {} })),
        value: {},
    };

    const fieldsRenderCheck = () => {
        expect(screen.getByText('Anticipated annual turnover')).toBeInTheDocument();
        expect(screen.getByText('Estimated net worth')).toBeInTheDocument();
        expect(screen.getByText('Industry of employment')).toBeInTheDocument();
        expect(screen.getByText('Level of education')).toBeInTheDocument();
        expect(screen.getByText('Net annual income')).toBeInTheDocument();
        expect(screen.getByText('Occupation')).toBeInTheDocument();
        expect(screen.getByText('Source of income')).toBeInTheDocument();
        expect(screen.getByText('Source of wealth')).toBeInTheDocument();
    };

    it('should render "FinancialDetails" for desktop', () => {
        render(<FinancialDetails {...mock_props} />);

        fieldsRenderCheck();

        const inputs = screen.getAllByTestId('dti_dropdown_display');
        expect(inputs.length).toBe(8);

        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should render "FinancialDetails" for mobile', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        render(<FinancialDetails {...mock_props} />);

        fieldsRenderCheck();

        const inputs = screen.getAllByRole('combobox');
        expect(inputs.length).toBe(8);

        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should trigger "Previous" button', () => {
        render(<FinancialDetails {...mock_props} />);

        fieldsRenderCheck();

        const btns = screen.getAllByRole('button');
        expect(btns[0]).toHaveTextContent('Previous');

        fireEvent.click(btns[0]);
        expect(mock_props.getCurrentStep).toHaveBeenCalledTimes(1);
    });

    it('should trigger "Previous" or "Submit" button', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        render(<FinancialDetails {...mock_props} />);

        fieldsRenderCheck();

        const select_inputs = screen.getAllByRole('combobox');

        const account_turnover_select = select_inputs.find(
            (option: FormikValues) => option.name === 'account_turnover'
        );
        const education_level_select = select_inputs.find((option: FormikValues) => option.name === 'education_level');
        const employment_indystry_select = select_inputs.find(
            (option: FormikValues) => option.name === 'employment_industry'
        );
        const estimated_worth_select = select_inputs.find((option: FormikValues) => option.name === 'estimated_worth');
        const income_source_select = select_inputs.find((option: FormikValues) => option.name === 'income_source');
        const net_income_select = select_inputs.find((option: FormikValues) => option.name === 'net_income');
        const occuppation_select = select_inputs.find((option: FormikValues) => option.name === 'occupation');

        const source_of_wealth_select = select_inputs.find(
            (option: FormikValues) => option.name === 'source_of_wealth'
        );

        fireEvent.change(account_turnover_select as HTMLElement, { target: { value: 'account turnover 1' } });

        fireEvent.change(education_level_select as HTMLElement, { target: { value: 'education level 2' } });
        fireEvent.change(employment_indystry_select as HTMLElement, { target: { value: 'employment industry 1' } });
        fireEvent.change(estimated_worth_select as HTMLElement, { target: { value: 'estimated worth 2' } });
        fireEvent.change(income_source_select as HTMLElement, { target: { value: 'income source 1' } });
        fireEvent.change(net_income_select as HTMLElement, { target: { value: 'net income 1' } });
        fireEvent.change(occuppation_select as HTMLElement, { target: { value: 'occupation 2' } });

        fireEvent.change(source_of_wealth_select as HTMLElement, { target: { value: 'source of wealth 1' } });

        const btns = screen.getAllByRole('button');
        expect(btns[1]).toHaveTextContent('Next');

        fireEvent.click(btns[1]);
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should change the selected value when user changes the value in the dropdown', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        render(<FinancialDetails {...mock_props} />);

        const select_inputs = screen.getAllByRole('combobox');

        const income_source_select = select_inputs.find((option: FormikValues) => option.name === 'income_source');

        userEvent.selectOptions(income_source_select as HTMLElement, 'Salaried Employee');

        expect(screen.getByRole('option', { name: 'Salaried Employee' }).selected).toBe(true);
    });
});
