import React from 'react';
import { render } from '@testing-library/react';
import { TModalManagerContext } from 'Types';
import ModalManager from '../modal-manager';
import { MockModal } from '../__mocks__/mock-modal-manager';

let mock_modal_manager_state: TModalManagerContext;

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: (props: any) => <MockModal {...props} />,
    },
}));

describe('<ModalManager />', () => {
    beforeEach(() => {
        mock_modal_manager_state = {
            is_modal_open: true,
            modal: {
                key: 'BuySellModal',
                props: {},
            },
            hideModal: jest.fn(),
            isCurrentModal: jest.fn(),
            modal_props: new Map(),
            previous_modal: null,
            showModal: jest.fn(),
            stacked_modal: null,
            useRegisterModalProps: jest.fn(),
        };
    });

    afterAll(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should throw an error if not wrapped with ModalManagerContextProvider component', () => {
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {},
        };

        expect(() =>
            render(
                <React.Fragment>
                    <ModalManager />
                </React.Fragment>
            )
        ).toThrowError();
    });
});
