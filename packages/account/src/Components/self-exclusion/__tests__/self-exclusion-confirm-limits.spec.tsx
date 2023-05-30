import React from 'react';
import * as formik from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionConfirmLimits from '../self-exclusion-confirm-limits';
import SelfExclusionContext from '../self-exclusion-context';
import { FormikValues } from 'formik';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

describe('<SelfExclusionConfirmLimits />', () => {
    let mock_context = {};

    beforeEach(() => {
        mock_context = {
            backToReview: jest.fn(),
        };
        mockUseFormikContext.mockReturnValue({
            handleSubmit: jest.fn(),
            isSubmitting: false,
        });
    });

    it('should render SelfExclusionConfirmLimits component', () => {
        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmLimits />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        expect(
            screen.getByText('Remember: You cannot log in to your account until the selected date.')
        ).toBeInTheDocument();
        expect(screen.getByText('Save new limits?')).toBeInTheDocument();
        expect(screen.getByText('Yes, log me out immediately')).toBeInTheDocument();
    });

    it('should render SelfExclusionConfirmLimits component with loading status of submit button', () => {
        mockUseFormikContext.mockReturnValue({
            handleSubmit: jest.fn(),
            isSubmitting: true,
        });

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmLimits />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        expect(
            screen.getByText('Remember: You cannot log in to your account until the selected date.')
        ).toBeInTheDocument();
        expect(screen.getByText('Save new limits?')).toBeInTheDocument();
        expect(screen.queryByText('Yes, log me out immediately')).not.toBeInTheDocument();
    });

    it('Should trigger click on the button', () => {
        const mockBackToReview = (mock_context as FormikValues).backToReview;
        const mockHandleSubmit = mockUseFormikContext().handleSubmit as jest.Mock;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmLimits />
            </SelfExclusionContext.Provider>
        );

        const btns = screen.getAllByRole('button');
        expect(btns[0]).toBeInTheDocument();
        expect(btns[0]).toHaveTextContent('No, review my limits');
        fireEvent.click(btns[0]);
        expect(mockBackToReview).toHaveBeenCalledTimes(1);
        expect(btns[1]).toBeInTheDocument();
        expect(btns[1]).toHaveTextContent('Yes, log me out immediately');
        fireEvent.click(btns[1]);
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
});
