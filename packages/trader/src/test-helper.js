import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

export const testChildren = component => {
    const child_div = <div className='sweet-child-of-mine' />;
    const wrapper = shallow(React.cloneElement(component, {}, child_div));
    expect(wrapper.contains(child_div)).to.equal(true);
};
