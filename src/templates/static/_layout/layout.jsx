import React from 'react';
import Head from './head.jsx';
import Header from './header.jsx';
import MobileMenu from './mobile_menu.jsx';
import Footer from './footer.jsx';
import InterviewPopup from '../../_common/components/interview_popup.jsx';
import Title from '../../_common/components/title.jsx';
import Elevio from '../../_common/includes/elevio.jsx';
import Gtm from '../../_common/includes/gtm.jsx';

const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER';

const WithLayout = ({ children }) => {
    const className = `${it.current_route || ''}-content`;
    return (
        <div id='content' className={it.current_route ? className : undefined}>
            <div id='page_info' style={{ display: 'none' }}>
                <Title />
                <div id='content_class'>{className}</div>
            </div>
            { it.layout !== 'full_width' ?
                <div className='container'>
                    {children}
                </div> :
                children
            }
        </div>
    );
};

const InnerContent = () => (
    it.layout ?
        <WithLayout> {CONTENT_PLACEHOLDER} </WithLayout>
        : CONTENT_PLACEHOLDER
);

const Layout = () => {
    if (it.is_pjax_request) {
        return <InnerContent />;
    }
    return (
        <React.Fragment>
            <html>
                <Head />
                <body className={it.language} >
                    <Gtm />
                    <div id='msg_notification' className='notice-msg center-text' />
                    <div id='page-wrapper'>
                        <Header />
                        <div id='content-holder'>
                            <MobileMenu />
                            <a href='javascript:;' id='scrollup' />
                            <InnerContent />
                        </div>
                        <Footer />
                    </div>
                    <InterviewPopup /> {/* TODO: remove when UX research is finished */}
                    <Elevio />
                </body>
            </html>
        </React.Fragment>
    );
};

export default Layout;
