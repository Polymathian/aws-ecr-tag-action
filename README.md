# Docker Tag for AWS ECR action

Uses the AWS ECR API to tag an already-pushed image without pulling it to the actions worker.

This is a third-party action and not maintained by Amazon.

# Inputs

* `registry-id` Optional. The AWS account ID associated with the registry that contains the repository and image. If you do not specify a registry, the default registry is assumed.
* `repository-name` The name of the repository in which to get and put the image.
* `source-image-tag` The existing tag to find the image.
* `target-image-tag` The new tag to add to the image.

# IAM

You should provide credentials using the [Configure AWS Credentials action](https://github.com/aws-actions/configure-aws-credentials).
Alternatively you can directly provide environment variables to this action.

This action requires permission to use [BatchGetImage](https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_BatchGetImage.html) and [PutImage](https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_PutImage.html) APIs on AWS ECR.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:BatchGetImage",
                "ecr:PutImage"
            ],
            "Resource": "arn:aws:ecr:*:<account id>:repository/*"
        }
    ]
}
```
