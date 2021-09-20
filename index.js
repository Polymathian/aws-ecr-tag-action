const core = require('@actions/core');
const aws = require('aws-sdk');


async function run() {
  try {
    // Get input
    const registryId = core.getInput("registry-id", {required: false});
    const repositoryName = core.getInput("repository-name", {required: true});
    const sourceImageTag = core.getInput("source-image-tag", {required: true});
    const targetImageTag = core.getInput("target-image-tag", {required: true});

    // Create required resources
    const ecr = new aws.ECR();

    // Fetch image manifest from ECR
    core.info(`Fetching image data for ${repositoryName}:${sourceImageTag}.`);
    const getImageResp = await ecr.batchGetImage({
      registryId,
      repositoryName,
      imageIds: [{imageTag: sourceImageTag}],
    });
    const image = getImageResp.images[0];
    const imageDigest = image.imageId.imageDigest;
    const imageManifest = image.imageManifest;
    const imageManifestMediaType = image.imageManifestMediaType;

    // Put image manifest on ECR with new tag
    core.info(`Putting tag ${repositoryName}:${targetImageTag} on digest ${imageDigest}.`);
    await ecr.putImage({
      registryId,
      repositoryName,
      imageManifest,
      imageManifestMediaType,
      imageTag: targetImageTag,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
