import React from 'react';

export const TabContainer = ({ className = '', theme = '', children }) => (
    <div className={`content-tab-container ${className} ${theme}`}>
        {children}
    </div>
);

export const Tabs = ({ id, id_ul, arr_tabs = [], no_href }) => (
    <div id={id}>
        <ul id={id_ul} className='tm-ul follow-default'>
            { arr_tabs.map((tab, idx) => (
                !tab.disabled &&
                    <li key={idx} id={tab.id} className={`tm-li ${tab.className || ''}`}>
                        <a href={no_href ? 'javascript:;' : `#${tab.id}`} className='tm-a'>{tab.text}</a>
                    </li>
            ))}
        </ul>
    </div>
);

export const TabContentContainer = ({ id, children }) => (
    <div className='tab-content-wrapper' id={id || undefined}>
        {children}
    </div>
);

export const TabContent = ({ id, visible, children, className }) => (
    <div id={`${id}-content`} className={`toggle-content ${visible ? '' : 'invisible'} ${className || ''}`}>
        {children}
    </div>
);

export const TabsSubtabs = ({ className = '', id, items = [] }) => {
    const is_tab_selector = /tab-selector-wrapper/.test(className);
    const getHref = (item_id) => is_tab_selector ? `?${id}=${item_id}` : `#${item_id}`;
    return (
        <div className={`tab-menu ${className}`}>
            <div className='tab-menu-wrap'>
                <ul id={id} className='tm-ul'>
                    {items.map((item, idx) => (
                        !item.disabled &&
                        <li key={idx} id={item.id} className={`tm-li ${item.className || ''}`} data-show={item.dataShow} >
                            { item.subtabs &&
                                <React.Fragment>
                                    <span className='menu-wrap-a'>
                                        <span className='menu-wrap-b'>
                                            <a href={getHref(item.id)} className='tm-a'>{item.text}</a>
                                        </span>
                                    </span>
                                    <ul className='tm-ul-2'>
                                        { item.subtabs.map((subtab, idx_subtab) => (
                                            <li key={idx_subtab} id={subtab.id} className='tm-li-2'><a href={getHref(subtab.id)} className='tm-a-2'>{subtab.text}</a></li>
                                        ))}
                                    </ul>
                                </React.Fragment>
                            }
                            { !item.subtabs && item.text &&
                                <a href={getHref(item.id)} className='tm-a'>{item.text}</a>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
