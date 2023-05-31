import React from 'react';
import { render } from '@testing-library/react';
import OnlineStatusIcon from '../online-status-icon';

describe('<OnlineStatusIcon/>', () => {
    it('should render the default state', () => {
        const { container } = render(<OnlineStatusIcon is_online={0} />);

        expect(container).toBeInTheDocument();
    });
});
