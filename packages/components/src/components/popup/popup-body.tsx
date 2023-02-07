import React from 'react';
import PopupFooter from './popup-footer';
import PopupContext, { TDetail } from './popup-context';
import Tabs from '../tabs';

const PopupBody = () => {
    const {
        active_tab_icon_color,
        header_background_color,
        tab_icon_color,
        tabs_detail,
        overlay_ref,
        setIsOverlayShown,
        Component,
    } = React.useContext(PopupContext);

    if (typeof Component === 'function') {
        return <Component overlay_ref={overlay_ref} setIsOverlayShown={setIsOverlayShown} />;
    }

    return (
        <Tabs
            active_icon_color={active_tab_icon_color}
            background_color={header_background_color}
            className='popup'
            center
            fit_content
            has_active_line={false}
            has_bottom_line={false}
            icon_color={tab_icon_color}
            icon_size={30}
            top
        >
            {tabs_detail.map((detail: TDetail) => {
                const { id, has_footer_separator, renderBody, renderFooter } = detail;

                const BodyComponent = typeof renderBody === 'function' ? renderBody : null;
                const FooterComponent = typeof renderFooter === 'function' ? renderFooter : null;

                return (
                    <div key={id}>
                        {BodyComponent && (
                            <BodyComponent overlay_ref={overlay_ref} setIsOverlayShown={setIsOverlayShown} />
                        )}
                        {FooterComponent && (
                            <PopupFooter has_separator={has_footer_separator}>
                                <FooterComponent />
                            </PopupFooter>
                        )}
                    </div>
                );
            })}
        </Tabs>
    );
};

export default PopupBody;
