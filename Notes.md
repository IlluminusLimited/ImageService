1. Getting images from the s3 bucket works publicly, but only if accessed via the s3 static site 

ex: http://pinster-image-service-dev.s3-website-us-east-1.amazonaws.com/raw/926dc1235cb657e5c9d0e7dcfab84d78

When using the public site, if the image doesn't exist, it redirects to the execute-api and prefixes the key:
ex: https://image-service.api-${self:provider.stage}.pinster.info/images/generate?key=raw/926dc1235cb657e5c9d0e7dcfab84d78_400x400