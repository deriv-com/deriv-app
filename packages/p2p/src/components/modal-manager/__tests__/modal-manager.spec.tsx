import React from 'react';
import { screen, render } from '@testing-library/react';
import ModalManagerContextProvider from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';
import { TModalManagerContext } from 'Types';
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

    it('should not render any modals if no modals are intended to be shown', () => {
        mock_modal_manager_state.modal = null;

        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should render MockModal component if there are modals to be shown', () => {
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {},
        };
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );
        expect(screen.getByText('BuySellModal')).toBeInTheDocument();
    });

    it('should render the latest shown modal', () => {
        mock_modal_manager_state.modal_props.set('BuySellModal', {
            title: 'Cached Title',
        });
        mock_modal_manager_state.modal = {
            key: 'AdErrorTooltipModal',
            props: {},
        };
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should render MockModal component with props passed', () => {
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {
                title: 'Title',
            },
        };
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );
        expect(screen.getByText('BuySellModal with Title')).toBeInTheDocument();
    });

    it('should pass modal props to the MockModal when there are cached and registered props', () => {
        mock_modal_manager_state.modal_props.set('BuySellModal', {
            title: 'Cached Title',
        });
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );
        expect(screen.getByText('BuySellModal with Cached Title')).toBeInTheDocument();
    });

    it('should use registered props and passed-in props to the MockModal', () => {
        mock_modal_manager_state.modal_props.set('BuySellModal', {
            title: 'Cached Title',
        });
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {
                subtitle: 'Subtitle',
            },
        };
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );
        expect(screen.getByText('BuySellModal with Cached Title and Subtitle')).toBeInTheDocument();
    });
});
