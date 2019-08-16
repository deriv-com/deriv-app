import PropTypes      from 'prop-types';
import React          from 'react';
import { connect }    from 'Stores/connect';
import { BinaryLink } from '../../Routes';

class DrawerItem extends React.Component {
    drawerItemClicked = () => {
        this.props.hideDrawers();
        if (this.props.collapseItems) {
            this.props.collapseItems();
        }
    };

    render() {
        const { link_to, text, icon, custom_action } = this.props;

        return (
            <div className='drawer__item' onClick={this.drawerItemClicked}>
                {custom_action ?
                    <a className='drawer__item-link' onClick={custom_action}>
                        <span className='drawer__item-link-text'>{icon}{text}</span>
                    </a>
                    :
                    <BinaryLink className='drawer__item-link' to={link_to}>
                        <span className='drawer__item-link-text'>{icon}{text}</span>
                    </BinaryLink>
                }
            </div>
        );
    }
}

DrawerItem.propTypes = {
    collapseItems: PropTypes.func,
    custom_action: PropTypes.func,
    hideDrawers  : PropTypes.func,
    href         : PropTypes.string,
    icon         : PropTypes.node,
    link_to      : PropTypes.string,
    text         : PropTypes.string,
};

const drawer_item_component = connect(({ ui }) => ({
    hideDrawers: ui.hideDrawers,
}))(DrawerItem);

export { drawer_item_component as DrawerItem };
