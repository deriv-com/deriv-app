import { cloneThorough } from '@deriv/shared';
import JSInterpreter from '@deriv/js-interpreter';
import getInterface from '../Interface';
import { unrecoverable_errors } from '../../../constants/messages';
import { observer as globalObserver } from '../../../utils/observer';
import ws from '../../api/ws';
import { highlightBlock } from '../../../scratch/utils';

JSInterpreter.prototype.takeStateSnapshot = function () {
    const newStateStack = cloneThorough(this.stateStack, undefined, undefined, undefined, true);
    return newStateStack;
};

JSInterpreter.prototype.restoreStateSnapshot = function (snapshot) {
    this.stateStack = cloneThorough(snapshot, undefined, undefined, undefined, true);
    this.global = this.stateStack[0].scope.object || this.stateStack[0].scope;
    this.initFunc_(this, this.global);
};

const botStarted = $scope => $scope.tradeOptions;
const shouldRestartOnError = ($scope, errorName = '') =>
    !unrecoverable_errors.includes(errorName) && $scope.options.shouldRestartOnError;

const shouldStopOnError = (errorName = '') => {
    const stopErrors = ['SellNotAvailableCustom', 'ContractCreationFailure'];
    if (stopErrors.includes(errorName)) {
        return true;
    }
    return false;
};

const timeMachineEnabled = $scope => $scope.options.timeMachineEnabled;

// TODO chek beforState & duringState & startState
const Interpreter = () => {
    const bot_interface = getInterface();
    const $scope = bot_interface.scope;
    bot_interface.tradeEngineObserver();
    bot_interface.highlightBlock = highlightBlock;
    let interpreter = {};
    let onFinish;

    globalObserver.register('REVERT', watchName =>
        revert(watchName === 'before' ? $scope.beforeState : $scope.duringState)
    );

    function revert(state) {
        interpreter.restoreStateSnapshot(state);
        interpreter.paused_ = false;
        loop();
    }

    function loop() {
        if ($scope.stopped || !interpreter.run()) {
            onFinish(interpreter.pseudoToNative(interpreter.value));
        }
    }

    function createAsync(js_interpreter, func) {
        const asyncFunc = (...args) => {
            const callback = args.pop();

            // Workaround for unknown number of args
            const reversed_args = args.slice().reverse();
            const first_defined_arg_idx = reversed_args.findIndex(arg => arg !== undefined);

            // Remove extra undefined args from end of the args
            const function_args = first_defined_arg_idx < 0 ? [] : reversed_args.slice(first_defined_arg_idx).reverse();
            // End of workaround

            func(...function_args.map(arg => js_interpreter.pseudoToNative(arg)))
                .then(rv => {
                    callback(js_interpreter.nativeToPseudo(rv));
                    loop();
                })
                .catch(e => {
                    // e.error for errors get from API, e for code errors
                    globalObserver.emit('Error', e.error || e);
                });
        };

        // TODO: This is a workaround, create issue on original repo, once fixed
        // remove this. We don't know how many args are going to be passed, so we
        // assume a max of 100.
        const MAX_ACCEPTABLE_FUNC_ARGS = 100;
        Object.defineProperty(asyncFunc, 'length', { value: MAX_ACCEPTABLE_FUNC_ARGS + 1 });
        return js_interpreter.createAsyncFunction(asyncFunc);
    }

    function initFunc(js_interpreter, scope) {
        const { getTicksInterface, alert, prompt, sleep, console: custom_console } = bot_interface;
        const ticks_interface = getTicksInterface;

        js_interpreter.setProperty(scope, 'console', js_interpreter.nativeToPseudo(custom_console));
        js_interpreter.setProperty(scope, 'alert', js_interpreter.nativeToPseudo(alert));
        js_interpreter.setProperty(scope, 'prompt', js_interpreter.nativeToPseudo(prompt));
        js_interpreter.setProperty(
            scope,
            'getPurchaseReference',
            js_interpreter.nativeToPseudo(bot_interface.getPurchaseReference)
        );

        const pseudo_bot_interface = js_interpreter.nativeToPseudo(bot_interface);

        Object.entries(ticks_interface).forEach(([name, f]) =>
            js_interpreter.setProperty(pseudo_bot_interface, name, createAsync(js_interpreter, f))
        );

        js_interpreter.setProperty(
            pseudo_bot_interface,
            'start',
            js_interpreter.nativeToPseudo((...args) => {
                const { start } = bot_interface;
                if (shouldRestartOnError($scope)) {
                    $scope.startState = js_interpreter.takeStateSnapshot();
                }
                start(...args);
            })
        );

        js_interpreter.setProperty(
            pseudo_bot_interface,
            'purchase',
            createAsync(js_interpreter, bot_interface.purchase)
        );
        js_interpreter.setProperty(
            pseudo_bot_interface,
            'sellAtMarket',
            createAsync(js_interpreter, bot_interface.sellAtMarket)
        );
        js_interpreter.setProperty(scope, 'Bot', pseudo_bot_interface);
        js_interpreter.setProperty(
            scope,
            'watch',
            createAsync(js_interpreter, watchName => {
                const { watch } = getInterface();

                if (timeMachineEnabled($scope)) {
                    const snapshot = interpreter.takeStateSnapshot();
                    if (watchName === 'before') {
                        $scope.beforeState = snapshot;
                    } else {
                        $scope.duringState = snapshot;
                    }
                }

                return watch(watchName);
            })
        );

        js_interpreter.setProperty(scope, 'sleep', createAsync(js_interpreter, sleep));
    }

    function stop() {
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];
        const is_timeouts_cancellable = Object.keys(global_timeouts).every(
            timeout => global_timeouts[timeout].is_cancellable
        );

        if (!$scope.contract_id && is_timeouts_cancellable) {
            // When user is rate limited, allow them to stop the bot immediately
            // granted there is no active contract.
            global_timeouts.forEach(timeout => clearTimeout(global_timeouts[timeout]));
            terminateSession();
        } else if ($scope.contract_flags.is_sold === false && !$scope.is_error_triggered) {
            globalObserver.register('contract.status', contractStatus => {
                if (contractStatus.id === 'contract.sold') {
                    terminateSession();
                }
            });
        } else {
            terminateSession();
        }
    }

    function terminateSession() {
        const { connection } = ws;
        if (connection.readyState === 0) {
            connection.addEventListener('open', () => connection.close());
        } else if (connection.readyState === 1) {
            connection.close();
        }

        $scope.stopped = true;
        $scope.is_error_triggered = false;
        globalObserver.emit('bot.stop');
    }

    function run(code) {
        return new Promise((resolve, reject) => {
            const onError = e => {
                if ($scope.stopped) {
                    return;
                }
                // DBot handles 'InvalidToken' internally
                if (e.code === 'InvalidToken') {
                    globalObserver.emit('client.invalid_token');
                    return;
                }
                if (shouldStopOnError(e?.code)) {
                    globalObserver.emit('ui.log.error', e.message);
                    globalObserver.emit('bot.click_stop');
                    return;
                }

                $scope.is_error_triggered = true;
                if (!shouldRestartOnError($scope, e.code) || !botStarted($scope)) {
                    reject(e);
                    return;
                }

                globalObserver.emit('Error', e);
                const { initArgs, tradeOptions } = $scope;

                terminateSession();
                globalObserver.register('Error', onError);
                const { init, start } = bot_interface;
                init(...initArgs);
                start(tradeOptions);
                revert($scope.startState);
            };

            globalObserver.register('Error', onError);
            interpreter = new JSInterpreter(code, initFunc);
            onFinish = resolve;

            loop();
        });
    }

    return { stop, run, terminateSession };
};
export default Interpreter;

export const createInterpreter = () => new Interpreter();
