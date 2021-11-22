import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PlatformSwitcher from '../platform-switcher';
import { BrowserRouter } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

configure({ adapter: new Adapter() });

describe('PlatformSwitcher', () => {

    const props = {
        app_routing_history: [{ pathname: 'test' }],
        platform_config: [],
        toggleDrawer: () => {},
    };

    const wrapper = shallow(
        <BrowserRouter>
            <PlatformSwitcher {...props} />
        </BrowserRouter>
    )
        .dive()
        .dive()
        .dive()
        .dive()
        .dive()
        .dive();
    
    it('should render one <PlatformSwitcher /> component', () => {
        expect(wrapper).to.have.length(1);
    });

    it('should have .platform-switcher__preloader and have not .platform-switcher if app_routing_history is an empty array', () => {
        const wrapper = shallow(
            <BrowserRouter>
                <PlatformSwitcher app_routing_history={[]} />
            </BrowserRouter>
        )
            .dive()
            .dive()
            .dive()
            .dive()
            .dive()
            .dive();
            
        expect(wrapper.find('.platform-switcher__preloader').exists()).to.be.true;
        expect(wrapper.find('.platform-switcher').exists()).to.be.false;
    });

    it('should not have .platform-switcher__preloader and have .platform-switcher if app_routing_history is not an empty array', () => {
        expect(wrapper.find('.platform-switcher__preloader').exists()).to.be.false;
        expect(wrapper.find('.platform-switcher').exists()).to.be.true;
    });

    it('should contain <CSSTransition /> if app_routing_history is not an empty array', () => {
        expect(
            wrapper.contains(
                <CSSTransition
                    mountOnEnter
                    appear
                    in={true}
                    classNames={{
                        enterDone: 'platform-dropdown--enter-done',
                    }}
                    timeout={250}
                    unmountOnExit
                    children={<p></p>}
                ></CSSTransition>
            )
        );
    });
});
