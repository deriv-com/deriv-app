import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import Redirect from '../redirect';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<Redirect />', () => {
    let history,
     mock_props;

    beforeEach(() => {
        history = createBrowserHistory();

        mock_props = {
            loginid: 'CR1234',
            verification_code: {
                payment_withdraw: '',
            },
            setVerificationCode: jest.fn(),
            setNewEmail: jest.fn(),
            setLoginId: jest.fn(id => {
                return id;
            }),
        };
    });

    it('should set login id provided to the one provided in the url before redirection', () => {
        history.push('/redirect?action=payment_withdraw&lang=EN&code=FwGsJwTJ&loginid=CR456');

        render(
            <Router history={history}>
                <Redirect {...mock_props} />
            </Router>
        );

        expect(mock_props.setLoginId).toHaveBeenCalledWith('CR456');
    });
});
