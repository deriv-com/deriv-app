import React from 'react';
import { useStores } from 'Stores/index';
import { ModalManagerContext } from './modal-manager-context';
import { isDesktop } from '@deriv/shared';
import type {
    TModal,
    TModalKeys,
    TModalProps,
    TModalVariants,
    TModalManagerContext,
    TShowModalOptions,
    THideModalOptions,
} from 'Types';

type TModalState = {
    active_modal: TModalVariants | null;
    previous_modal: TModalVariants | null;
    // for mobile, modals are stacked and not shown alternatingly one by one
    stacked_modal: TModalVariants | null;
};

const ModalManagerContextProvider = (props: React.PropsWithChildren<{ mock?: TModalManagerContext }>) => {
    const [modal, setModal] = React.useState<TModalState>({
        active_modal: null,
        previous_modal: null,
        // for mobile, modals are stacked and not shown alternatingly one by one
        stacked_modal: null,
    });
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [modal_props, setModalProps] = React.useState<Map<TModalKeys, TModalProps[TModalKeys]>>(new Map());
    const { general_store } = useStores();

    const setModalState = (state: Partial<TModalState>) => {
        setModal({
            ...modal,
            ...state,
        });
    };

    /**
     * Sets the specified modals' props on mount or when the props passed to the hook has changed.
     *
     * Use this hook to declare the modals' props beforehand for cases when the props can't be passed/declared in stores.
     *
     * For instance, calling `showModal({key: ..., props: ... })` in a store action where the props can't be passed to the action, use this hook to pass the props beforehand
     * and simply call `showModal({key: ...})` without the need to specify the props, since its already passed using this hook to the modal manager.
     *
     * @param {TModal<T>|TModalVariants[]} modals - list of object modals to set props, each modal object must contain a 'key' attribute and 'props' attribute
     */
    const useRegisterModalProps = <T extends TModalKeys>(modals: TModal<T> | TModalVariants[]) => {
        const registered_modals = React.useRef<TModalVariants[]>([]);

        const registerModals = React.useCallback(() => {
            if (Array.isArray(modals)) {
                modals.forEach(registered_modal => {
                    registered_modals.current.push(registered_modal);
                    setModalProps(modal_props.set(registered_modal.key, registered_modal.props));
                });
            } else {
                registered_modals.current.push(modals);
                setModalProps(modal_props.set(modals.key, modals.props));
            }
        }, [modals]);

        React.useEffect(() => {
            registerModals();
            return () => {
                registered_modals.current.forEach(registered_modal => {
                    modal_props.delete(registered_modal.key);
                });
                registered_modals.current = [];
            };
        }, [modals]);
    };

    /**
     * Checks if the current visible modal matches the specified modal key passed to the argument.
     * Can also be used to check for multiple modal keys.
     *
     * @param {...string} keys - the modal keys to check if the current visible modal matches it
     */
    const isCurrentModal = (...keys: TModalKeys[]) =>
        modal.active_modal ? keys.includes(modal.active_modal.key) : false;

    const showModal = <T extends TModalKeys>(modal_to_show: TModal<T>, options?: TShowModalOptions) => {
        // eslint-disable-next-line no-param-reassign
        if (!options) options = { should_stack_modal: false };

        if (isDesktop() || options.should_stack_modal) {
            setModalState({
                active_modal: modal_to_show,
                previous_modal: modal.active_modal,
            });
        } else if (!modal.active_modal) {
            setModalState({
                active_modal: modal_to_show,
            });
        } else {
            setModalState({
                stacked_modal: modal_to_show,
            });
        }
        setIsModalOpen(true);
    };

    /**
     * Hides the current shown modal.
     * If a previous modal was present, by default the previous modal will be shown in-place of the current closed modal.
     * This option can be overriden by setting `should_hide_all_modals` to `true` in the `options` argument to close all modals instead.
     *
     * @param {Object} options - list of supported settings to tweak how modals should be hidden:
     * - **should_hide_all_modals**: `false` by default. If set to `true`, previous modal will not be shown and all modals are hidden.
     * - **should_save_form_history**: `false` by default. If set to `true`, form values in modals that has a form with `ModalForm` component
     * will be saved when the modal is hidden and restored when modal is shown again.
     */
    const hideModal = (options?: THideModalOptions) => {
        // eslint-disable-next-line no-param-reassign
        if (!options) options = { should_save_form_history: false, should_hide_all_modals: false };

        const { should_save_form_history, should_hide_all_modals } = options;

        if (should_save_form_history) {
            general_store.saveFormState();
        } else {
            general_store.setSavedFormState(null);
            general_store.setFormikRef(null);
        }

        if (isDesktop()) {
            if (should_hide_all_modals || modal.previous_modal) {
                setModalState({
                    active_modal: should_hide_all_modals ? null : modal.previous_modal,
                    previous_modal: null,
                });
                if (should_hide_all_modals) setIsModalOpen(false);
            } else {
                setModalState({
                    active_modal: null,
                });
                setIsModalOpen(false);
            }
        } else if (modal.stacked_modal && Object.keys(modal.stacked_modal).length !== 0) {
            setModalState({
                active_modal: should_hide_all_modals ? null : modal.active_modal,
                stacked_modal: null,
            });
            if (should_hide_all_modals) setIsModalOpen(false);
        } else {
            setModalState({
                active_modal: null,
            });
            setIsModalOpen(false);
        }
    };

    general_store.hideModal = hideModal;
    general_store.isCurrentModal = isCurrentModal;
    general_store.modal = modal.active_modal;
    general_store.showModal = showModal;

    const state: TModalManagerContext = {
        hideModal,
        is_modal_open,
        isCurrentModal,
        modal: modal.active_modal,
        previous_modal: modal.previous_modal,
        stacked_modal: modal.stacked_modal,
        modal_props,
        showModal,
        useRegisterModalProps,
    };

    return (
        <ModalManagerContext.Provider value={props.mock ? props.mock : state}>
            {props.children}
        </ModalManagerContext.Provider>
    );
};

export default ModalManagerContextProvider;
