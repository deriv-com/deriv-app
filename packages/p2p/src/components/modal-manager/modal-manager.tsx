import React from 'react';
import { Modals } from 'Constants/modals';
import { useModalManagerContext } from './modal-manager-context';
import { TModal, TModalKeys, TModalProps, TModalVariants } from 'Types';

type LazyModal = React.LazyExoticComponent<React.ComponentType<TModalProps[TModalKeys]>>;

const ModalManager = () => {
    const { modal, modal_props, stacked_modal } = useModalManagerContext();
    // type guard for nullish modal value, exit early
    if (!modal) return null;

    const { key } = modal;
    const Modal = Modals[key] as LazyModal;

    const StackedModal = stacked_modal ? (Modals[stacked_modal.key] as LazyModal) : null;

    const getModalProps = <T extends TModalKeys>(current_modal: TModal<T>): TModalProps[T] => {
        if (current_modal?.props && Object.keys(current_modal.props).length > 0) {
            // if props was provided to the argument and it was also already initialised using useRegisterModalProps,
            // merge the 2 props together and update latest prop values with the passed prop argument
            if (modal_props.has(current_modal.key)) {
                return {
                    ...modal_props.get(current_modal.key),
                    ...current_modal.props,
                } as TModalProps[T];
            }
            return current_modal.props;
        }
        if (modal_props.has(current_modal.key)) {
            return modal_props.get(current_modal.key) as TModalProps[T];
        }

        return {} as TModalProps[T];
    };

    if (Modal) {
        return (
            <React.Suspense fallback={null}>
                <Modal {...getModalProps(modal)} />
                {StackedModal && (
                    <React.Suspense fallback={null}>
                        <StackedModal {...getModalProps(stacked_modal as TModalVariants)} />
                    </React.Suspense>
                )}
            </React.Suspense>
        );
    }

    return null;
};

export default ModalManager;
