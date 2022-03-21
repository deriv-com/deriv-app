import React from 'react';
import { render, screen } from '@testing-library/react';
import SelfExclusionModal from '../self-exclusion-modal';
import SelfExclusionContext from '../self-exclusion-context';

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal_root');
document.body.appendChild(modalRoot);

jest.mock('../self-exclusion-article-content', () => () => <div>SelfExclusionArticleContent</div>);

describe('<SelfExclusionModal />', () => {
    
    it('should be shown on the page', () => {

        render(
            <SelfExclusionContext.Provider value={{ state: { show_article: true }, toggleArticle: () => {} }}>
                <SelfExclusionModal />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionArticleContent')).toBeInTheDocument();
    });
});
