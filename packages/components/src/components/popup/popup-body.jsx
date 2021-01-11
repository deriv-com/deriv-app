import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '../tabs';

const renderBody = body => (typeof body === 'function' ? body() : null);
const Body = ({ active_tab_icon_color, background_color, tab_icon_color, tabs_detail }) => {
    return (
        <Tabs
            active_icon_color={active_tab_icon_color}
            background_color={background_color}
            className='popup'
            center
            fit_content
            has_active_line={false}
            has_bottom_line={false}
            icon_color={tab_icon_color}
            top
        >
            {tabs_detail.map(detail => {
                return (
                    <div key={detail.id} label={detail.title} icon={detail.icon}>
                        {renderBody(detail.render_body)}
                    </div>
                );
            })}
        </Tabs>
    );
};

Body.propTypes = {
    active_tab_icon_color: PropTypes.string,
    background_color: PropTypes.string,
    tabs_detail: PropTypes.arrayOf(
        PropTypes.shape({
            render_body: PropTypes.func,
            icon: PropTypes.string,
            id: PropTypes.number,
            title: PropTypes.string,
        })
    ),
    tab_icon_color: PropTypes.string,
};

export default Body;
