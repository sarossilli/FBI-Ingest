import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

export class IngestionLambda extends Construct {
  public labmda: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.labmda = new lambda.Function(this, 'IngestionPythonScript', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_9.bundlingImage, // Changed to match the runtime
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
          ],
        },
      }),
      handler: 'ingestion-handler.handler', // Ensure this matches your Python file
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.PYTHON_3_9,
    });

    // Run 0:00 PM UTC every day
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('cron(0 0 ? * * *)')
    });

    rule.addTarget(new targets.LambdaFunction(this.labmda));
  }
}
