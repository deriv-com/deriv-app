import React from 'react';
import Modal from 'react-modal';
import { customStyles } from '../helpers';
import { RadioGroup } from '../../../components/RadioGroup';
import './BlockUnblockUserFilterModal.scss';

type TBlockUnblockUserFilterModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
    onToggle: (value: string) => void;
    selected: string;
};

const DROPDOWN_LIST = [
    { value: 'all', text: 'All' },
    { value: 'blocked', text: 'Blocked' },
];

const BlockUnblockUserFilterModal = ({ isModalOpen, onRequestClose, onToggle, selected }: TBlockUnblockUserFilterModalProps) => {

    return (
        <Modal
            className='p2p-v2-block-unblock-user-filter-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <RadioGroup
                className='p2p-v2-sort-radiogroup'
                name='block-user-filter-modal'
                onToggle={(event) => onToggle(event.target.value)}
                selected={selected}
                required
            >
                {DROPDOWN_LIST.map((list_item, key) => {
                    return (
                        <RadioGroup.Item
                            key={key}
                            value={list_item.value}
                            label={list_item.text}
                        />
                    );
                })}
            </RadioGroup>
        </Modal>
    );
};

export default BlockUnblockUserFilterModal;