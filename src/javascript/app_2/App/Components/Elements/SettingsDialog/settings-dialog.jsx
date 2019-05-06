import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import ReactDOM           from 'react-dom';
import { localize }       from '_common/localize';
import VerticalTab        from 'App/Components/Elements/VerticalTabs';
import {
    ChartSettings,
    LanguageSettings,
    ThemeSelectSettings,
    // PurchaseSettings,
}                         from 'App/Containers/SettingsDialog';
import {
    IconCharts,
    IconClose,
    IconLanguage,
    // IconPurchase,
    IconTheme,
}                         from 'Assets/Settings';

class SettingsDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.state = {
            modal_root: document.getElementById('modal_root'),
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.el.classList.add('settings-dialog');
        this.props.showFullBlur();
        this.state.modal_root.appendChild(this.el);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.state.modal_root.removeChild(this.el);
        this.props.hideFullBlur();
    }

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open) {
            this.props.hideFullBlur();
            this.props.toggleDialog();
        }
    };

    render() {
        const settings_dialog_container_class = classNames('settings-dialog__container', {
            'settings-dialog__container--hide': this.props.is_language_dialog_visible,
        });
        return ReactDOM.createPortal(
            <div ref={this.setWrapperRef} className={settings_dialog_container_class}>
                <div className='dialog-header'>
                    <h3 className='dialog-header__sidebar'>{localize('Platform settings')}</h3>
                    <div className='dialog-header__main'>
                        <div className='dialog-header__close' onClick={this.props.toggleDialog}>
                            <IconClose />
                        </div>
                    </div>
                </div>
                <VerticalTab
                    alignment='center'
                    classNameHeader='settings-dialog__tab-header'
                    list={this.settings_content()}
                />
            </div>,
            this.el
        );
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    settings_content = () => [
        {
            icon : IconTheme,
            label: localize('Themes'),
            value: ThemeSelectSettings,
        }, {
            icon : IconLanguage,
            label: localize('Language'),
            value: LanguageSettings,
        }, {
            icon : IconCharts,
            label: localize('Charts'),
            value: ChartSettings,
        // uncomment below lines to bring back purchase lock and purchase confirmation
        // }, {
        //     icon : IconPurchase,
        //     label: localize('Purchase'),
        //     value: PurchaseSettings,
        },
    ]
}

SettingsDialog.propTypes = {
    hideFullBlur              : PropTypes.func,
    is_dark_mode              : PropTypes.bool,
    is_language_dialog_visible: PropTypes.bool,
    is_open                   : PropTypes.bool,
    showFullBlur              : PropTypes.func,
    toggleDialog              : PropTypes.func,
};

export { SettingsDialog };
