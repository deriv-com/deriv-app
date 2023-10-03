import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractError from '../contract-error';

const mocked_props = {
    onClickClose: jest.fn(),
};
const test_text = 'test_text';
jest.mock('@deriv/components', () => ({
    Icon: jest.fn(() => 'MockedIcon'),
}));

describe('ContractError', () => {
    it('should not render component if message is falsy', () => {
        const { container } = render(<ContractError {...mocked_props} />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should render component with specific text inside if it was passed as a message in the props', () => {
        render(<ContractError {...mocked_props} message={test_text} />);

        expect(screen.getByText(test_text)).toBeInTheDocument();
    });
    it('should call the function if the icon was clicked', () => {
        render(<ContractError {...mocked_props} message={test_text} />);
        const icon = screen.getByText('MockedIcon');
        userEvent.click(icon);

        expect(mocked_props.onClickClose).toBeCalled();
    });
});
