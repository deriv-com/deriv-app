import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Notification from '../notification.jsx';

configure({ adapter: new Adapter() });

describe('Notification', () => {
    it('should render one <Notification /> component', () => {
        const wrapper = shallow(<Notification />);
        expect(wrapper).to.have.length(1);
    });
});
