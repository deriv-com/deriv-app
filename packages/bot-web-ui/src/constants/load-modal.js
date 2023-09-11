export const tabs_title = Object.freeze({
    TAB_LOCAL: 'local_tab',
    TAB_GOOGLE: 'google_tab',
    TAB_RECENT: 'recent_tab',
});

export const clearInjectionDiv = (type, el_ref) => {
    if (type === 'store') {
        if (el_ref && el_ref.getElementsByClassName('injectionDiv').length > 1) {
            el_ref.removeChild(el_ref.getElementsByClassName('injectionDiv')[0]);
        }
    } else {
        el_ref?.current?.removeChild(el_ref?.current?.children[0]);
    }
};
