# Pinster - ImageService


## Testing
To run the tests, make sure you have deployed to dev and

## Deploying

Since serverless framework doesn't support programmatic changing of yaml keys with their templating
engine, I wrote a [script](serverless.rb) to handle this for me. It is rudimentary but effective.

The downside of this is that `serverless.yml` cannot be saved in the project and must be generated from
 `serverless_template.yml`

### Credits:

* Foo Bar videos: 
  * [AWS Step Functions](https://www.youtube.com/watch?v=9MKL5Jr2zZ4&list=PLGyRwGktEFqd_YBnm5Zxzw9GP1OnEFO_U)
  * [S3 in AWS Lambda](https://www.youtube.com/watch?v=Lnv9QCRGiMs&list=PLGyRwGktEFqcU7hnjdB08zpBasQcBcz82)
  
* Serverless blog: [Step functions with Serverless Framework](https://serverless.com/blog/how-to-manage-your-aws-step-functions-with-serverless/)

* How to resize images in AWS lambda: [https://github.com/awslabs/serverless-image-resizing](https://github.com/awslabs/serverless-image-resizing)