import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, RadioGroup, Text } from '@deriv/components';
import { useStores } from 'Stores';

const BlockUserFilterModal = () => {
    const { my_profile_store } = useStores();

    return (
        <Modal
            is_open={my_profile_store.is_filter_modal_open}
            height='10rem'
            toggleModal={() => my_profile_store.setIsFilterModalOpen(false)}
            width='80vw'
        >
            <RadioGroup
                className='sort-radiogroup'
                onToggle={my_profile_store.handleChange}
                selected={my_profile_store.selected_sort_value}
                required
            >
                {my_profile_store.block_user_sort_list.map((list_item, key) => {
                    return (
                        <RadioGroup.Item
                            key={key}
                            value={list_item.value}
                            label={
                                <Text color='prominent' size='s'>
                                    {list_item.text}
                                </Text>
                            }
                        />
                    );
                })}
            </RadioGroup>
        </Modal>
    );
};

export default observer(BlockUserFilterModal);
