import * as React from 'react';
import { Modal, ThemedScrollbars } from '@deriv/components';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionArticleContent from './self-exclusion-article-content.jsx';

const SelfExclusionModal = () => {
    const { state, toggleArticle } = React.useContext(SelfExclusionContext);

    return (
        <Modal className='self_exclusion__article-modal' is_open={state.show_article} toggleModal={toggleArticle}>
            <ThemedScrollbars>
                <SelfExclusionArticleContent toggleModal={toggleArticle} />
            </ThemedScrollbars>
        </Modal>
    );
};

export default SelfExclusionModal;
