import React from 'react';
import { render, screen } from '@testing-library/react';
import UserAvatar from '../user-avatar.jsx';

describe('<UserAvatar/>', () => {
    const props = {
        nickname: 'P2P Test',
        size: 16,
        text_size: 'xs',
    };
    it('should render the component with short nick name', () => {
        render(<UserAvatar {...props} />);

        expect(screen.getByText('P2')).toBeInTheDocument();
    });
});
