import { cloneThorough } from '@deriv/shared';
import JSInterpreter from 'js-interpreter';
import { createScope } from './cliTools';
import Interface from '../Interface';
import { unrecoverable_errors } from '../../../constants/messages';
import { observer as globalObserver } from '../../../utils/observer';

JSInterpreter.prototype.takeStateSnapshot = function () {
    const newStateStack = cloneThorough(this.stateStack, undefined, undefined, undefined, true);
    return newStateStack;
};

JSInterpreter.prototype.restoreStateSnapshot = function (snapshot) {
    this.stateStack = cloneThorough(snapshot, undefined, undefined, undefined, true);
    this.global = this.stateStack[0].scope.object || this.stateStack[0].scope;
    this.initFunc_(this, this.global);
};

const botInitialized = bot => bot && bot.tradeEngine.options;
const botStarted = bot => botInitialized(bot) && bot.tradeEngine.tradeOptions;
const shouldRestartOnError = (bot, errorName = '') =>
    !unrecoverable_errors.includes(errorName) && botInitialized(bot) && bot.tradeEngine.options.shouldRestartOnError;

const shouldStopOnError = (bot, errorName = '') => {
    const stopErrors = ['SellNotAvailableCustom', 'ContractCreationFailure'];
    if (stopErrors.includes(errorName) && botInitialized(bot)) {
        return true;
    }
    return false;
};

const timeMachineEnabled = bot => botInitialized(bot) && bot.tradeEngine.options.timeMachineEnabled;

export default class Interpreter {
    constructor() {
        this.init();
    }

    init() {
        this.$scope = createScope();
        this.bot = new Interface(this.$scope);
        this.stopped = false;
        this.$scope.observer.register('REVERT', watchName =>
            this.revert(watchName === 'before' ? this.beforeState : this.duringState)
        );
    }

    run(code) {
        const initFunc = (interpreter, scope) => {
            const bot_interface = this.bot.getInterface('Bot');
            const ticks_interface = this.bot.getTicksInterface();
            const { alert, prompt, sleep, console: custom_console } = this.bot.getInterface();

            interpreter.setProperty(scope, 'console', interpreter.nativeToPseudo(custom_console));
            interpreter.setProperty(scope, 'alert', interpreter.nativeToPseudo(alert));
            interpreter.setProperty(scope, 'prompt', interpreter.nativeToPseudo(prompt));
            interpreter.setProperty(
                scope,
                'getPurchaseReference',
                interpreter.nativeToPseudo(bot_interface.getPurchaseReference)
            );

            const pseudo_bot_interface = interpreter.nativeToPseudo(bot_interface);

            Object.entries(ticks_interface).forEach(([name, f]) =>
                interpreter.setProperty(pseudo_bot_interface, name, this.createAsync(interpreter, f))
            );

            interpreter.setProperty(
                pseudo_bot_interface,
                'start',
                interpreter.nativeToPseudo((...args) => {
                    const { start } = bot_interface;
                    if (shouldRestartOnError(this.bot)) {
                        this.startState = interpreter.takeStateSnapshot();
                    }
                    start(...args);
                })
            );

            interpreter.setProperty(
                pseudo_bot_interface,
                'purchase',
                this.createAsync(interpreter, bot_interface.purchase)
            );
            interpreter.setProperty(
                pseudo_bot_interface,
                'sellAtMarket',
                this.createAsync(interpreter, bot_interface.sellAtMarket)
            );
            interpreter.setProperty(scope, 'Bot', pseudo_bot_interface);
            interpreter.setProperty(
                scope,
                'watch',
                this.createAsync(interpreter, watchName => {
                    const { watch } = this.bot.getInterface();

                    if (timeMachineEnabled(this.bot)) {
                        const snapshot = this.interpreter.takeStateSnapshot();
                        if (watchName === 'before') {
                            this.beforeState = snapshot;
                        } else {
                            this.duringState = snapshot;
                        }
                    }

                    return watch(watchName);
                })
            );

            interpreter.setProperty(scope, 'sleep', this.createAsync(interpreter, sleep));
        };

        return new Promise((resolve, reject) => {
            const onError = e => {
                if (this.stopped) {
                    return;
                }
                // DBot handles 'InvalidToken' internally
                if (e.code === 'InvalidToken') {
                    globalObserver.emit('client.invalid_token');
                    return;
                }
                if (shouldStopOnError(this.bot, e?.code)) {
                    globalObserver.emit('ui.log.error', e.message);
                    globalObserver.emit('bot.click_stop');
                    return;
                }

                this.is_error_triggered = true;
                if (!shouldRestartOnError(this.bot, e.code) || !botStarted(this.bot)) {
                    reject(e);
                    return;
                }

                globalObserver.emit('Error', e);
                const { initArgs, tradeOptions } = this.bot.tradeEngine;
                this.terminateSession();
                this.init();
                this.$scope.observer.register('Error', onError);
                this.bot.tradeEngine.init(...initArgs);
                this.bot.tradeEngine.start(tradeOptions);
                this.revert(this.startState);
            };

            this.$scope.observer.register('Error', onError);

            this.interpreter = new JSInterpreter(code, initFunc);
            this.onFinish = resolve;

            this.loop();
        });
    }

    loop() {
        if (this.stopped || !this.interpreter.run()) {
            this.onFinish(this.interpreter.pseudoToNative(this.interpreter.value));
        }
    }

    revert(state) {
        this.interpreter.restoreStateSnapshot(state);
        this.interpreter.paused_ = false; // eslint-disable-line no-underscore-dangle
        this.loop();
    }

    terminateSession() {
        const { connection } = this.$scope.api;
        if (connection.readyState === 0) {
            connection.addEventListener('open', () => connection.close());
        } else if (connection.readyState === 1) {
            connection.close();
        }

        this.stopped = true;
        this.is_error_triggered = false;

        globalObserver.emit('bot.stop');
    }

    stop() {
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];
        const is_timeouts_cancellable = Object.keys(global_timeouts).every(
            timeout => global_timeouts[timeout].is_cancellable
        );

        if (!this.bot.tradeEngine.contractId && is_timeouts_cancellable) {
            // When user is rate limited, allow them to stop the bot immediately
            // granted there is no active contract.
            global_timeouts.forEach(timeout => clearTimeout(global_timeouts[timeout]));
            this.terminateSession();
        } else if (this.bot.tradeEngine.isSold === false && !this.is_error_triggered) {
            globalObserver.register('contract.status', contractStatus => {
                if (contractStatus.id === 'contract.sold') {
                    this.terminateSession();
                }
            });
        } else {
            this.terminateSession();
        }
    }

    createAsync(interpreter, func) {
        const asyncFunc = (...args) => {
            const callback = args.pop();

            // Workaround for unknown number of args
            const reversed_args = args.slice().reverse();
            const first_defined_arg_idx = reversed_args.findIndex(arg => arg !== undefined);

            // Remove extra undefined args from end of the args
            const function_args = first_defined_arg_idx < 0 ? [] : reversed_args.slice(first_defined_arg_idx).reverse();
            // End of workaround

            func(...function_args.map(arg => interpreter.pseudoToNative(arg)))
                .then(rv => {
                    callback(interpreter.nativeToPseudo(rv));
                    this.loop();
                })
                .catch(e => {
                    // e.error for errors get from API, e for code errors
                    this.$scope.observer.emit('Error', e.error || e);
                });
        };

        // TODO: This is a workaround, create issue on original repo, once fixed
        // remove this. We don't know how many args are going to be passed, so we
        // assume a max of 100.
        const MAX_ACCEPTABLE_FUNC_ARGS = 100;
        Object.defineProperty(asyncFunc, 'length', { value: MAX_ACCEPTABLE_FUNC_ARGS + 1 });
        return interpreter.createAsyncFunction(asyncFunc);
    }

    hasStarted() {
        return !this.stopped;
    }
}

export const createInterpreter = () => new Interpreter();
