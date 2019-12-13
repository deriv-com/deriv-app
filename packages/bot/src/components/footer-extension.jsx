import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { localize }   from 'deriv-translations';
import { tabs_title } from '../constants/bot-contents';
import { connect }    from '../stores/connect';
import '../assets/sass/footer-extensions.scss';

class FooterExtension extends React.Component {
    populateFooter = () => {
        const {
            active_tab,
            setActiveTab,
            populateFooterExtensions,
        } = this.props;

        const footer_items = (
            <div className='footer_extensions'>
                <span
                    key={tabs_title.WORKSPACE}
                    className={classNames('footer_extensions__button',
                        { 'footer_extensions__button--active': active_tab === tabs_title.WORKSPACE })}
                    onClick={() => setActiveTab(tabs_title.WORKSPACE)}
                >
                    {localize(tabs_title.WORKSPACE)}
                </span>
                <span
                    key={tabs_title.CHART}
                    className={classNames('footer_extensions__button',
                        { 'footer_extensions__button--active': active_tab === tabs_title.CHART })}
                    onClick={() => setActiveTab(tabs_title.CHART)}
                >
                    {localize(tabs_title.CHART)}
                </span>
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
    active_tab              : PropTypes.string,
    populateFooterExtensions: PropTypes.func,
    setActiveTab            : PropTypes.func,
};

export default connect(
    ({ ui, main_content }) => ({
        active_tab              : main_content.active_tab,
        populateFooterExtensions: ui.populateFooterExtensions,
        setActiveTab            : main_content.setActiveTab,
    })
)(FooterExtension);
