export class ModerationThresholdExceeded extends Error {
    constructor(message) {
        super(message);
        this.name = "ModerationThresholdExceeded";
    }
}
