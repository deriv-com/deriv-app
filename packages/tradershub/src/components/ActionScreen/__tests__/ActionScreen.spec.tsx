import React from 'react';
import { render, screen } from '@testing-library/react';
import ActionScreen from '../ActionScreen';

describe('ActionScreen component', () => {
    it('renders with title', () => {
        render(<ActionScreen description='Description' title='Title' />);
        const titleElement = screen.getByText('Title');
        expect(titleElement).toBeInTheDocument();
    });

    it('renders with description', () => {
        render(<ActionScreen description='Description' />);
        const descriptionElement = screen.getByText('Description');
        expect(descriptionElement).toBeInTheDocument();
    });

    it('renders if description is valid ReactNode', () => {
        render(<ActionScreen description={<span>Valid React node</span>} />);
        const descriptionElement = screen.getByText('Valid React node');
        expect(descriptionElement).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
        const CustomIcon = () => <div>Custom Icon</div>;
        render(<ActionScreen description='Description' icon={<CustomIcon />} />);
        const iconElement = screen.getByText('Custom Icon');
        expect(iconElement).toBeInTheDocument();
    });

    it('calls renderButtons function', () => {
        const renderButtons = jest.fn();
        render(<ActionScreen description='Description' renderButtons={renderButtons} />);
        expect(renderButtons).toHaveBeenCalled();
    });

    it('renders children', () => {
        render(
            <ActionScreen description='Description'>
                <div>Child</div>
            </ActionScreen>
        );
        const childElement = screen.getByText('Child');
        expect(childElement).toBeInTheDocument();
    });
});
