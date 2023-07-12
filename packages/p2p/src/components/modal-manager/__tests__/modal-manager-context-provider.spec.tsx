import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalManagerContextProvider from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';
import { isDesktop } from '@deriv/shared';
import { useStores } from 'Stores/index';
import { MockBuySellModal, MockMyAdsDeleteModal, MockEditAdCancelModal, MockPage } from '../__mocks__/mock-modal-manager-context-provider';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        saveFormState: jest.fn(),
        setSavedFormState: jest.fn(),
        setFormikRef: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: (props: any) => <MockBuySellModal {...props} />,
        MyAdsDeleteModal: (props: any) => <MockMyAdsDeleteModal {...props} />,
        EditAdCancelModal: (props: any) => <MockEditAdCancelModal {...props} />,
    },
}));

describe('<ModalManagerContextProvider />', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    afterAll(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should render the mock modal when showModal is called in desktop view', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        userEvent.click(showBtn);

        const text = screen.getByText('BuySellModal');
        expect(text).toBeInTheDocument();
    });

    it('should render the latest shown modal when showModal is called multiple times in desktop view', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn);

        expect(screen.getByText('MyAdsDeleteModal')).toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should render the mock modal when showModal is called in responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        userEvent.click(showBuySellModalBtn);
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();
    });

    it('should render the latest shown modal when showModal is called multiple times in responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hideModalBtn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn);
        expect(screen.queryByText('MyAdsDeleteModal')).toBeInTheDocument();

        userEvent.click(hideModalBtn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();

        userEvent.click(hideModalBtn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should return correct status of modal visibility based on isCurrentModal function', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        userEvent.click(showMyAdsDeleteModalBtn);
        expect(screen.getByText('Delete Ads')).toBeInTheDocument();
    });

    it('should hide a modal if hideModal is called in desktop view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => true);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hideModalBtn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        userEvent.click(showMyAdsDeleteModalBtn);
        userEvent.click(hideModalBtn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn);
        userEvent.click(hideModalBtn);
        expect(screen.getByText('BuySellModal')).toBeInTheDocument();
    });

    it('should hide a modal if hideModal is called in responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hideModalBtn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn);
        userEvent.click(hideModalBtn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();

        userEvent.click(hideModalBtn);
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should hide all modals if should_hide_all_modals option is passed in hideModal function on desktop view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => true);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        const hideAllModalsBtn = screen.getByRole('button', {
            name: /Hide All Modals/,
        });

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn);
        userEvent.click(hideAllModalsBtn);

        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should hide all modals if should_hide_all_modals option is passed in hideModal function on responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        const hideAllModalsBtn = screen.getByRole('button', {
            name: /Hide All Modals/,
        });

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn);
        userEvent.click(hideAllModalsBtn);

        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should cache and register the modal props with useRegisterModalProps and pass it to the registered modal', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        userEvent.click(showBuySellModalBtn);

        const applyBtn = screen.getByRole('button', {
            name: /Apply/,
        });
        userEvent.click(applyBtn);
        expect(screen.getByText('Title from BuySellModal')).toBeInTheDocument();
    });

    it('should cache and register multiple modal props with useRegisterModalProps and pass it to the registered modal', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showEditAdCancelModal = screen.getByRole('button', {
            name: /Show EditAdCancelModal/,
        });
        userEvent.click(showEditAdCancelModal);

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Go to BuySellModal/,
        });
        userEvent.click(showBuySellModalBtn);
        expect(screen.getByText('BuySellModal with my title and my subtitle')).toBeInTheDocument();
    });

    it('should save form state of the modal in general_store when saveFormState is called', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showEditAdCancelModal = screen.getByRole('button', {
            name: /Show EditAdCancelModal/,
        });
        userEvent.click(showEditAdCancelModal);

        const submitBtn = screen.getByRole('button', {
            name: /Submit/,
        });
        userEvent.click(submitBtn);
        expect(mock_store.general_store.saveFormState).toBeCalled();
    });
});