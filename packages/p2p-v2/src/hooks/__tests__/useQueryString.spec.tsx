import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import useQueryString from '../useQueryString';
import { createMemoryHistory } from 'history';

const MockBuySell = () => <h1>Buy sell page</h1>;
const MockMyProfile = () => {
    const { deleteQueryString, queryString, replaceQueryString, setQueryString } = useQueryString();

    return (
        <div>
            <button
                data-testid='switch_payment_methods_btn'
                onClick={() =>
                    setQueryString({
                        tab: 'Payment methods',
                    })
                }
            >
                Switch payment methods
            </button>
            <button
                data-testid='switch_stats_btn'
                onClick={() =>
                    setQueryString({
                        tab: 'Stats',
                    })
                }
            >
                Switch stats
            </button>
            <button
                data-testid='pm_form_btn'
                onClick={() =>
                    setQueryString({
                        form: 'Payment method form',
                        tab: 'Payment methods',
                    })
                }
            >
                Switch payment method form
            </button>
            <button
                data-testid='counterparties_btn'
                onClick={() =>
                    replaceQueryString({
                        form: 'Payment method form',
                        tab: 'Counterparties',
                    })
                }
            >
                Switch counterparties
            </button>
            <button data-testid='go_back_btn' onClick={() => deleteQueryString('tab')}>
                Go back
            </button>
            {!queryString.get('tab') && <h1>My profile</h1>}
            {queryString.get('tab') === 'Stats' && <h1>Stats tab</h1>}
            {queryString.get('tab') === 'Counterparties' && <h1>Counterparties tab</h1>}
            {queryString.get('tab') === 'Payment methods' && <h1>Payment methods tab</h1>}
            {queryString.get('form') === 'Payment method form' && <h1>Payment method form</h1>}
        </div>
    );
};

const MockHome = () => <h1>Home</h1>;

const MockAppContent = () => {
    return (
        <Switch>
            <Route component={MockHome} exact path='/' />
            <Route component={MockBuySell} path='/mock-buy-sell' />
            <Route component={MockMyProfile} path='/mock-my-profile' />
        </Switch>
    );
};

const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        replace: mockReplace,
    }),
}));
// import { useHistory } from 'react-router-dom';

let windowLocationSpy: jest.SpyInstance<Location, []>;

describe('useQueryString', () => {
    beforeEach(() => {
        windowLocationSpy = jest.spyOn(window, 'location', 'get');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('setting new query strings', () => {
        const history = createMemoryHistory();
        history.push('/mock-my-profile');
        render(
            <Router history={history}>
                <MockAppContent />
            </Router>
        );
        expect(screen.getByText('My profile')).toBeInTheDocument();
        expect(screen.queryByText('Payment methods tab')).not.toBeInTheDocument();
        expect(screen.queryByText('Stats tab')).not.toBeInTheDocument();

        const btn = screen.getByTestId('switch_payment_methods_btn');
        const originalLocation = window.location;
        const queryChangeEventSpy = jest.spyOn(window, 'dispatchEvent');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Payment+methods',
            pathname: 'my-profile',
            search: '?tab=Payment+methods',
        }));
        btn.click();
        expect(mockReplace).toHaveBeenLastCalledWith({
            pathname: 'my-profile',
            search: 'tab=Payment+methods',
        });
        expect(mockReplace).toHaveBeenCalled();
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Payment methods tab')).toBeInTheDocument();

        const statsBtn = screen.getByTestId('switch_stats_btn');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Stats',
            pathname: 'my-profile',
            search: '?tab=Stats',
        }));
        statsBtn.click();
        expect(mockReplace).toHaveBeenLastCalledWith({
            pathname: 'my-profile',
            search: 'tab=Stats',
        });
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Stats tab')).toBeInTheDocument();

        const paymentMethodFormBtn = screen.getByTestId('pm_form_btn');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Stats&form=Payment+method+form',
            pathname: 'my-profile',
            search: 'tab=Payment+methods&form=Payment+method+form',
        }));
        paymentMethodFormBtn.click();
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Payment methods tab')).toBeInTheDocument();
        expect(screen.getByText('Payment method form')).toBeInTheDocument();
    });

    test('deleting query strings', () => {
        const history = createMemoryHistory();
        history.push('/mock-my-profile');
        render(
            <Router history={history}>
                <MockAppContent />
            </Router>
        );
        expect(screen.getByText('My profile')).toBeInTheDocument();
        expect(screen.queryByText('Payment methods tab')).not.toBeInTheDocument();
        expect(screen.queryByText('Payment method form')).not.toBeInTheDocument();

        const btn = screen.getByTestId('switch_payment_methods_btn');
        const originalLocation = window.location;
        const queryChangeEventSpy = jest.spyOn(window, 'dispatchEvent');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Payment+methods',
            pathname: 'my-profile',
            search: '?tab=Payment+methods',
        }));
        btn.click();

        const goBackBtn = screen.getByTestId('go_back_btn');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?form=Payment+method+form',
            pathname: 'my-profile',
            search: 'form=Payment+method+form',
        }));
        goBackBtn.click();
        expect(mockReplace).toHaveBeenLastCalledWith({
            pathname: 'my-profile',
            search: 'form=Payment+method+form',
        });
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('My profile')).toBeInTheDocument();
        expect(screen.getByText('Payment method form')).toBeInTheDocument();
    });
    test('replacing query strings', () => {
        const history = createMemoryHistory();
        history.push('/mock-my-profile');
        render(
            <Router history={history}>
                <MockAppContent />
            </Router>
        );
        expect(screen.getByText('My profile')).toBeInTheDocument();
        expect(screen.queryByText('Counterparties tab')).not.toBeInTheDocument();
        expect(screen.queryByText('Payment method form')).not.toBeInTheDocument();

        const btn = screen.getByTestId('counterparties_btn');
        const originalLocation = window.location;
        const queryChangeEventSpy = jest.spyOn(window, 'dispatchEvent');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Counterparties&form=Payment+method+form',
            pathname: 'my-profile',
            search: 'tab=Counterparties&form=Payment+method+form',
        }));
        btn.click();
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Counterparties tab')).toBeInTheDocument();
        expect(screen.getByText('Payment method form')).toBeInTheDocument();
    });
});
