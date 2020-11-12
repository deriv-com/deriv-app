import PropTypes from 'prop-types';
import { mobileOSDetect } from '@deriv/shared';
import React from 'react';
import { use100vh } from 'react-div-100vh';

/* Div100vh is workaround for getting accurate height of 100vh from browsers on mobile,
    because using normal css vh is not returning correct screen height */
/* To adjust max-height using calculation when using height: auto (or no rvh units), pass style props and use rvh unit instead vh,
        e.g - style={{ maxHeight: calc(100rvh - 100px )}}
    */
/* To adjust height using calculation, pass style props and use rvh unit instead vh,
    e.g - style={{ height: calc(100rvh - 100px )}}
*/
/* To manually remove rvh calculation and revert to default browser calculation use is_disabled */
/* To bypass usage of component altogether, use is_bypassed */
const Div100vhContainer = ({
    children,
    className,
    is_bypassed,
    is_disabled,
    id,
    height_offset,
    max_autoheight_offset,
}) => {
    const [has_onscreen_android_keyboard, setOnScreenAndroidKeyboard] = React.useState(false);

    React.useEffect(() => {
        const onFocus = e => {
            if (e.target.tagName === 'INPUT') {
                // check if android keyboard is toggled
                if (document.activeElement === e.target && mobileOSDetect() === 'Android') {
                    setOnScreenAndroidKeyboard(true);
                }
            }
        };

        const onFocusOut = () => {
            setOnScreenAndroidKeyboard(false);
        };

        document.addEventListener('focus', onFocus, true);
        document.addEventListener('focusout', onFocusOut, false);

        return () => {
            document.removeEventListener('focus', onFocus, true);
            document.removeEventListener('focusout', onFocusOut, false);
        };
    }, [has_onscreen_android_keyboard, setOnScreenAndroidKeyboard]);

    const height = use100vh();
    const height_rule = height_offset ? `calc(${height}px - ${height_offset})` : `${height}px`;

    // height:'100%' should be set for android devices whenever keyboard is toggled due to viewport resizing
    const height_style = has_onscreen_android_keyboard
        ? {
              height: '100%',
              maxHeight: 'none',
          }
        : {
              height: max_autoheight_offset ? null : height_rule,
              maxHeight: max_autoheight_offset ? `calc(${height}px - ${max_autoheight_offset})` : null,
          };
    if (is_bypassed) return children;
    return (
        <div id={id} className={className} style={is_disabled ? {} : height_style}>
            {children}
        </div>
    );
};

Div100vhContainer.propTypes = {
    id: PropTypes.string,
    children: PropTypes.any,
    height_offset: PropTypes.string,
    is_bypassed: PropTypes.bool,
    is_disabled: PropTypes.bool,
    max_height_offset: PropTypes.string,
};

export default Div100vhContainer;
