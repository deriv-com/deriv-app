import { action, computed, observable, reaction } from 'mobx';
import BaseStore from 'Stores/base_store';

export default class ModalStore extends BaseStore {
    @observable modal_id = '';
    @observable current_modal = '';
    @observable is_modal_open = false;
    @observable modal_history = null;
    @observable previous_modal = '';
    @observable modal_props = new Map();

    should_switch_modal = false;
    MODAL_TRANSITION_DELAY = 300;

    @computed
    get props() {
        return this.modal_props.get(this.current_modal);
    }

    @action.bound
    onMount() {
        // only this reaction can modify is_modal_open and modal_id, NO ONE ELSE CAN DO IT!
        const disposer = reaction(
            () => this.current_modal,
            () => {
                if (this.is_modal_open) {
                    if (this.should_switch_modal) {
                    } else {
                        this.setIsModalOpen(false);
                        this.setModalId('');
                        // // let the current modal close first, and then only unmount it
                        // setTimeout(() => this.setModalId(''), this.MODAL_TRANSITION_DELAY);
                    }
                } else {
                    if (this.should_switch_modal) {
                    } else {
                        this.setModalId(this.current_modal);
                        this.setIsModalOpen(true);
                    }
                }
            }
        );

        return disposer;
    }

    @action.bound
    setCurrentModal(modal_id) {
        this.current_modal = modal_id;
    }

    @action.bound
    setIsModalOpen(is_modal_open) {
        this.is_modal_open = is_modal_open;
    }

    @action.bound
    setModalId(modal_id) {
        this.modal_id = modal_id;
    }

    @action.bound
    passModalProps(modal_id, modal_props) {
        this.modal_props.set(modal_id, modal_props);
    }

    @action.bound
    setPreviousModal(modal_id) {
        this.previous_modal = modal_id;
    }

    @action.bound
    showModal(modal_id) {
        // case 1: there is a current modal being shown, and they want to show another modal
        if (this.current_modal) {
            this.should_switch_modal = true;
            this.setPreviousModal(this.current_modal);
            this.setCurrentModal(modal_id);
        } else {
            this.setCurrentModal(modal_id);
        }
    }

    @action.bound
    hideModal() {
        // case 1: there is no previous modal and only 1 modal is shown
        if (this.previous_modal === '') {
            this.setCurrentModal('');
        } else {
            // case 2: there is a previous modal that was shown, switch to that previous modal and reset previous modal state
            this.should_switch_modal = true;
            this.setCurrentModal(this.previous_modal);
            this.setPreviousModal('');
        }
    }
}
