import { expect } from 'chai';
import { mount }  from 'enzyme';
import React      from 'react';
import sinon      from 'sinon';
import RadioGroup from '../radio-group.jsx';

describe('<RadioGroup />', () => {
    beforeEach(() => {
        sinon.stub(console, 'error');
    });

    afterEach(() => {
        console.error.restore();
    });

    const valid_items = [
        {
            label: 'Item 1',
            value: false,
        }, {
            label: 'Item 2',
            value: true,
        },

    ];

    const invalid_items = [
        {
            bad: 'info',
        },
    ];

    it('should load radio buttons based on input', () => {
        const wrapper = mount(<RadioGroup
            items={valid_items}
            onToggle={() => (
                {}
            )}
        />);
        expect(wrapper.find('div.radio-group__item')).to.have.length(2);
    });

    it('should throw warning on bad items props', () => {
        const wrapper = mount(<RadioGroup
            items={invalid_items}
            onToggle={() => (
                {}
            )}
        />);
        sinon.assert.called(console.error);
    });

    it('should call onToggle with the proper value', () => {
        const mockedFunction = sinon.stub();
        const wrapper = mount(<RadioGroup
            items={valid_items}
            onToggle={mockedFunction}
        />);
        const firstElement = wrapper.find('div.radio-group__item').first();
        firstElement.props().onClick();
        sinon.assert.called(mockedFunction);
    });
});
