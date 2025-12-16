export class EventEmitter {
    constructor() {
        this.callbacks = {};
    }

    on(event, fn) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }

        this.callbacks[event] = [...this.callbacks[event], fn];

        return this;
    }

    emit(event, ...args) {
        const callbacks = this.callbacks[event];

        if (callbacks) {
            callbacks.forEach((callback) => callback.apply(this, args));
        }

        return this;
    }

    off(event, fn) {
        const callbacks = this.callbacks[event];

        if (callbacks) {
            if (fn) {
                this.callbacks[event] = callbacks.filter((callback) => callback !== fn);
            } else {
                delete this.callbacks[event];
            }
        }

        return this;
    }

    destroy() {
        this.callbacks = {};
    }
}
