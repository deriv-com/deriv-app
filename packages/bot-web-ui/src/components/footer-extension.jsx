import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { tabs_title } from '../constants/bot-contents';
import { connect } from '../stores/connect';
import '../assets/sass/footer-extensions.scss';

const getTabText = tab_title => {
    switch (tab_title) {
        case tabs_title.WORKSPACE:
        default:
            return <Localize i18n_default_text='Workspace' />;
        case tabs_title.CHART:
            return <Localize i18n_default_text='Chart' />;
    }
};

class FooterExtension extends React.Component {
    populateFooter = () => {
        const { active_tab, setActiveTab, populateFooterExtensions } = this.props;

        const footer_items = (
            <div className='footer_extensions'>
                {Object.keys(tabs_title).map(key => {
                    const tab_title = tabs_title[key];
                    return (
                        <span
                            key={key}
                            className={classNames('footer_extensions__button', {
                                'footer_extensions__button--active': active_tab === tab_title,
                            })}
                            onClick={() => setActiveTab(tab_title)}
                        >
                            {getTabText(tab_title)}
                        </span>
                    );
                })}
            </div>
        );

        populateFooterExtensions(footer_items);
    };

    componentDidMount() {
        this.populateFooter();
    }

    componentDidUpdate() {
        this.populateFooter();
    }

    componentWillUnmount() {
        this.props.populateFooterExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

FooterExtension.propTypes = {
    active_tab: PropTypes.string,
    populateFooterExtensions: PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(({ ui, main_content }) => ({
    active_tab: main_content.active_tab,
    populateFooterExtensions: ui.populateFooterExtensions,
    setActiveTab: main_content.setActiveTab,
}))(FooterExtension);
