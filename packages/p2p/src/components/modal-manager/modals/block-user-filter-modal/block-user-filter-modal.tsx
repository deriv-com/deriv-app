import React from 'react';
import { Modal, RadioGroup, Text } from '@deriv-app/components';
import { observer } from '@deriv-app/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
// @ts-ignore
import { useStores } from 'Stores';

const BlockUserFilterModal = () => {
    const { my_profile_store } = useStores();
    const { is_modal_open, hideModal } = useModalManagerContext();

    return (
        // @ts-ignore
        <Modal is_open={is_modal_open} height='10rem' toggleModal={hideModal} width='80vw'>
            <RadioGroup
                className='sort-radiogroup'
                name='block-user-filter-modal'
                onToggle={my_profile_store.handleChange}
                selected={my_profile_store.selected_sort_value}
                required
            >
                {/*// @ts-ignore*/}
                {my_profile_store.block_user_sort_list.map((list_item, key) => {
                    return (
                        <RadioGroup.Item
                            key={key}
                            value={list_item.value}
                            // @ts-ignore
                            label={<Text color='prominent'>{list_item.text}</Text>}
                        />
                    );
                })}
            </RadioGroup>
        </Modal>
    );
};

export default observer(BlockUserFilterModal);
