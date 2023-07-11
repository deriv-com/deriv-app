import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalManagerContextProvider from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';
import { useModalManagerContext } from '../modal-manager-context';
import { isDesktop } from '@deriv/shared';
import { Modal } from '@deriv/components';
import { useStores } from 'Stores/index';

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

function MockBuySellModal({ title, subtitle }: { title?: string; subtitle?: string }) {
    const { is_modal_open, hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    useRegisterModalProps({
        key: 'MyAdsDeleteModal',
        props: {
            title: 'Title from BuySellModal',
        } as unknown as Record<string, never>,
    });

    const showMyAdsDeleteModal = () => {
        showModal({
            key: 'MyAdsDeleteModal',
            props: {},
        });
    };

    return (
        <Modal is_open={is_modal_open}>
            {title && <div>BuySellModal with {title}</div>}
            {title && subtitle && (
                <div>
                    BuySellModal with {title} and {subtitle}
                </div>
            )}
            {!title && !subtitle && <div>BuySellModal</div>}
            <button onClick={() => hideModal()}>Cancel</button>
            <button onClick={showMyAdsDeleteModal}>Apply</button>
        </Modal>
    );
}

function MockMyAdsDeleteModal({ title }: { title?: string }) {
    const { is_modal_open, hideModal } = useModalManagerContext();
    return (
        <Modal is_open={is_modal_open}>
            {title && <h1>{title}</h1>}
            <h1>MyAdsDeleteModal</h1>
            <button onClick={() => hideModal()}>Cancel</button>
        </Modal>
    );
}

function MockEditAdCancelModal() {
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    const showBuySellModal = () =>
        showModal({
            key: 'BuySellModal',
            props: {},
        });

    const onSubmit = () => {
        hideModal({
            should_save_form_history: true,
        });
    };

    useRegisterModalProps([
        {
            key: 'BuySellModal',
            props: {
                title: 'my title',
                subtitle: 'my subtitle',
            },
        },
    ]);

    return (
        <div>
            <button onClick={showBuySellModal}>Go to BuySellModal</button>
            <button onClick={onSubmit}>Submit</button>
        </div>
    );
}

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: MockBuySellModal,
        MyAdsDeleteModal: MockMyAdsDeleteModal,
        EditAdCancelModal: MockEditAdCancelModal,
    },
}));

function MockPage() {
    const { isCurrentModal, showModal, hideModal } = useModalManagerContext();

    const showBuySellModal = () =>
        showModal({
            key: 'BuySellModal',
            props: {},
        });

    const showMyAdsDeleteModal = () => {
        showModal({
            key: 'MyAdsDeleteModal',
            props: {},
        });
    };

    const showEditAdCancelModal = () => {
        showModal({
            key: 'EditAdCancelModal',
            props: {},
        });
    };

    const hideModals = () => {
        hideModal({ should_hide_all_modals: true });
    };

    return (
        <div>
            {isCurrentModal('MyAdsDeleteModal') && <h1>Delete Ads</h1>}
            <button onClick={showBuySellModal}>Show BuySellModal</button>
            <button onClick={showMyAdsDeleteModal}>Show MyAdsDeleteModal</button>
            <button onClick={showEditAdCancelModal}>Show EditAdCancelModal</button>
            <button onClick={() => hideModal()}>Hide Modal</button>
            <button onClick={hideModals}>Hide All Modals</button>
        </div>
    );
}

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