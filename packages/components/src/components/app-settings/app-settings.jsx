import * as React from 'react';
import { isMobile } from '@deriv/shared';
import PropTypes from 'prop-types';
import AppSettingsFooter from './app-settings-footer.jsx';
import AppSettingsMenuItem from './app-settings-menu-item.jsx';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars.jsx';

const AppSettings = ({ menu_items, overlay_ref, setIsOverlayShown }) => {
    const active_item_ref = React.useRef(null);
    const content_container_ref = React.useRef(null);
    const scrollbar_ref = React.useRef(null);
    const timeout_ref = React.useRef(null);
    const menu_ref = React.useRef(null);

    const [active_index, setActiveIndex] = React.useState(0);
    const [footer_ref, setFooterRef] = React.useState(null);
    const [highlight_top_offset, setHighlightTopOffset] = React.useState(0);

    React.useLayoutEffect(() => {
        // Ensure scroll position does NOT persist through "tab" changes.
        if (scrollbar_ref.current) {
            scrollbar_ref.current.scrollTop = 0;
        }

        const el_active_item = active_item_ref.current;

        // In some cases the host of this component may mount with a delay
        // resulting in a race condition and the highlight positioned wrongly.
        const conditionallySetOffsetTop = () => {
            if (el_active_item.offsetTop > 0) {
                setHighlightTopOffset(el_active_item.offsetTop);
            } else {
                timeout_ref.current = setTimeout(conditionallySetOffsetTop, 100);
            }
        };

        conditionallySetOffsetTop();

        return () => clearTimeout(timeout_ref.current);
    }, [active_index]);

    React.useLayoutEffect(() => {
        // Ensures the width of the menu doesn't change when bolding the active menu item.
        if (highlight_top_offset > 0 && menu_ref.current && !menu_ref.current.hasAttribute('style')) {
            menu_ref.current.setAttribute(
                'style',
                `min-width: ${menu_ref.current.scrollWidth}px; max-width: ${menu_ref.current.scrollWidth}px;`
            );
        }
    }, [highlight_top_offset]);

    const Component = menu_items[active_index].component;

    return (
        <div className='dc-app-settings'>
            <div className='dc-app-settings__menu' ref={ref => (menu_ref.current = ref)}>
                {menu_items.map((menu_item, idx) => (
                    <AppSettingsMenuItem
                        key={menu_item.key}
                        is_active={idx === active_index}
                        onClick={idx === active_index ? undefined : () => setActiveIndex(idx)}
                        refSetter={ref => (active_item_ref.current = ref)}
                        title={menu_item.title}
                    />
                ))}
                <div
                    className='dc-app-settings__menu-highlight'
                    style={{
                        transform: `translate3d(0, ${highlight_top_offset}px, 0)`,
                    }}
                />
            </div>
            <div className='dc-app-settings__content-container' ref={content_container_ref}>
                <div className='dc-app-settings__content'>
                    <ThemedScrollbars
                        autohide={false}
                        is_bypassed={isMobile()}
                        className='dc-app-settings__scrollbars'
                        refSetter={ref => (scrollbar_ref.current = ref)}
                    >
                        <Component
                            is_app_settings
                            footer_ref={footer_ref}
                            overlay_ref={overlay_ref}
                            setIsOverlayShown={setIsOverlayShown}
                        />
                    </ThemedScrollbars>
                </div>
                <div className='dc-app-settings__footer-wrapper' ref={ref => setFooterRef(ref)} />
            </div>
        </div>
    );
};

AppSettings.Footer = AppSettingsFooter;
AppSettings.MenuItem = AppSettingsMenuItem;

AppSettings.propTypes = {
    menu_items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            component: PropTypes.any.isRequired,
        })
    ),
    overlay_ref: PropTypes.shape({ current: PropTypes.any }),
    setIsOverlayShown: PropTypes.func,
};

export default AppSettings;
