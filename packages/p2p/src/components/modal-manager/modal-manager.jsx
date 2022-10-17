import { useModalManagerContext } from './modal-manager-context';

const ModalManager = () => {
    const { modal } = useModalManagerContext();

    return modal;
};

export default ModalManager;
