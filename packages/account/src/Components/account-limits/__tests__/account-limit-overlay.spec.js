import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import AccountLimitsOverlay from '../account-limits-overlay';

jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useContext: () => ({
            overlay_ref: <div data-testid='mocked_overlay_ref'></div>,
            toggleOverlay: jest.fn(),
        }),
    };
});

describe('<AccountLimitsOverlay/>', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(element => {
            return element;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    it('should render AccountLimitsOverlay component', () => {
        render(<AccountLimitsOverlay />);
        expect(screen.getByText('These are default limits that we apply to your accounts.')).toBeInTheDocument();
        expect(screen.getByText('Account limits')).toBeInTheDocument();
    });

    it('should go to help-centre page if the Help Centre link on the text is clicked', () => {
        render(<AccountLimitsOverlay />);
        expect(screen.getByText('Help Centre').closest('a')).toHaveAttribute('href', 'https://deriv.com/help-centre');
    });
});
