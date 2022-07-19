import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import AnimationWrapper from '../animation-wrapper.jsx';

jest.mock('react-transition-group', () => ({
    ...jest.requireActual('react-transition-group'),
    CSSTransition: jest.fn(({ children }) => <div data-testid='css-transition'>{children}</div>),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn().mockReturnValue(false),
}));

describe('<AnimationWrapper/>', () => {
    it('renders the children component in desktop view', () => {
        render(
            <AnimationWrapper>
                <div>Desktop View</div>
            </AnimationWrapper>
        );

        expect(screen.queryByTestId('css-transition')).not.toBeInTheDocument();
        expect(screen.getByText('Desktop View')).toBeInTheDocument();
    });

    it('renders the children component in desktop view', () => {
        isMobile.mockReturnValue(true);
        render(
            <AnimationWrapper>
                <div>Mobile View</div>
            </AnimationWrapper>
        );

        expect(screen.queryByTestId('css-transition')).toBeInTheDocument();
        expect(screen.getByText('Mobile View')).toBeInTheDocument();
    });
});
