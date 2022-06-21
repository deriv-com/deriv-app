import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import Load from "./components/load";
import Save from "./components/save";
import Reset from "./components/reset";
import Modal from "../../components/modal";
import { translate } from "../../../../../common/i18n";
import { setIsBotRunning } from '../../store/ui-slice';
import { observer as globalObserver } from '../../../../../common/utils/observer';
import { isMobile } from "../../../../../common/utils/tools";
import Popover from "../../components/popover/index";
import config from "../../../../../app.config";

const ShowModal = ({ modal, onClose, class_name }) => {
  if (!modal) return;
  const { component: Component, props, title } = modal;
  // eslint-disable-next-line consistent-return
  return (
    <Modal onClose={onClose} title={title} class_name={class_name}>
      <Component {...props} />
    </Modal>
  );
};

const ToolboxButton = ({
  label,
  tooltip,
  classes,
  id_container,
  class_container,
  id,
  onClick,
  position = "bottom",
  is_bot_running,
}) => {
  return (
      <Popover id={id_container} class_container={class_container} content={tooltip} position={position}>
          <button id={id} onClick={onClick} className={classes} disabled={is_bot_running}>
            {label}
          </button>
      </Popover>
  );
};

const ToolBox = ({ blockly }) => {
  const [should_show_modal, setShowModal] = React.useState(false);
  const [selected_modal, updateSelectedModal] = React.useState("");
  const [is_loading_balance, setIsLoadingBalance] = React.useState(true);
  const has_active_token = useSelector(state => !!state.client?.active_token);

  const dispatch = useDispatch();
  const { is_gd_ready, is_bot_running, account_switcher_loader } = useSelector(state => state.ui);
  const { is_gd_logged_in } = useSelector(state => state.client);

  React.useEffect(() => {
    globalObserver.register('bot.running', () => dispatch(setIsBotRunning(true)));
    globalObserver.register('bot.stop', () => dispatch(setIsBotRunning(false)));

    const Keys = Object.freeze({ "zoomIn": 187, "zoomOut": 189 })
    document.body.addEventListener("keydown", (e) => {
      e.preventDefault();
      if (e.which === Keys.zoomOut && e.ctrlKey) {
        // Ctrl + -
        // eslint-disable-next-line no-unused-expressions
        blockly?.zoomOnPlusMinus(false);
        return;
      }
      if (e.which === Keys.zoomIn && e.ctrlKey) {
        // Ctrl + +
        // eslint-disable-next-line no-unused-expressions
        blockly?.zoomOnPlusMinus(true);
      }
    });
  }, []);

  React.useEffect(() => {
    setIsLoadingBalance(true);
    if(!account_switcher_loader){
      setIsLoadingBalance(false);
    }
  });

  const onCloseModal = () => {
    setShowModal(false);
    updateSelectedModal("");
  };
  const onShowModal = (modal) => {
    setShowModal(true);
    updateSelectedModal(modal);
  };
  const MODALS = {
    load: {
      component: Load,
      title: translate("Load Blocks"),
      props: {
        closeDialog: onCloseModal,
        is_gd_logged_in,
      },
    },
    save: {
      component: Save,
      title: translate("Save Blocks"),
      props: {
        closeDialog: onCloseModal,
        is_gd_logged_in,
        blockly,
      },
    },
    reset: {
      component: Reset,
      title: translate("Are you sure?"),
      props: {
        onCloseModal,
        blockly,
      },
    },
  };
  return (
    <div id="toolbox">
      <ToolboxButton 
        id={"resetButton"}
        tooltip={translate("Reset the blocks to their initial state")}
        position="bottom"
        onClick={() => onShowModal("reset")}
        classes={"toolbox-button icon-reset"}
      />
      <ToolboxButton 
        id={"load-xml"}
        tooltip={translate("Load new blocks (xml file)")}
        position="bottom"
        onClick={() => onShowModal("load")}
        classes={"toolbox-button icon-browse"}
      />
      <ToolboxButton 
        id={"save-xml"}
        tooltip={translate("Save the existing blocks (xml file)")}
        position="bottom"
        onClick={() => onShowModal("save")}
        classes={"toolbox-button icon-save"}
      />
      {is_gd_ready && 
        (<ToolboxButton 
          id={"integrations"}
          tooltip={translate("Connect Binary Bot to your Google Drive to easily save and re-use your blocks")}
          position="bottom"
          classes={"toolbox-button icon-integrations"}
        />
      )}

      <span className="toolbox-separator" />
      <ToolboxButton 
        id={"undo"}
        tooltip={translate("Undo the changes (Ctrl+Z)")}
        position="bottom"
        onClick={() => blockly.undo()}
        classes={"toolbox-button icon-undo"}
      />
      <ToolboxButton 
        id={"redo"}
        tooltip={translate("Redo the changes (Ctrl+Shift+Z)")}
        position="bottom"
        onClick={() => blockly.redo()}
        classes={"toolbox-button icon-redo"}
      />

      <span className="toolbox-separator" />
      <ToolboxButton 
        id={"zoomIn"}
        tooltip={translate("Zoom In (Ctrl + +)")}
        position={isMobile() ? "left" : "bottom"}
        onClick={() => blockly.zoomOnPlusMinus(true)}
        classes={"toolbox-button icon-zoom-in"}
      />
      <ToolboxButton 
        id={"zoomOut"}
        tooltip={translate("Zoom Out (Ctrl + -)")}
        position={isMobile() ? "left" : "bottom"}
        onClick={() => blockly.zoomOnPlusMinus(false)}
        classes={"toolbox-button icon-zoom-out"}
      />
      <ToolboxButton 
        id={"rearrange"}
        tooltip={translate("Rearrange Vertically")}
        position={isMobile() ? "left" : "bottom"}
        onClick={() => blockly.cleanUp()}
        classes={"toolbox-button icon-sort"}
      />
      {/* Needs Refactor ClientInfo Structure */}
      <span className={classNames("toolbox-separator",{"toolbox-hide":!has_active_token})} />
      <ToolboxButton 
        id={"showSummary"}
        tooltip={translate("Show/hide the summary pop-up")}
        position={"bottom"}
        classes={classNames("toolbox-button icon-summary",{"toolbox-hide":!has_active_token})}
      />
      <ToolboxButton 
        id_container="runButton"
        tooltip={translate("Run the bot")} 
        position="bottom"
        onClick={() => globalObserver.emit("blockly.start")}
        classes={classNames("toolbox-button icon-run",{"toolbox-hide":!has_active_token || is_loading_balance})}
        is_bot_running={is_bot_running}
      />
      <ToolboxButton 
        id_container="stopButton"
        tooltip={translate("Stop the bot")}  
        position="bottom"
        onClick={()=>{globalObserver.emit("blockly.stop")}}
        classes={classNames("toolbox-button icon-stop",{"toolbox-hide":!has_active_token})}
      />
      <ToolboxButton 
        id={"logButton"}
        class_container={classNames({"toolbox-hide":!has_active_token})}
        tooltip={translate("Show log")} 
        position={"bottom"}
        classes={classNames("toolbox-button icon-info",{"toolbox-hide":!has_active_token})}
      />

      {has_active_token && <span className="toolbox-separator" />}
      {/* Needs resizeable modal */}
      <ToolboxButton 
        id={"chartButton"}
        tooltip={translate("Show chart")}
        position={"bottom"}
        classes={"toolbox-button icon-chart-line"}
      />
      {config.trading_view_chart.url && <ToolboxButton 
        id={"tradingViewButton"}
        tooltip={translate("Show Trading View")}
        position={"bottom"}
        classes={"toolbox-button icon-trading-view"}
      />}
      {should_show_modal && (
        <ShowModal
          modal={MODALS[selected_modal]}
          onClose={onCloseModal}
          class_name={selected_modal}
        />
      )}
    </div>
  );
};

ToolBox.propTypes = {
  blockly: PropTypes.object.isRequired,
};

export default ToolBox;