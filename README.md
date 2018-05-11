[![CircleCI](https://circleci.com/gh/PinsterTeam/ImageService.svg?style=shield)](https://circleci.com/gh/PinsterTeam/ImageService)

# Pinster - ImageService


## Design

Pinster's image handling service operates using several AWS technologies:
* Lambda
* StepFunction
* APIGateway
* S3
* Rekognition
* CloudFormation
* CloudWatch

The basic flow of the service is as follows:
1. Client POSTs image to the image uploading api (probably `images.api.pinster.io/v1/upload`)
    1. The POST body is validated against the expected structure:
                        
        ```
        {
          "data": {
            "metadata": {
              "user_id":"the user's uuid",
              "year": "2018"
            },
            "image": "a base64 encoded image"
          }
        }
        ```

    1. The image is saved to s3 with accompanying metadata under a key that is the md5 of the image itself.
1. S3 fires an event which kicks off a lambda that starts the step function to handle the new file
    1. The first step of the step function is to validate that the image is safe for work
       1. If the image is nsfw then the step function will call a lambda that will post to PinsterBase 
        that a user's image upload was flagged
    1. The validated image event is passed to the generateThumbnail function which will generate thumbnails 
    of preconfigured sizes into the s3 bucket
    1. PinsterBase is notified of the new image and accompanying thumbnails.


## Testing
To run the tests, make sure you have deployed to dev and then run `npm test`

## Deploying

### Configuring your environment

#### Runtimes
* Ruby > 2.1 (for deploying)
* Nodejs ~6.10
  * [Serverless](https://serverless.com/framework/docs/getting-started/)

To get all the dependencies run `npm install`

#### Credentials
In order to deploy, you will need to have aws credentials on your local machine.
In whatever aws account you have, make a user by 
[following this guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
and then save those credentials into your `./aws/credentials` file under a profile of either `dev` or `prod`

### Actual Deployment Instructions

Since serverless framework doesn't support programmatic changing of yaml keys with their templating
engine, I wrote a [script](serverless.rb) to handle this for me. It is rudimentary but effective.

To deploy, run `ruby serverless.rb deploy _stage_` where `_stage_` is either `dev` or `prod`
    
* *This could fail if the bucket configured in `serverless_template.yml` already exists elsewhere
as bucket names are global.*

The downside of this is that `serverless.yml` cannot be saved in the project and must be generated from
 `serverless_template.yml`

## Un-deploying

Don't forget to empty the image upload bucket of files before you tear it down, otherwise the removal will fail.
I may add support for this to `serverless.rb` but it will need to be refactored first.

## Credits:

* Foo Bar videos: 
  * [AWS Step Functions](https://www.youtube.com/watch?v=9MKL5Jr2zZ4&list=PLGyRwGktEFqd_YBnm5Zxzw9GP1OnEFO_U)
  * [S3 in AWS Lambda](https://www.youtube.com/watch?v=Lnv9QCRGiMs&list=PLGyRwGktEFqcU7hnjdB08zpBasQcBcz82)
  
* Serverless blog: [Step functions with Serverless Framework](https://serverless.com/blog/how-to-manage-your-aws-step-functions-with-serverless/)

* How to resize images in AWS lambda: [https://github.com/awslabs/serverless-image-resizing](https://github.com/awslabs/serverless-image-resizing)

* [Aws labs examples](https://github.com/awslabs/aws-serverless-workshops/tree/master/ImageProcessing)

