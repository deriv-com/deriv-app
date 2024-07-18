import React from 'react';
import { render, screen } from '@testing-library/react';
import { BinaryLink } from '../index';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';

type TMockBinaryLink = {
    active_class?: string;
    to?: string;
};

let store = mockStore({});

const MockBinaryLink = ({ active_class, to }: TMockBinaryLink) => (
    <BrowserRouter>
        <StoreProvider store={store}>
            <BinaryLink active_class={active_class} to={to}>
                <div data-testid='dt_child' />
            </BinaryLink>
        </StoreProvider>
    </BrowserRouter>
);

describe('BinaryLink component', () => {
    it('should render "children" when passed in', () => {
        render(<MockBinaryLink />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should have "active_class__link-wrapper" class when "active_class" property is passed', () => {
        render(<MockBinaryLink active_class='active_class' to='/test' />);
        expect(screen.getByTestId('dt_span')).toHaveClass('active_class__link-wrapper');
    });

    it('should render "NavLink" when "to" property is passed and we do not have "href"', () => {
        render(<MockBinaryLink to='/test' />);
        expect(screen.getByTestId('dt_span')).toBeInTheDocument();
    });

    it('should render "a" element whe property "to" is not passed', () => {
        render(<MockBinaryLink />);
        expect(screen.getByTestId('dt_link')).toBeInTheDocument();
    });

    it('should call "setError" property when "has_error" property is "true"', () => {
        store = mockStore({
            common: {
                error: {
                    setError: jest.fn(),
                },
                has_error: true,
            },
        });
        render(<MockBinaryLink to='/' />);
        userEvent.click(screen.getByTestId('dt_span'));
        expect(store.common.error.setError).toHaveBeenCalledTimes(1);
    });
});
