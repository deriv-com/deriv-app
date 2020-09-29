import { jest } from '@jest/globals';
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { WS } from 'Services/ws-methods';
import { PersonalDetailsForm } from './personal-details.jsx';

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
    it('should_render_successfully', () => {
        const residence_list = [
            {
                text: 'Text',
                value: 'value',
            },
        ];
        const screen = render(
            <Router history={history}>
                <PersonalDetailsForm
                    fetchResidenceList={() => Promise.resolve(residence_list)}
                    fetchStatesList={() => Promise.resolve(residence_list)}
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
        expect(screen).toBeTruthy();
    });
});
