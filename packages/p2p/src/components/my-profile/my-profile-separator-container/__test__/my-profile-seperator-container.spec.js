import React from 'react';
import { render, screen } from '@testing-library/react';
import MyProfileSeparatorContainer from '../my-profile-separator-container.jsx';

describe('<MyProfileSeparatorContainer/>', () => {
    it('should render the component', () => {
        render(
            <MyProfileSeparatorContainer>
                <div>Child comp</div>
            </MyProfileSeparatorContainer>
        );
        expect(screen.getByText('Child comp')).toBeInTheDocument();
    });

    it('should render the line component', () => {
        const { container } = render(<MyProfileSeparatorContainer.Line is_invisible />);
        expect(container.querySelector('.my-profile-separator-container__line--invisible')).toBeInTheDocument();
    });

    it('should render the line component', () => {
        const { container } = render(<MyProfileSeparatorContainer.Line />);
        expect(container.querySelector('.my-profile-separator-container__line--invisible')).not.toBeInTheDocument();
    });
});
