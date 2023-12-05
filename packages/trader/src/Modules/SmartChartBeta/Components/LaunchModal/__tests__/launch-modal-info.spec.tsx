import * as React from 'react';
import LaunchModalInfo from '../launch-modal-info';
import { render, screen } from '@testing-library/react';

jest.mock('Assets/SvgComponents/launch/ic-chart-launch.svg', () => jest.fn(() => <div id='light'>Light Image</div>));
describe('Launch Modal Info', () => {
    it('should show light icon when isDarkMode is false', () => {
        render(<LaunchModalInfo is_dark_mode={false} />);
        expect(screen.getByText('Light Image')).toBeInTheDocument();
    });
});
