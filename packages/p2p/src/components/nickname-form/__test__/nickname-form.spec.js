import React from 'react';
import { useStores } from 'Stores';
// import { isMobile } from '@deriv/shared';
import { Button, Input, Icon, Modal, Text } from '@deriv/components';
import { fireEvent, render, screen } from '@testing-library/react';
import NicknameForm from '../nickname-form.jsx';

const mock_general_store = {
    onNicknamePopupClose: jest.fn(),
    createAdvertiser: jest.fn(),
    validatePopup: jest.fn(),
    nickname_error: false,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { ...mock_general_store },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('<NicknameForm/>', () => {
    it('closes the popup if close icon is clicked', () => {
        const { general_store } = useStores();
        render(<NicknameForm />);
        console.log(screen.debug());
        fireEvent.click(screen.getByTestId('icon_close'));
        expect(general_store.onNicknamePopupClose).toHaveBeenCalled();
    });

    it('');
});
