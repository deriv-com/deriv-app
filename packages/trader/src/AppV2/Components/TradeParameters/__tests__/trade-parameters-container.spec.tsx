import React from 'react';
import { render, screen } from '@testing-library/react';
import TradeParametersContainer from '../trade-parameters-container';

const children = 'children';
const mock_children = <div>{children}</div>;

jest.mock('react-transition-group', () => ({
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('../../Guide', () => jest.fn(() => 'Guide'));

describe('TradeParametersContainer', () => {
    it('should render a proper content with children if is_minimized is false', () => {
        render(<TradeParametersContainer>{mock_children}</TradeParametersContainer>);

        expect(screen.getByText('Set your trade')).toBeInTheDocument();
        expect(screen.getByText('Guide')).toBeInTheDocument();
        expect(screen.getByText(children)).toBeInTheDocument();
    });

    it('should render only children if is_minimized and is_minimized_visible is true', () => {
        render(
            <TradeParametersContainer is_minimized is_minimized_visible>
                {mock_children}
            </TradeParametersContainer>
        );

        expect(screen.queryByText('Set your trade')).not.toBeInTheDocument();
        expect(screen.queryByText('Guide')).not.toBeInTheDocument();
        expect(screen.getByText(children)).toBeInTheDocument();
    });
});
