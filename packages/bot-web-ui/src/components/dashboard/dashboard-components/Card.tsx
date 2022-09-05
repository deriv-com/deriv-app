//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon } from '@deriv/components';
import Translations from './Translations';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';

const { IconArray } = Translations;

interface CardProps {
    load_modal: LoadModalStore;
}

const Card = ({ load_modal }: CardProps) => {
    //console.log(load_modal, 'load_modal');

    return (
        <div className='dc-tabs__content_group_tiles' id='dc-tabs__content_group_tiles'>
            {IconArray.map((icons, index) => {
                const { icon, content } = icons;
                return (
                    <div key={index} className='dc-tabs__content_group_tiles_block'>
                        <Icon
                            className='dc-tabs__content_group_tiles_images'
                            width='8rem'
                            height='8rem'
                            style={{ backgroundColor: `#F2F3F4` }}
                            icon={icon}
                            id={icon}
                            //onClick={load_modal.onDriveConnect}
                        />
                        <span className='dc-tabs__content_group_tiles_content'>{localize(content)}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default connect((store: RootStore) => {
    //console.log(store, 'store');
    return {
        load_modal: store.load_modal,
    };
})(Card);
