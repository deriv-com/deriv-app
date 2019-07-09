import { expect }         from 'chai';
import React              from 'react';
import ShallowRenderer    from 'react-test-renderer/shallow';
import { Modal }          from '../modal.jsx';

describe('Modal', () => {
    it('should render one <Modal /> component', () => {
        const renderer = new ShallowRenderer();
        renderer.render(<Modal />);
        const result = renderer.getRenderOutput();
        expect(result.children.props.className).to.be.equal('modal__container');
    });
});
