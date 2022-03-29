import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelfExclusionConfirmLimits from '../self-exclusion-confirm-limits';
import SelfExclusionContext from '../self-exclusion-context';
import * as formik from 'formik';

const useFormikContextMock = jest.spyOn(formik, 'useFormikContext');

describe('<SelfExclusionConfirmLimits />', () => {
    let mockContext = {};
    beforeEach(() => {
        mockContext = {
            backToReview: jest.fn(),
        };
        useFormikContextMock.mockReturnValue({
            handleSubmit: jest.fn(),
            isSubmitting: false,
        });
    });

    it('should render SelfExclusionConfirmLimits component', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmLimits />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Save new limits?')).toBeInTheDocument();
        expect(
            screen.getByText('Remember: You cannot log in to your account until the selected date.')
        ).toBeInTheDocument();
        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        expect(screen.getByText('Yes, log me out immediately')).toBeInTheDocument();
    });

    it('should render SelfExclusionConfirmLimits component with loading status of submit button', () => {
        useFormikContextMock.mockReturnValue({
            handleSubmit: jest.fn(),
            isSubmitting: true,
        });

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmLimits />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Save new limits?')).toBeInTheDocument();
        expect(
            screen.getByText('Remember: You cannot log in to your account until the selected date.')
        ).toBeInTheDocument();
        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        expect(screen.queryByText('Yes, log me out immediately')).not.toBeInTheDocument();
    });

    it('Should trigger click on the button', () => {
        const handleSubmit = useFormikContextMock().handleSubmit;
        const backToReview = mockContext.backToReview;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmLimits />
            </SelfExclusionContext.Provider>
        );

        const btns = screen.getAllByRole('button');

        expect(btns[0]).toBeInTheDocument();
        expect(btns[0]).toHaveTextContent('No, review my limits');
        fireEvent.click(btns[0]);
        expect(backToReview).toHaveBeenCalledTimes(1);

        expect(btns[1]).toBeInTheDocument();
        expect(btns[1]).toHaveTextContent('Yes, log me out immediately');
        fireEvent.click(btns[1]);
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
});
