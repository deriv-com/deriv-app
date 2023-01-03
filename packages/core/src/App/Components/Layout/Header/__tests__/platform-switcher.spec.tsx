// TODO refactor old tests in this component
import React from 'react';
import { TestedPlatformSwitcher } from '../platform-switcher';
import { CSSTransition } from 'react-transition-group';

// configure({ adapter: new Adapter() });

describe('TestedPlatformSwitcher', () => {
    // const props = {
    //     app_routing_history: [{ pathname: 'test' }],
    //     platform_config: [],
    //     toggleDrawer: () => {},
    // };

    // const wrapper = shallow(<TestedPlatformSwitcher {...props} />);

    it('should render one <TestedPlatformSwitcher /> component', () => {
        // expect(wrapper).toHaveLength(1);
        // console.log(wrapper.debug());
    });

    // it('should have .platform-switcher__preloader and have not .platform-switcher if app_routing_history is an empty array', () => {
    //     const wrapper = shallow(<TestedPlatformSwitcher app_routing_history={[]} />);
    //     expect(wrapper.find('.platform-switcher__preloader').exists()).toBe(true);
    //     expect(wrapper.find('.platform-switcher').exists()).toBe(false);
    // });

    // it('should not have .platform-switcher__preloader and have .platform-switcher if app_routing_history is not an empty array', () => {
    //     expect(wrapper.find('.platform-switcher__preloader').exists()).toBe(false);
    //     expect(wrapper.find('.platform-switcher').exists()).toBe(true);
    // });

    // it('should contain <CSSTransition /> if app_routing_history is not an empty array', () => {
    //     expect(
    //         wrapper.contains(
    //             <CSSTransition
    //                 mountOnEnter
    //                 appear
    //                 in={true}
    //                 classNames={{
    //                     enterDone: 'platform-dropdown--enter-done',
    //                 }}
    //                 timeout={250}
    //                 unmountOnExit
    //                 children={<p></p>}
    //             ></CSSTransition>
    //         )
    //     );
    // });
});
