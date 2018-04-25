class Abstract {
    constructor() {
        throw new Error("Cannot instantiate abstract class");
    }
    abstractMethod() {
        throw new Error("Did not overwrite abstract method");
    }
}

class Concrete extends Abstract {
    constructor() {
        this.prop = "blah";
        // Don't call super
    }
}
