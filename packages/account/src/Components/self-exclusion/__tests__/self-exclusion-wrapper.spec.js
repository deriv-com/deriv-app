import React from 'react';
import { render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import SelfExclusionWrapper from '../self-exclusion-wrapper';
import SelfExclusionContext from '../self-exclusion-context';

jest.mock('../self-exclusion-article', () => () => <div>SelfExclusionArticle</div>);
jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

describe('<SelfExclusionWrapper />', () => {
    let mockContext = {};
    beforeEach(() => {
        mockContext = {
            is_app_settings: false,
            is_wrapper_bypassed: false,
            state: {},
        };
    });

    it('should render SelfExclusionWrapper component without wrapper', () => {
        mockContext.is_wrapper_bypassed = true;

        const { container } = render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        );

        expect(container.querySelector('.da-self-exclusion')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionWrapper mobile component without wrapper', () => {
        mockContext.is_wrapper_bypassed = true;
        isMobile.mockReturnValue(true);

        const { container } = render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        );

        expect(container.querySelector('.da-self-exclusion')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
        expect(screen.getByText('SelfExclusionArticle')).toBeInTheDocument();
    });

    it('should render SelfExclusionWrapper component with wrapper', () => {
        isMobile.mockReturnValue(false);
        const mockChild = <div>MockChild</div>;

        const { container } = render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionWrapper>{mockChild}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(container.querySelector('.da-self-exclusion__wrapper')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).toBeInTheDocument();
        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getAllByText('SelfExclusionArticle').length).toBe(1);
    });

    it('should render SelfExclusionWrapper mobile component with wrapper', () => {
        isMobile.mockReturnValue(true);
        const mockChild = <div>MockChild</div>;

        const { container } = render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionWrapper>{mockChild}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(container.querySelector('.da-self-exclusion__wrapper')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getAllByText('SelfExclusionArticle').length).toBe(2);
    });
});
