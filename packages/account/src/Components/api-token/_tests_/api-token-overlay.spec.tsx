import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import ApiTokenContext from '../api-token-context';
import ApiTokenOverlay from '../api-token-overlay';

describe('ApiTokenOverlay', () => {
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => component);
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    const Component = () => (
        <ApiTokenContext.Provider
            value={{
                api_tokens: undefined,
                footer_ref: document.createElement('div'),
                deleteToken: jest.fn(),
                overlay_ref: document.createElement('div'),
                toggleOverlay: jest.fn(),
            }}
        >
            <ApiTokenOverlay />
        </ApiTokenContext.Provider>
    );
    it('should render ApiTokenOverlay', () => {
        render(<Component />);
        expect(screen.getByText('API Token')).toBeInTheDocument();
        expect(
            screen.getByText(
                `To access our mobile apps and other third-party apps, you'll first need to generate an API token.`
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });
});
