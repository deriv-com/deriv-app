import React from 'react';
import { Modal, RadioGroup, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const BlockUserFilterModal = () => {
    const { my_profile_store } = useStores();
    const { is_modal_open, hideModal } = useModalManagerContext();

    return (
        <Modal is_open={is_modal_open} height='10rem' toggleModal={hideModal} width='80vw'>
            <RadioGroup
                className='sort-radiogroup'
                name='block-user-filter-modal'
                onToggle={my_profile_store.handleChange}
                selected={my_profile_store.selected_sort_value}
                required
            >
                {my_profile_store.block_user_sort_list.map((list_item, key) => {
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

export default observer(BlockUserFilterModal);
