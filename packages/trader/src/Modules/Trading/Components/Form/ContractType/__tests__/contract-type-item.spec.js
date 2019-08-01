import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ContractTypeItem       from '../contract-type-item.jsx';

configure({ adapter: new Adapter() });

describe('ContractTypeItem', () => {
    it('should render one <ContractTypeItem /> component', () => {
        const contracts = [
            { value:'rise_fall', text:'Rise/Fall' },
            { value:'high_low', text:'Higher/Lower' },
        ];
        const wrapper = shallow(<ContractTypeItem contracts={contracts} />);
        expect(wrapper).to.have.length(2);
    });
});
