import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import FinancialDetails from '../financial-details';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

const modal_root_el = document.createElement('div');
modal_root_el.setAttribute('id', 'modal_root');
document.body.appendChild(modal_root_el);

const fields_enums = {
    account_turnover_enum: [
        { value: 'account turnover 1', text: 'account turnover 1' },
        { value: 'account turnover 2', text: 'account turnover 2' },
    ],
    education_level_enum: [
        { value: 'education level 1', text: 'education level 1' },
        { value: 'education level 2', text: 'education level 2' },
    ],
    employment_industry_enum: [
        { value: 'employment industry 1', text: 'employment industry 1' },
        { value: 'employment industry 2', text: 'employment industry 2' },
    ],
    estimated_worth_enum: [
        { value: 'estimated worth 1', text: 'estimated worth 1' },
        { value: 'estimated worth 2', text: 'estimated worth 2' },
    ],
    income_source_enum: [
        { value: 'income source 1', text: 'income source 1' },
        { value: 'income source 2', text: 'income source 2' },
    ],
    net_income_enum: [
        { value: 'net income 1', text: 'net income 1' },
        { value: 'net income 2', text: 'net income 2' },
    ],
    occupation_enum: [
        { value: 'occupation 1', text: 'occupation 1' },
        { value: 'occupation 2', text: 'occupation 2' },
    ],

    source_of_wealth_enum: [
        { value: 'source of wealth 1', text: 'source of wealth 1' },
        { value: 'source of wealth 2', text: 'source of wealth 2' },
    ],
};

describe('<FinancialDetails />', () => {
    let mock_props = {};

    beforeEach(() => {
        mock_props = {
            getCurrentStep: jest.fn(),
            goToNextStep: jest.fn(),
            onCancel: jest.fn(),
            onSave: jest.fn(),
            onSubmit: jest.fn(),
            validate: jest.fn(() => ({ errors: {} })),
            value: {},
            ...fields_enums,
        };
    });

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
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);

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
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);

        render(<FinancialDetails {...mock_props} />);

        fieldsRenderCheck();

        const select_inputs = screen.getAllByRole('combobox');

        const account_turnover_select = select_inputs.find(option => option.name === 'account_turnover');

        const education_level_select = select_inputs.find(option => option.name === 'education_level');
        const employment_indystry_select = select_inputs.find(option => option.name === 'employment_industry');
        const estimated_worth_select = select_inputs.find(option => option.name === 'estimated_worth');
        const income_source_select = select_inputs.find(option => option.name === 'income_source');
        const net_income_select = select_inputs.find(option => option.name === 'net_income');
        const occuppation_select = select_inputs.find(option => option.name === 'occupation');

        const source_of_wealth_select = select_inputs.find(option => option.name === 'source_of_wealth');

        fireEvent.change(account_turnover_select, { target: { value: 'account turnover 1' } });

        fireEvent.change(education_level_select, { target: { value: 'education level 2' } });
        fireEvent.change(employment_indystry_select, { target: { value: 'employment industry 1' } });
        fireEvent.change(estimated_worth_select, { target: { value: 'estimated worth 2' } });
        fireEvent.change(income_source_select, { target: { value: 'income source 1' } });
        fireEvent.change(net_income_select, { target: { value: 'net income 1' } });
        fireEvent.change(occuppation_select, { target: { value: 'occupation 2' } });

        fireEvent.change(source_of_wealth_select, { target: { value: 'source of wealth 1' } });

        const btns = screen.getAllByRole('button');
        expect(btns[1]).toHaveTextContent('Next');

        fireEvent.click(btns[1]);
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });
});
