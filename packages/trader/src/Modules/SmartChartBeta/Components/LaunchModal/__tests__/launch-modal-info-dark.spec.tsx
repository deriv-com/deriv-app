import * as React from 'react';
import LaunchModalInfo from '../launch-modal-info';
import { render, screen } from '@testing-library/react';

jest.mock('Assets/SvgComponents/launch/ic-chart-launch-dark.svg', () => jest.fn(() => <div id='dark'>Dark Image</div>));
describe('Launch Modal Info', () => {
    it('should show dark icon in dark mode', () => {
        render(<LaunchModalInfo isDarkMode={true} />);
        expect(screen.getByText('Dark Image')).toBeInTheDocument();
    });
});
