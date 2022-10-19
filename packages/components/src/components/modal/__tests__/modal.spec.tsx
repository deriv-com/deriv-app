import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../modal';

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal_root');
document.body.appendChild(modalRoot);

describe('<Modal />', () => {
    test('shows the children', () => {
        // Arrange
        const handleToggleModal = jest.fn();

        // Act
        render(
            <Modal toggleModal={handleToggleModal} is_open={true}>
                <div>test</div>
            </Modal>
        );
        // Assert
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    test('calls toggleModal on close', () => {
        // Arrange
        const handleToggleModal = jest.fn();

        // Act
        render(
            <Modal toggleModal={handleToggleModal} is_open={true} has_close_icon title='title'>
                <div>test</div>
            </Modal>
        );

        // Assert
        fireEvent.click(screen.getByRole('button'));

        // Assert
        expect(handleToggleModal).toHaveBeenCalledTimes(1);
    });
});
