import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdTypeSection from '../AdTypeSection';
import { useFloatingRate } from '@/hooks';

jest.mock('../../AdFormTextArea', () => ({
    AdFormTextArea: () => <div>AdFormTextArea</div>,
}));

const mockSetFieldValue = jest.fn();
const mockTriggerFunction = jest.fn();
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
            dirtyFields: { amount: true },
            isDirty: false,
            isValid: true,
        },
        getValues: jest.fn(() => 'mockedValues'),
        setValue: mockSetFieldValue,
        trigger: mockTriggerFunction,
        watch: jest.fn(() => 'buy'),
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useQueryString: jest.fn().mockReturnValue({ queryString: { advertId: '' } }),
}));

const mockProps = {
    currency: 'usd',
    getCurrentStep: jest.fn(() => 1),
    getTotalSteps: jest.fn(),
    goToNextStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    localCurrency: 'usd',
    onCancel: jest.fn(),
    rateType: 'float',
};

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    FloatingRate: () => <div>FloatingRate</div>,
}));

describe('AdTypeSection', () => {
    it('should render the ad type section component', () => {
        render(<AdTypeSection {...mockProps} />);
        expect(screen.getByText('Total amount')).toBeInTheDocument();
        expect(screen.getByText('Min order')).toBeInTheDocument();
        expect(screen.getByText('Max order')).toBeInTheDocument();
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
        expect(mockProps.onCancel).toHaveBeenCalled();
    });
    it('should handle the trigger validation', () => {
        render(<AdTypeSection {...mockProps} />);
        userEvent.type(screen.getByPlaceholderText('Max order'), '200');
        const element = screen.getByPlaceholderText('Total amount');
        userEvent.type(element, '100');
        expect(mockTriggerFunction).toHaveBeenCalled();
    });
});
