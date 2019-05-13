const ImageUploader = require('./lib/image-uploader');
const StepFunctions = require('./lib/step-functions');
const Moderator = require('./lib/moderator');
const Notifier = require('./lib/notifier');
const ThumbnailGenerator = require('./lib/thumbnail-generator');
const ImageMover = require('./lib/image-mover');

module.exports.upload = async (event) => {
    const imageUploader = new ImageUploader();
    return await imageUploader.perform(event)
        .then(saveObjectResponse => {
            console.debug('Successful response: ', saveObjectResponse);
            return saveObjectResponse.generateResponse();
        })
        .catch(err => {
            console.error('Error processing: ', err);
            return err.generateResponse();
        });
};

module.exports.startExecution = (event, context, callback) => {
    const stepFunctions = new StepFunctions();
    return stepFunctions.perform(event, callback);
};

module.exports.generateThumbnail = (event, context, callback) => {
    const thumbnailGenerator = new ThumbnailGenerator();
    return thumbnailGenerator.generate(event, callback);
};

module.exports.moderate = (event, context, callback) => {
    const moderator = new Moderator();
    return moderator.moderate(event, callback);
};

module.exports.notifySuccess = async (event) => {
    const notifier = new Notifier();
    return await notifier.notifySuccess(event)
        .then(imageCreateResponse => {
            console.debug('Successful response: ', imageCreateResponse);
            return imageCreateResponse.generateResponse();
        }).catch(err => {
            console.error('Error processing: ', err);
            return err.generateResponse();
        });
};

module.exports.notifyFailure = async (event) => {
    const notifier = new Notifier();
    return await notifier.notifyFailure(event)
        .then(publishEvent => {
            console.debug('Successful response: ', publishEvent);
            return publishEvent.generateResponse();
        }).catch(err => {
            console.error('Error processing: ', err);
            return err.generateResponse();
        });

};

module.exports.moveImage = (event, context, callback) => {
    const imageMover = new ImageMover();
    return imageMover.moveImage(event, callback);
};