import React from 'react';
import { render, screen } from '@testing-library/react';
import UserAvatar from '../user-avatar';

describe('<UserAvatar/>', () => {
    const props = {
        nickname: 'P2P Test',
        size: 16,
        text_size: 'xs',
    };

    it('should render the UserAvatar component with a short nickname', () => {
        render(<UserAvatar {...props} />);

        expect(screen.getByText('P2')).toBeInTheDocument();
    });
});
