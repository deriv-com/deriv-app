import React from 'react';
import { render, screen } from '@testing-library/react';
import ActionScreen from '../ActionScreen';

// jest.mock('@deriv/quill-design', () => ({
//     ...jest.requireActual('@deriv/quill-design'),
//     // useFlow: jest.fn(() => mockUseFlow),
// }));

describe('ActionScreen component', () => {
    it('renders with title', () => {
        render(<ActionScreen description='Description' title='Title' />);
        const titleElement = screen.getByText('Title');
        expect(titleElement).toBeInTheDocument();
    });

    // it('renders with description', () => {
    //     render(<ActionScreen description='Description' />);
    //     const descriptionElement = screen.getByText('Description');
    //     expect(descriptionElement).toBeInTheDocument();
    // });

    // it('renders with custom icon', () => {
    //     const CustomIcon = () => <div>Custom Icon</div>;
    //     render(<ActionScreen icon={<CustomIcon />} />);
    //     const iconElement = screen.getByText('Custom Icon');
    //     expect(iconElement).toBeInTheDocument();
    // });

    // it('calls renderButtons function', () => {
    //     const renderButtons = jest.fn();
    //     render(<ActionScreen renderButtons={renderButtons} />);
    //     expect(renderButtons).toHaveBeenCalled();
    // });

    // it('renders children', () => {
    //     render(
    //         <ActionScreen>
    //             <div>Child</div>
    //         </ActionScreen>
    //     );
    //     const childElement = screen.getByText('Child');
    //     expect(childElement).toBeInTheDocument();
    // });

    // it('applies custom className', () => {
    //     render(<ActionScreen className='custom-class' />);
    //     const component = screen.getByTestId('action-screen');
    //     expect(component).toHaveClass('custom-class');
    // });

    // it('renders with default title and description size', () => {
    //     render(<ActionScreen description='Description' title='Title' />);
    //     const titleElement = screen.getByTestId('title');
    //     const descriptionElement = screen.getByTestId('description');
    //     expect(titleElement).toHaveStyle('font-size: 16px');
    //     expect(descriptionElement).toHaveStyle('font-size: 14px');
    // });
});
