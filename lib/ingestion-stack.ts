import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { PublicBucket } from "./constructs/PublicBucket";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class IngestionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucketTest = new PublicBucket(this, "test-bucket");
  }
}
