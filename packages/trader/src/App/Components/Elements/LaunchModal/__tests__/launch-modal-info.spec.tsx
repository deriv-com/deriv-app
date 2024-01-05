import React from 'react';
import LaunchModalInfo from '../launch-modal-info';
import { render, screen } from '@testing-library/react';

jest.mock('Assets/SvgComponents/trade_explanations/img-turbos.svg', () => jest.fn(() => <div>Turbos Image</div>));

describe('Launch Modal Info', () => {
    it('should show light icon when isDarkMode is false', () => {
        render(<LaunchModalInfo />);

        expect(screen.getByText('Turbos Image')).toBeInTheDocument();
    });
});
