import React from 'react';
import { FormikValues } from 'formik';
import { EMPLOYMENT_VALUES, isDesktop, isMobile } from '@deriv/shared';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinancialDetails from '../financial-details';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

const modal_root_el = document.createElement('div');

describe('<FinancialDetails />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props: React.ComponentProps<typeof FinancialDetails> = {
        getCurrentStep: jest.fn(),
        goToNextStep: jest.fn(),
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        validate: jest.fn(() => ({ errors: {} })),
        goToPreviousStep: jest.fn(() => ({ errors: {} })),
        value: {},
        employment_status: '',
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

    const mock_store = mockStore({});

    const renderComponent = ({ props = mock_props }) => {
        render(
            <StoreProvider store={mock_store}>
                <FinancialDetails {...props} />
            </StoreProvider>
        );
    };

    it('should render "FinancialDetails" for desktop', () => {
        renderComponent({});

        fieldsRenderCheck();

        const inputs = screen.getAllByTestId('dt_dropdown_display');
        expect(inputs).toHaveLength(8);

        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should render "FinancialDetails" for mobile', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        renderComponent({});

        fieldsRenderCheck();

        const inputs = screen.getAllByRole('combobox');
        expect(inputs).toHaveLength(8);

        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should trigger "Previous" button', () => {
        renderComponent({});

        fieldsRenderCheck();

        const btns = screen.getAllByRole('button');
        expect(btns[0]).toHaveTextContent('Previous');

        userEvent.click(btns[0]);
        expect(mock_props.getCurrentStep).toHaveBeenCalled();
    });

    it('should trigger "Previous" or "Submit" button', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        renderComponent({});

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

        userEvent.type(account_turnover_select as HTMLElement, 'account turnover 1');

        userEvent.type(education_level_select as HTMLElement, 'education level 2');
        userEvent.type(employment_indystry_select as HTMLElement, 'employment industry 1');
        userEvent.type(estimated_worth_select as HTMLElement, 'estimated worth 2');
        userEvent.type(income_source_select as HTMLElement, 'income source 1');
        userEvent.type(net_income_select as HTMLElement, 'net income 1');
        userEvent.type(occuppation_select as HTMLElement, 'Government Officers');

        userEvent.type(source_of_wealth_select as HTMLElement, 'source of wealth 1');

        const btns = screen.getAllByRole('button');
        expect(btns[1]).toHaveTextContent('Next');

        userEvent.click(btns[1]);
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should change the selected value when user changes the value in the dropdown', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        renderComponent({});

        const select_inputs = screen.getAllByRole('combobox');

        const income_source_select = select_inputs.find(
            (option: FormikValues) => option.name === 'income_source'
        ) as HTMLSelectElement;

        userEvent.selectOptions(income_source_select as HTMLElement, 'Salaried Employee');

        const selectedOption = screen.getByRole('option', { name: 'Salaried Employee' }) as HTMLOptionElement;
        expect(selectedOption.selected).toBe(true);
    });

    it('should show "Unemployed" in occupation list if employment status is not "Employed"', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        const new_mock_props: React.ComponentProps<typeof FinancialDetails> = {
            ...mock_props,
            employment_status: 'Pensioner',
        };
        renderComponent({ props: new_mock_props });

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

        const source_of_wealth_select = select_inputs.find(
            (option: FormikValues) => option.name === 'source_of_wealth'
        );
        const occuppation_select = select_inputs.find((option: FormikValues) => option.name === 'occupation');

        userEvent.type(account_turnover_select as HTMLElement, 'account turnover 1');

        userEvent.type(education_level_select as HTMLElement, 'education level 2');
        userEvent.type(employment_indystry_select as HTMLElement, 'employment industry 1');
        userEvent.type(estimated_worth_select as HTMLElement, 'estimated worth 2');
        userEvent.type(income_source_select as HTMLElement, 'income source 1');
        userEvent.type(net_income_select as HTMLElement, 'net income 1');
        userEvent.type(source_of_wealth_select as HTMLElement, 'source of wealth 1');

        const occupation_text = screen.getAllByText('Unemployed')[0];
        expect(occupation_text).toBeInTheDocument();

        userEvent.type(occuppation_select as HTMLElement, 'Unemployed');

        const next_btn = screen.getByRole('button', { name: 'Next' });
        expect(next_btn).toBeEnabled();

        userEvent.click(next_btn);
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalled();
        });
    });

    it('should not show Occupation field if employment status is "Unemployed"', () => {
        const new_mock_props: React.ComponentProps<typeof FinancialDetails> = {
            ...mock_props,
            employment_status: EMPLOYMENT_VALUES.UNEMPLOYED,
        };
        renderComponent({ props: new_mock_props });

        expect(screen.queryByText('Occupation')).not.toBeInTheDocument();
    });

    it('should not show Occupation field if employment status is "Self employed"', () => {
        const new_mock_props: React.ComponentProps<typeof FinancialDetails> = {
            ...mock_props,
            employment_status: EMPLOYMENT_VALUES.SELF_EMPLOYED,
        };
        renderComponent({ props: new_mock_props });

        expect(screen.queryByText('Occupation')).toBeInTheDocument();
    });

    it('should not show Occupation field if employment status is "Employed"', () => {
        const new_mock_props: React.ComponentProps<typeof FinancialDetails> = {
            ...mock_props,
            employment_status: EMPLOYMENT_VALUES.SELF_EMPLOYED,
        };
        renderComponent({ props: new_mock_props });

        expect(screen.queryByText('Occupation')).toBeInTheDocument();
    });
});
