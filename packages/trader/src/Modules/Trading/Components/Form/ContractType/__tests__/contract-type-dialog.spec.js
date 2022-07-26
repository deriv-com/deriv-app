import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ContractTypeDialog from '../contract-type-dialog.jsx';

configure({ adapter: new Adapter() });

describe('ContractTypeDialog', () => {
    it('should render one <ContractTypeDialog /> component', () => {
        const wrapper = shallow(<ContractTypeDialog />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(<ContractTypeDialog>{child_div}</ContractTypeDialog>);
        expect(wrapper.contains(child_div)).to.equal(true);
    });
});
