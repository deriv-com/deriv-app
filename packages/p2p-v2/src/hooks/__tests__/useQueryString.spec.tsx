import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, Route, Switch } from 'react-router-dom';
import useQueryString from '../useQueryString';
import { createMemoryHistory } from 'history';

const MockBuySell = () => <h1>Buy sell page</h1>;
const MockMyProfile = () => {
    const { deleteQueryString, queryString, replaceQueryString, setQueryString } = useQueryString();

    return (
        <div>
            <button
                onClick={() =>
                    setQueryString({
                        tab: 'Payment methods',
                    })
                }
            >
                Switch payment methods
            </button>
            <button
                onClick={() =>
                    setQueryString({
                        tab: 'Stats',
                    })
                }
            >
                Switch stats
            </button>
            <button
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
                onClick={() =>
                    replaceQueryString({
                        form: 'Payment method form',
                        tab: 'Counterparties',
                    })
                }
            >
                Switch counterparties
            </button>
            <button onClick={() => deleteQueryString('tab')}>Go back</button>
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

let windowLocationSpy: jest.SpyInstance<Location, []>;

describe('useQueryString', () => {
    beforeEach(() => {
        windowLocationSpy = jest.spyOn(window, 'location', 'get');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should test case for setting new query strings', () => {
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

        const btn = screen.getByRole('button', {
            name: 'Switch payment methods',
        });
        const originalLocation = window.location;
        const queryChangeEventSpy = jest.spyOn(window, 'dispatchEvent');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Payment+methods',
            pathname: 'my-profile',
            search: '?tab=Payment+methods',
        }));
        userEvent.click(btn);
        expect(mockReplace).toHaveBeenLastCalledWith({
            pathname: 'my-profile',
            search: 'tab=Payment+methods',
        });
        expect(mockReplace).toHaveBeenCalled();
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Payment methods tab')).toBeInTheDocument();

        const statsBtn = screen.getByRole('button', {
            name: 'Switch stats',
        });
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Stats',
            pathname: 'my-profile',
            search: '?tab=Stats',
        }));
        userEvent.click(statsBtn);
        expect(mockReplace).toHaveBeenLastCalledWith({
            pathname: 'my-profile',
            search: 'tab=Stats',
        });
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Stats tab')).toBeInTheDocument();

        const paymentMethodFormBtn = screen.getByRole('button', {
            name: 'Switch payment method form',
        });
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Stats&form=Payment+method+form',
            pathname: 'my-profile',
            search: 'tab=Payment+methods&form=Payment+method+form',
        }));
        userEvent.click(paymentMethodFormBtn);
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Payment methods tab')).toBeInTheDocument();
        expect(screen.getByText('Payment method form')).toBeInTheDocument();
    });

    it('should test case for deleting query strings', () => {
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

        const btn = screen.getByRole('button', {
            name: 'Switch payment methods',
        });
        const originalLocation = window.location;
        const queryChangeEventSpy = jest.spyOn(window, 'dispatchEvent');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Payment+methods',
            pathname: 'my-profile',
            search: '?tab=Payment+methods',
        }));
        userEvent.click(btn);

        const goBackBtn = screen.getByRole('button', {
            name: 'Go back',
        });
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?form=Payment+method+form',
            pathname: 'my-profile',
            search: 'form=Payment+method+form',
        }));
        userEvent.click(goBackBtn);
        expect(mockReplace).toHaveBeenLastCalledWith({
            pathname: 'my-profile',
            search: 'form=Payment+method+form',
        });
        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('My profile')).toBeInTheDocument();
        expect(screen.getByText('Payment method form')).toBeInTheDocument();
    });
    it('should test case for replacing query strings', () => {
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

        const btn = screen.getByRole('button', {
            name: 'Switch counterparties',
        });
        const originalLocation = window.location;
        const queryChangeEventSpy = jest.spyOn(window, 'dispatchEvent');
        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost/my-profile?tab=Counterparties&form=Payment+method+form',
            pathname: 'my-profile',
            search: 'tab=Counterparties&form=Payment+method+form',
        }));
        userEvent.click(btn);

        expect(queryChangeEventSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(queryChangeEventSpy.mock.calls[0][0].type).toBe('queryChange');
        expect(screen.getByText('Counterparties tab')).toBeInTheDocument();
        expect(screen.getByText('Payment method form')).toBeInTheDocument();
    });
});
