import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CFD_PLATFORMS } from '@deriv/shared';
import PlatformPartials from '../platform-partials';

describe('<PlatformPartials />', () => {
    const mock_props: React.ComponentProps<typeof PlatformPartials> = {
        type: CFD_PLATFORMS.DXTRADE,
        description: <div>Test description</div>,
        handleClick: jest.fn(),
    };

    it('should render mt5 partials', () => {
        render(<PlatformPartials {...mock_props} />);

        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('should call handleClick when button is clicked', async () => {
        render(<PlatformPartials {...mock_props} />);

        const el_button = screen.getByRole('button', { name: /change password/i });
        userEvent.click(el_button);

        await waitFor(() => expect(mock_props.handleClick).toHaveBeenCalledTimes(1));
    });
});
