import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import Shortcut from './shortcut.jsx';

it('Should not show shortcut element if its first time render', () => {
    render(<Shortcut />);

    expect(screen.queryByTestId('short-cut')).toBeNull();
});

it('Should show the shortcut element if client press ctrl + alt + r', () => {
    const screen_shortcut = render(<Shortcut />);

    fireEvent.keyDown(screen_shortcut.container, { key: 'r', code: 'KeyR', ctrlKey: true, altKey: true });

    expect(screen.queryByTestId('short-cut')).not.toBe(null);
});

it('Should render autocomplete with route list in it', () => {
    const expected_route = 'mt5';
    const screen_shortcut = render(<Shortcut />);

    fireEvent.keyDown(screen_shortcut.container, { key: 'r', code: 'KeyR', ctrlKey: true, altKey: true });

    const el_input = screen.getByTestId('short-cut-input');
    fireEvent.click(el_input);

    expect(screen.getByText(expected_route)).not.toBe(null);
});

it('Should redirect to the correct location as per input selection', () => {
    const history = createBrowserHistory();
    const expected_route = 'mt5';

    const screen_shortcut = render(
        <Router history={history}>
            <Shortcut />
        </Router>
    );

    fireEvent.keyDown(screen_shortcut.container, { key: 'r', code: 'KeyR', ctrlKey: true, altKey: true });

    const el_input = screen.getByTestId('short-cut-input');
    fireEvent.click(el_input);

    const el_item = screen.getByText(expected_route);

    fireEvent.mouseDown(el_item);

    expect(history.location.pathname).toBe(routes[expected_route]);

    expect(screen.queryByTestId('short-cut')).toBeNull();
});

it('Should close the shortcut element when client press `esc`', () => {
    const screen_shortcut = render(<Shortcut />);

    fireEvent.keyDown(screen_shortcut.container, { key: 'r', code: 'KeyR', ctrlKey: true, altKey: true });

    fireEvent.keyDown(screen_shortcut.container, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByTestId('short-cut')).toBeNull();
});
