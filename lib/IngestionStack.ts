import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { PublicBucket } from "./constructs/PublicBucket";
import { IngestionLambda } from "./constructs/IngestionLambda";

export class IngestionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const mugshotBucket = new PublicBucket(this, "mugshot-bucket");
    const lambda = new IngestionLambda(this,"test");
  }
}
