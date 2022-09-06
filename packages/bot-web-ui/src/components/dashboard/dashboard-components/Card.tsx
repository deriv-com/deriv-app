//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';

interface CardProps {
    load_modal: LoadModalStore;
}

const Card = ({ load_modal }: CardProps) => {
    const { onDriveConnect } = load_modal;
    // todo for the file input
    // const file_input_ref = React.useRef(null);
    // const [is_file_supported, setIsFileSupported] = React.useState(true);

    const IconArray = [
        {
            icon: 'IcMyComputer',
            content: 'My computer',
        },
        {
            icon: 'IcGoogleDriveDbot',
            content: 'Google Drive',
            method: onDriveConnect,
        },
        {
            icon: 'IcBotBuilder',
            content: 'Bot Builder',
            //need to use react hooks to switch TODO need to use method created from store
            method: () => {
                return document.getElementById('id-bot-builder')?.click();
            },
        },
        {
            icon: 'IcQuickStrategy',
            content: 'Quick Strategy',
            //need to use react hooks to switch TODO need to use method created from store
            method: () => {
                return document.getElementById('id-quick-strategy')?.click();
            },
        },
    ];

    return (
        <div className='dc-tabs__content_group_tiles' id='dc-tabs__content_group_tiles'>
            {IconArray.map((icons, index) => {
                const { icon, content, method } = icons;
                return (
                    <div key={index} className='dc-tabs__content_group_tiles_block'>
                        <Icon
                            className='dc-tabs__content_group_tiles_images'
                            width='8rem'
                            height='8rem'
                            style={{ backgroundColor: `#F2F3F4` }}
                            icon={icon}
                            id={icon}
                            onClick={method}
                        />
                        {/* TODO file input for */}
                        {/* <input
                            type='file'
                            ref={file_input_ref}
                            accept='.xml'
                            style={{ display: 'none' }}
                            onChange={e => setIsFileSupported(handleFileChange(e, false))}
                        /> */}
                        <span className='dc-tabs__content_group_tiles_content'>{localize(content)}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default connect((store: RootStore) => {
    return {
        load_modal: store.load_modal,
    };
})(Card);
