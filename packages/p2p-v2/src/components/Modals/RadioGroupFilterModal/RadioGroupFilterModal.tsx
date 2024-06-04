import React from 'react';
import Modal from 'react-modal';
import { RadioGroup } from '@/components';
import { customStyles } from '../helpers';
import './RadioGroupFilterModal.scss';

type TRadioGroupFilterModalProps = {
    isModalOpen: boolean;
    list: readonly { text: string; value: string }[];
    onRequestClose: () => void;
    onToggle: (value: string) => void;
    selected: string;
};

const RadioGroupFilterModal = ({
    isModalOpen,
    list,
    onRequestClose,
    onToggle,
    selected,
}: TRadioGroupFilterModalProps) => {
    return (
        <Modal
            className='p2p-v2-radio-group-filter-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <RadioGroup
                className='p2p-v2-sort-radiogroup'
                name='block-user-filter-modal'
                onToggle={event => onToggle(event.target.value)}
                required
                selected={selected}
            >
                {list.map(listItem => {
                    return <RadioGroup.Item key={listItem.value} label={listItem.text} value={listItem.value} />;
                })}
            </RadioGroup>
        </Modal>
    );
};

export default RadioGroupFilterModal;
