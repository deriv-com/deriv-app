import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenContext from '../api-token-context';
import ApiTokenFooter from '../api-token-footer';

const portal_root = document.createElement('div');
document.body.appendChild(portal_root);

describe('APITokenFooter', () => {
    const mock_props = {
        api_tokens: undefined,
        deleteToken: jest.fn(),
        footer_ref: portal_root,
        overlay_ref: document.createElement('div'),
        toggleOverlay: jest.fn(),
    };
    it('should render APITokenFooter', () => {
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenFooter />
            </ApiTokenContext.Provider>
        );
        expect(screen.getByText('Learn more about API token')).toBeInTheDocument();
    });
});
