const ImageUploader = require('./lib/image-uploader');
const StepFunctions = require('./lib/step-functions');
const ThumbnailGenerator = require('./lib/thumbnail-generator');
const Moderator = require('./lib/moderator');
const Notifier = require('./lib/notifier');

module.exports.upload = (event, context, callback) => {
    let imageUploader = new ImageUploader();
    imageUploader.perform(event, callback);
};

module.exports.startExecution = (event, context, callback) => {
    let stepFunctions = new StepFunctions();
    stepFunctions.startExecution(event, callback);
};

module.exports.generateThumbnail = (event, context, callback) => {
    let thumbnailGenerator = new ThumbnailGenerator();
    thumbnailGenerator.generate(event, callback);
};

module.exports.moderate = (event, context, callback) => {
    let moderator = new Moderator();
    moderator.moderate(event, callback);
};

module.exports.notify = (event, context, callback) => {
    let notifier = new Notifier();
    notifier.notify(event, callback);
};
