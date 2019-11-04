import React            from 'react';
import PropTypes        from 'prop-types';
import { localize }     from 'deriv-translations/lib/i18n';
import FlyoutVideo      from './help-components/flyout-video.jsx';
import FlyoutText       from './help-components/flyout-text.jsx';
import FlyoutImage      from './help-components/flyout-img.jsx';
import { config }       from './help-content.config';
import FlyoutBlock      from '../../components/flyout-block.jsx';
import constant         from '../../constants';
import { Arrow2Icon }   from '../../components/Icons.jsx';
import { connect }      from '../../stores/connect';

class HelpBase extends React.PureComponent {
    constructor(props) {
        super(props);
        const { onSequenceClick, block_nodes } = props;

        this.state = {
            onSequenceClick,
            block_nodes,
            help_string     : null,
            has_help_content: true,
        };
    }

    getHelpString = block_nodes => {
        const block_type = block_nodes[0].getAttribute('type');
        const title = Blockly.Blocks[block_type].meta().display_name;

        import(`./help-string/${block_type}.json`)
            .then(help_string => {
                this.setState({ help_string, has_help_content: true });
            })
            .catch(() => this.setState({ has_help_content: false }));

        this.setState({ title, block_type });
    }

    componentDidMount() {
        const { block_nodes } = this.props;
        this.getHelpString(block_nodes);
    }

    componentDidUpdate(prev_state) {
        const { block_nodes } = this.props;

        if (prev_state !== this.props) {
            this.setState({ ...this.props });
            this.getHelpString(block_nodes);
        }
    }

    render() {
        const {
            onSequenceClick,
            block_type,
            title,
            block_nodes,
            help_string,
            has_help_content,
        } = this.state;
        const block_help_component = help_string && config[block_type];
        let text_count = 0;

        return (
            <React.Fragment>
                <div className='flyout__help-header'>
                    <button className='flyout__button flyout__button-back' onClick={() => Blockly.derivWorkspace.reshowFlyout()}>
                        <Arrow2Icon />
                    </button>
                    <span className='flyout__help-title'>{title}</span>
                    <div className='flyout__item-buttons'>
                        <button className='flyout__button flyout__button-add' onClick={() => Blockly.derivWorkspace.addBlockNode(block_nodes[0])}>
                            {localize('Add')}
                        </button>
                    </div>
                </div>
                <div className='flyout__help-content'>
                    {
                        block_help_component &&
                        block_help_component.map((component, index) => {
                            const { type, width, url } = component;
                            const { text } = help_string;

                            switch (type) {
                                case constant.help.TEXT:
                                    return (
                                        <FlyoutText key={`${block_type}_${index}`} text={text[text_count++]} />
                                    );
                                case constant.help.VIDEO:
                                    return (
                                        <FlyoutVideo key={`${block_type}_${index}`} url={url} />
                                    );
                                case constant.help.IMAGE:
                                    return (
                                        <FlyoutImage key={`${block_type}_${index}`} width={width} url={url} />
                                    );
                                case constant.help.BLOCK:
                                {
                                    return (
                                        <FlyoutBlock
                                            key={`${block_type}_${index}`}
                                            should_center_block={true}
                                            block_node={block_nodes[0]}
                                        />
                                    );
                                }
                                default:
                                    return null;
                            }
                        })
                    }
                    {
                        !has_help_content &&
                        <div className='flyout__item'>
                            <h3>Coming soon...</h3>
                        </div>
                    }
                </div>
                <div className='flyout__help-footer'>
                    <button className='flyout__button flyout__button-previous' onClick={() => onSequenceClick(block_type, false)}>{localize('Previous')}</button>
                    <button className='flyout__button flyout__button-next' onClick={() => onSequenceClick(block_type, true)}>{localize('Next')}</button>
                </div>
            </React.Fragment >
        );
    }
}

HelpBase.propTypes = {
    block_nodes    : PropTypes.array,
    onSequenceClick: PropTypes.func,
    title          : PropTypes.string,
};

export default connect(({ flyout }) => ({
    onSequenceClick: flyout.onSequenceClick,
}))(HelpBase);
