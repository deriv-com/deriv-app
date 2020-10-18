import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from 'Components/icon';
import MobileDrawer from 'Components/mobile-drawer';
import notes from './README.md';
import './mobile-deawer.stories.scss';

storiesOf('MobileDrawer', module).add(
    'Main function',
    () => {
        const [is_open, set_is_open] = React.useState(true);
        const [is_submenu_expanded, set_is_submenu_expanded] = React.useState(false);

        const toggleDrawer = () => {
            set_is_open(!is_open);
        };
        const toggleSubMenu = () => {
            set_is_submenu_expanded(!is_submenu_expanded);
        };
        return (
            <>
                {!is_open && (
                    <a onClick={toggleDrawer}>
                        <Icon icon='IcHamburger' width='32px' height='32px' />
                    </a>
                )}

                <MobileDrawer
                    alignment='left'
                    is_open={is_open}
                    toggle={toggleDrawer}
                    id='dt_mobile_drawer'
                    // enableApp={this.props.enableApp}
                    // disableApp={this.props.disableApp}
                    // livechat={<LiveChat is_mobile_drawer />}
                    title={'Menu'}
                    height='100wh'
                    width='300px'
                >
                    <div style={{ borderWidth: 1, borderColor: 'black', borderStyle: 'solid' }}>
                        <div style={{ visibility: is_submenu_expanded ? 'hidden' : 'visible' }}>
                            <MobileDrawer.SubHeader>
                                <p style={{ borderWidth: 1, borderColor: 'black', borderStyle: 'solid' }}>
                                    This is SubHeader
                                </p>
                            </MobileDrawer.SubHeader>
                        </div>

                        <div style={{ borderWidth: 1, overflow: 'hidden', borderColor: 'black', borderStyle: 'solid' }}>
                            <MobileDrawer.Body>
                                {Array.from(new Array(5)).map((item, index) => {
                                    return (
                                        <MobileDrawer.Item key={index}>
                                            <p
                                                onClick={() => {
                                                    console.log(`item ${index} clicked`);
                                                }}
                                            >
                                                Item {index}
                                            </p>
                                        </MobileDrawer.Item>
                                    );
                                })}
                                <MobileDrawer.SubMenu
                                    has_subheader
                                    submenu_icon={'IcHamburger'}
                                    submenu_title={'Submenu title'}
                                    submenu_suffix_icon='IcChevronRight'
                                    onToggle={toggleSubMenu}
                                >
                                    {/* <MobileDrawer.Item>
                                        <p onClick={() => { console.log(`item ${'mmm'} clicked`); }}>Itemmmm</p>
                                    </MobileDrawer.Item> */}
                                    <MobileDrawer.SubMenuSection
                                        section_icon={'IcChevronDown'}
                                        section_title={'SubmenuSection title'}
                                    >
                                        <p
                                            onClick={() => {
                                                console.log('sub section clicked');
                                            }}
                                        >
                                            SubmenuSection Item
                                        </p>
                                    </MobileDrawer.SubMenuSection>
                                </MobileDrawer.SubMenu>
                            </MobileDrawer.Body>
                        </div>

                        <MobileDrawer.Footer>
                            <p>this is footer</p>
                        </MobileDrawer.Footer>
                    </div>
                </MobileDrawer>
            </>
        );
    },
    {
        notes,
    }
);
