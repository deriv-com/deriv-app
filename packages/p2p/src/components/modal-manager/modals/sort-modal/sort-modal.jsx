import React from 'react';
import { RadioGroup, Modal, Text } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const SortModal = () => {
    const { buy_sell_store } = useStores();
    const { handleChange, selected_value, sort_list } = buy_sell_store;
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal name='sort' className='sort' is_open={is_modal_open} height='10rem' toggleModal={hideModal} width='80vw'>
            <RadioGroup
                name='reason'
                className='sort-radiogroup'
                onToggle={handleChange}
                selected={selected_value}
                required
            >
                {sort_list.map((list_item, key) => {
                    return (
                        <RadioGroup.Item
                            key={key}
                            value={list_item.value}
                            label={<Text color='prominent'>{list_item.text}</Text>}
                        />
                    );
                })}
            </RadioGroup>
        </Modal>
    );
};

export default SortModal;
