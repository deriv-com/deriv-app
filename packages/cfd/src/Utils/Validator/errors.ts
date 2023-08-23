class Errors {
    private errors: { [key: string]: string[] } = {};

    constructor() {
        this.errors = {};
    }

    add(attribute: string, message: string): void {
        if (!this.has(attribute)) {
            this.errors[attribute] = [];
        }

        if (this.errors[attribute].indexOf(message) === -1) {
            this.errors[attribute].push(message);
        }
    }

    all(): { [key: string]: string[] } {
        return this.errors;
    }

    first(attribute: string): string | null {
        if (this.has(attribute)) {
            return this.errors[attribute][0];
        }
        return null;
    }

    get(attribute: string): string[] {
        if (this.has(attribute)) {
            return this.errors[attribute];
        }

        return [];
    }

    has(attribute: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.errors, attribute);
    }
}

export default Errors;
