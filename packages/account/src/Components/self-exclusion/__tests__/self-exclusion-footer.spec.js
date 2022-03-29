import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelfExclusionFooter from '../self-exclusion-footer';
import SelfExclusionContext from '../self-exclusion-context';
import { Formik } from 'formik';
import * as formik from 'formik';

const portalRoot = document.createElement('div');
document.body.appendChild(portalRoot);

const useFormikContextMock = jest.spyOn(formik, 'useFormikContext');

describe('<SelfExclusionFooter />', () => {
    let mockContext = {};
    beforeEach(() => {
        mockContext = {
            footer_ref: portalRoot,
            goToConfirm: jest.fn(),
            toggleArticle: jest.fn(),
        };
        useFormikContextMock.mockReturnValue({
            dirty: true,
            isSubmitting: false,
            isValid: true,
            values: [],
        });
    });
    it('should not render SelfExclusionFooter component', () => {
        mockContext.footer_ref = null;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionFooter />
            </SelfExclusionContext.Provider>
        );

        expect(screen.queryByText('Learn more about trading limits')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionFooter component', () => {
        render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionFooter />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.getByText('Learn more about trading limits')).toBeInTheDocument();
    });

    it('Should trigger click on the button', () => {
        const onClick = mockContext.goToConfirm;

        render(
            <Formik>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionFooter />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const btn = screen.getByRole('button');

        expect(btn).toBeInTheDocument();
        expect(btn).toHaveClass('da-self-exclusion__button');
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
