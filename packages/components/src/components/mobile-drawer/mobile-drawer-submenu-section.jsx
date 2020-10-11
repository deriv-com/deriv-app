import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

class SubMenuSection extends React.PureComponent {
    render() {
        return (
            <div className={classNames('dc-mobile-drawer__submenu-section', this.props.submenu_toggle_class)}>
                <div className='dc-mobile-drawer__submenu-section-title'>
                    {this.props.section_icon && (
                        <Icon className='dc-mobile-drawer__submenu-section-title-icon' icon={this.props.section_icon} />
                    )}
                    {this.props.section_title && (
                        <h3 className='dc-mobile-drawer__submenu-section-title-text'>{this.props.section_title}</h3>
                    )}
                </div>
                <div className='dc-mobile-drawer__submenu-section-content'>{this.props.children}</div>
            </div>
        );
    }
}

SubMenuSection.propTypes = {
    children: PropTypes.node,
    section_icon: PropTypes.string,
    section_title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default SubMenuSection;
