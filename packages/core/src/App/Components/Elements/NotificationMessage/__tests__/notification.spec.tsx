import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Notification from '../notification.jsx';

configure({ adapter: new Adapter() });

describe('Notification', () => {
    it('should render one <Notification /> component', () => {
        const wrapper = shallow(<Notification />);
        expect(wrapper).to.have.length(1);
    });
});
