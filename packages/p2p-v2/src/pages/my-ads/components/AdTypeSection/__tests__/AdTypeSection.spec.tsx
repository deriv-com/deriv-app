import React from 'react';
import { MY_ADS_URL } from '@/constants';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdTypeSection from '../AdTypeSection';

jest.mock('../../AdFormInput', () => ({
    AdFormInput: () => <div>AdFormInput</div>,
}));
jest.mock('../../AdFormTextArea', () => ({
    AdFormTextArea: () => <div>AdFormTextArea</div>,
}));

const mockSetFieldValue = jest.fn();
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({ control, defaultValue, name, render }) =>
        render({
            field: { control, name, onBlur: jest.fn(), onChange: jest.fn(), value: defaultValue },
            fieldState: { error: null },
        }),
    useFormContext: () => ({
        control: 'mockedControl',
        formState: {
            isDirty: false,
            isValid: true,
        },
        setValue: mockSetFieldValue,
        watch: jest.fn(() => 'buy'),
    }),
}));

const mockUseHistory = {
    push: jest.fn(),
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockUseHistory,
}));

const mockProps = {
    currency: 'usd',
    getCurrentStep: jest.fn(() => 1),
    getTotalSteps: jest.fn(),
    goToNextStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    localCurrency: 'usd',
    rateType: 'float',
};

describe('AdTypeSection', () => {
    it('should render the ad type section component', () => {
        render(<AdTypeSection {...mockProps} />);
        expect(screen.getAllByText('AdFormInput')).toHaveLength(4);
        expect(screen.getByText('AdFormTextArea')).toBeInTheDocument();
    });
    it('should handle ad type change', () => {
        render(<AdTypeSection {...mockProps} />);
        const element = screen.getByRole('radio', { name: /sell/i });
        userEvent.click(element);
        expect(mockSetFieldValue).toHaveBeenCalledWith('ad-type', 'sell');
    });
    it('should handle Cancel button click', () => {
        render(<AdTypeSection {...mockProps} />);
        const element = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(element);
        expect(mockUseHistory.push).toHaveBeenCalledWith(MY_ADS_URL);
    });
});
