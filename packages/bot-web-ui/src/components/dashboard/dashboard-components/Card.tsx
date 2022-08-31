//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon } from '@deriv/components';
import Translations from './Translations';
import { localize } from '@deriv/translations';
// import { connect } from 'Stores/connect';
// import PropTypes  from 'prop-types';

interface DashboardProps {
    steps: (state: boolean) => void;
}

const { IconArray } = Translations;

//onDriveConnect
const Card = () => {
    return (
        <div className='dc-tabs__content_group_tiles' id='dc-tabs__content_group_tiles'>
            {IconArray.map((icons, index, load_modal) => {
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
                            // onClick={onDriveConnect}
                        />
                        <span className='dc-tabs__content_group_tiles_content'>{localize(content)}</span>
                    </div>
                );
            })}
        </div>
    );
};
// Card.propTypes = {
//     onDriveConnect: PropTypes.func,
// };
// export default connect(( data ) => ({
//     onDriveConnect: load_modal.onDriveConnect,
// }))(Card);

export default Card;
