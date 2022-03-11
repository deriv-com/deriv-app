import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import AccountLimitsFooterPortal from '../account-limits-footer';

jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useContext: () => ({
            footer_ref: <div data-testid='mocked_footer_ref'></div>,
            toggleOverlay: jest.fn(),
        }),
    };
});

describe('<AccountLimitsFooterPortal/>', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(element => {
            return element;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    it('should render AccountLimitsFooterPortal component', () => {
        render(<AccountLimitsFooterPortal />);
        expect(screen.getByText('Learn more about account limits')).toBeInTheDocument();
    });
    it('should render anchor tag', () => {
        render(<AccountLimitsFooterPortal />);
        expect(screen.getAllByTestId('footer_text').length).toBe(1);
    });

    it('should render AppSettings.Footer components correctly', () => {
        const { container } = render(<AccountLimitsFooterPortal />);
        expect(container.getElementsByClassName('dc-app-settings__footer').length).toBe(1);
    });
});
