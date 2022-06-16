import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import SelfExclusionWrapper from '../self-exclusion-wrapper';
import SelfExclusionContext from '../self-exclusion-context';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));
jest.mock('../self-exclusion-article', () => () => <div>SelfExclusionArticle</div>);

describe('<SelfExclusionWrapper />', () => {
    let mock_context = {};

    beforeEach(() => {
        mock_context = {
            is_app_settings: false,
            is_wrapper_bypassed: false,
            state: {},
        };
    });

    it('should render SelfExclusionWrapper component without wrapper', () => {
        mock_context.is_wrapper_bypassed = true;

        const { container } = render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        );

        expect(container.querySelector('.da-self-exclusion')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionWrapper mobile component without wrapper', () => {
        mock_context.is_wrapper_bypassed = true;
        isMobile.mockReturnValue(true);

        const { container } = render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionArticle')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionWrapper component with wrapper', () => {
        isMobile.mockReturnValue(false);
        const mock_child = <div>MockChild</div>;

        const { container } = render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper>{mock_child}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getAllByText('SelfExclusionArticle').length).toBe(1);
        expect(container.querySelector('.da-self-exclusion__wrapper')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).toBeInTheDocument();
    });

    it('should render SelfExclusionWrapper mobile component with wrapper', () => {
        isMobile.mockReturnValue(true);
        const mock_child = <div>MockChild</div>;

        const { container } = render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper>{mock_child}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getAllByText('SelfExclusionArticle').length).toBe(2);
        expect(container.querySelector('.da-self-exclusion__wrapper')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
    });
});
