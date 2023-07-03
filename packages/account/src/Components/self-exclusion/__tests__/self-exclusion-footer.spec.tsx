import React from 'react';
import { Formik, FormikValues } from 'formik';
import * as formik from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionContext from '../self-exclusion-context';
import SelfExclusionFooter from '../self-exclusion-footer';

const portal_root = document.createElement('div');
document.body.appendChild(portal_root);

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

describe('<SelfExclusionFooter />', () => {
    let mock_context = {};
    beforeEach(() => {
        mock_context = {
            goToConfirm: jest.fn(),
            toggleArticle: jest.fn(),
            footer_ref: portal_root,
        };
        mockUseFormikContext.mockReturnValue({
            dirty: true,
            isSubmitting: false,
            isValid: true,
            values: [],
        });
    });
    it('should not render SelfExclusionFooter component', () => {
        (mock_context as FormikValues).footer_ref = null;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionFooter />
            </SelfExclusionContext.Provider>
        );

        expect(screen.queryByText('Learn more about trading limits')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionFooter component', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionFooter />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.getByText('Learn more about trading limits')).toBeInTheDocument();
    });

    it('Should trigger click on the button', () => {
        const mockGoToConfirm = (mock_context as FormikValues).goToConfirm;

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionFooter />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveClass('da-self-exclusion__button');
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(mockGoToConfirm).toHaveBeenCalledTimes(1);
    });
});
