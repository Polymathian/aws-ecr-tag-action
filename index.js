const core = require('@actions/core');
const aws = require('aws-sdk');


async function run() {
  try {
    // Get input
    const region = core.getInput("region", {required: true});
    const registryId = core.getInput("registry-id", {required: false});
    const repositoryName = core.getInput("repository-name", {required: true});
    const sourceImageTag = core.getInput("source-image-tag", {required: true});
    const targetImageTag = core.getInput("target-image-tag", {required: true});

    // Create required resources
    const ecr = new aws.ECR({region});

    // Fetch image manifest from ECR
    core.info(`Fetching image data for ${repositoryName}:${sourceImageTag}.`);
    const getImageResp = await ecr.batchGetImage({
      registryId,
      repositoryName,
      imageIds: [{imageTag: sourceImageTag}],
    }).promise();
    const image = getImageResp.images[0];
    const imageDigest = image.imageId.imageDigest;
    const imageManifest = image.imageManifest;
    const imageManifestMediaType = image.imageManifestMediaType;

    // Put image manifest on ECR with new tag
    core.info(`Putting tag ${repositoryName}:${targetImageTag} on digest ${imageDigest}.`);
    try {
      await ecr.putImage({
        registryId,
        repositoryName,
        imageManifest,
        imageManifestMediaType,
        imageTag: targetImageTag,
      }).promise();
    } catch (error) {
      if (error.code === "ImageAlreadyExistsException") {
        core.info(`Digest ${imageDigest} already has tag ${targetImageTag}`)
      } else {
        throw error;
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
