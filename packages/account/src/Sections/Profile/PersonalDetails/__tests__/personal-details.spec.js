import { jest, test } from '@jest/globals';
import React from 'react';
import { cleanup, render, waitForElementToBeRemoved, waitFor, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PersonalDetailsForm } from '../personal-details.jsx';

afterAll(cleanup);

jest.mock('Services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
}));

describe('<PersonalDetailsForm />', () => {
    const history = createBrowserHistory();

    it('should_render_successfully', async () => {
        const promise = Promise.resolve();
        const fetchResidenceList = jest.fn(() => promise);
        const fetchStatesList = jest.fn(() => promise);
        const residence_list = [
            {
                text: 'Text',
                value: 'value',
            },
        ];
        const screen = render(
            <Router history={history}>
                <PersonalDetailsForm
                    fetchResidenceList={fetchResidenceList}
                    fetchStatesList={fetchStatesList}
                    residence_list={residence_list}
                    has_residence={true}
                    account_settings={{
                        email_consent: 1,
                    }}
                    getChangeableFields={() => []}
                    is_virtual={false}
                    states_list={residence_list}
                />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.container.querySelector('.account__initial-loader'));
        await waitFor(() =>
            screen.getByText(/Please make sure your information is correct or it may affect your trading experience./i)
        );
    });
});

test.todo('SVG landing company (Desktop View)');

describe('SVG_landing company(desktop view)', function () {
    const history = createBrowserHistory();
    it('should_render_successfully', async () => {
        const promise = Promise.resolve();
        const fetchResidenceList = jest.fn(() => promise);
        const fetchStatesList = jest.fn(() => promise);
        const residence_list = [
            {
                text: 'Text',
                value: 'value',
            },
        ];
        const screen = render(
            <Router history={history}>
                <PersonalDetailsForm
                    fetchResidenceList={fetchResidenceList}
                    fetchStatesList={fetchStatesList}
                    residence_list={residence_list}
                    has_residence={true}
                    account_settings={{
                        email_consent: 1,
                    }}
                    getChangeableFields={() => []}
                    is_virtual={false}
                    states_list={residence_list}
                />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/First name/)).toBeInTheDocument();
            expect(screen.getByText(/Last name/)).toBeInTheDocument();
            expect(screen.getByText(/Date of birth/)).toBeInTheDocument();
            expect(screen.getByText(/Citizenship/)).toBeInTheDocument();
            expect(screen.getByText(/Country of residence/))
                .toBeInTheDocument()
                .not.toHaveAttribute('disabled');
            expect(screen.getByText(/Email address/)).toBeInTheDocument();
            expect(screen.getByText(/Phone number/)).toBeInTheDocument();
            expect(screen.getByText(/Phone number/)).toBeInTheDocument();
            expect(screen.getByText(/First line of address/)).toBeInTheDocument();
            expect(screen.getByText(/Second line of address/)).toBeInTheDocument();
            // expect(screen.getByText(/Second line of address (optional)/)).toBeInTheDocument();
        });
    });
});

test.todo('IOM landing company (Desktop View)');

test.todo('MaltaInvest landing company (Desktop View)');

test.todo('SignUp flow (Desktop View)');
