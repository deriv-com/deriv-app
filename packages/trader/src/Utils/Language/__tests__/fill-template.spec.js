import { expect }       from 'chai';
import React            from 'react';
import { fillTemplate } from '../fill-template';

describe('fillTemplate', () => {
    it('works for string without tags', () => {
        expect(fillTemplate('hello world'))
            .to.eql(['hello world']);
    });
    it('works for 1 tag at the start replaced with string', () => {
        expect(fillTemplate('[_1] is no spoon', { '1': 'there' }))
            .to.eql(['there is no spoon']);
    });
    it('works for 1 tag at the start replaced with component', () => {
        const span = <span className='amazing-text'>There</span>;
        expect(fillTemplate('[_1] is no spoon', { '1': span }))
            .to.eql([span, ' is no spoon']);
    });
    it('works for 1 tag in the middle replaced with string', () => {
        expect(fillTemplate('there is [_1] spoon', { '1': 'no' }))
            .to.eql(['there is no spoon']);
    });
    it('works for 1 tag in the middle replaced with component', () => {
        const a = <a>no</a>;
        expect(fillTemplate('there is [_1] spoon', { '1': a }))
            .to.eql(['there is ', a, ' spoon']);
    });
    it('works for 1 tag at the end replaced with string', () => {
        expect(fillTemplate('there is no [_1]', { '1': 'spoon' }))
            .to.eql(['there is no spoon']);
    });
    it('works for 1 tag at the end replaced with component', () => {
        const div = <div className='test' />;
        expect(fillTemplate('there is no [_1]', { '1': div }))
            .to.eql(['there is no ', div]);
    });
    it('works for 2 tags replaced with strings', () => {
        expect(fillTemplate('[_1] think therefore [_1] am', { '1': 'I' }))
            .to.eql(['I think therefore I am']);
    });
    it('works for 2 tags replaced with components', () => {
        const img = <img src='images/avatar.jpg' />;
        expect(fillTemplate('[_1] think therefore [_1] am', { '1': img }))
            .to.eql([img, ' think therefore ', img, ' am']);
    });
    it('works for 1 pair tag replaced with component', () => {
        const Link = ({ children }) => <a className='link'>{ children }</a>;
        const result = fillTemplate('These [_1]violent delights[_2] have violent ends.', { '1_2': <Link /> });
        expect(result)
            .to.have.lengthOf(3)
            .to.eql(['These ', <Link key={result[1].key}>violent delights</Link>, ' have violent ends.']);
    });
    it('works for 2 pair tags replaced with components', () => {
        const Link = ({ children }) => <a className='link'>{ children }</a>;
        const result = fillTemplate('These [_1]violent delights[_2] have [_1]violent ends[_2].', { '1_2': <Link /> });
        expect(result)
            .to.have.lengthOf(5)
            .to.eql(['These ', <Link key={result[1].key}>violent delights</Link>, ' have ', <Link key={result[3].key}>violent ends</Link>, '.']);
    });
    it('works for a mix of tags replaced with strings and components', () => {
        const Link = ({ children }) => <a className='link'>{ children }</a>;
        const result = fillTemplate('Please [_1]log in[_2] or [_3]sign up[_2] to view [_4] page.', { '1_2': <Link />, '3_2': <Link />, '4': 'statement' });
        expect(result)
            .to.have.lengthOf(5)
            .to.eql(['Please ', <Link key={result[1].key}>log in</Link>, ' or ', <Link key={result[3].key}>sign up</Link>, ' to view statement page.']);
    });
});
