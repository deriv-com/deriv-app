// TODO refactor old tests in this component
import React from 'react';
import { NavLink, BrowserRouter } from 'react-router-dom';
import { PlatformContext, routes } from '@deriv/shared';
import { BinaryLink } from '../index';
import RootStore from '../../../../Stores';
import { MobxContentProvider } from '../../../../Stores/connect';

// configure({ adapter: new Adapter() });

describe('<BinaryLink />', () => {
    // const store = new RootStore();
    // const Mock = ({ children }) => (
    //     <MobxContentProvider store={store}>
    //         <BrowserRouter>
    //             <PlatformContext.Provider>{children}</PlatformContext.Provider>
    //         </BrowserRouter>
    //     </MobxContentProvider>
    // );

    it('should render one <BinaryLink /> component', () => {
        // const comp = (
        //     <Mock>
        //         <BinaryLink />
        //     </Mock>
        // );
        // const wrapper = shallow(comp);
        // expect(wrapper).toHaveLength(1);
    });
    // it('should render children when passed in', () => {
    //     const child_div = <div className='sweet-child-of-mine' />;
    //     const comp = (
    //         <Mock>
    //             <BinaryLink>{child_div}</BinaryLink>
    //         </Mock>
    //     );
    //     const wrapper = shallow(comp);
    //     expect(wrapper.contains(child_div)).toBe(true);
    // });
    // it("should render <a /> when property 'to' is not passed", () => {
    //     const comp = (
    //         <Mock>
    //             <BinaryLink />
    //         </Mock>
    //     );
    //     const wrapper = mount(comp);
    //     expect(wrapper.contains(<a />)).toBe(true);
    // });
    // it("should not render <a> when property 'to' is passed", () => {
    //     const comp = (
    //         <MobxContentProvider store={store}>
    //             <BinaryLink to={routes.trade} />
    //         </MobxContentProvider>
    //     );
    //     const wrapper = shallow(comp);
    //     expect(wrapper.contains(<a />)).toBe(false);
    // });
    // it('should render component with props if any given', () => {
    //     const comp = (
    //         <MobxContentProvider store={store}>
    //             <BinaryLink className='a-cool-classname' />
    //         </MobxContentProvider>
    //     );
    //     const wrapper = shallow(comp);
    //     expect(wrapper.find('.a-cool-classname').exists());
    // });
});
