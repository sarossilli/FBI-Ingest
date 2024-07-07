import cdk = require('aws-cdk-lib');
import { IngestionStack } from './lib/IngestionStack';

const app = new cdk.App();
new IngestionStack(app, 'LambdaIngestionExample');
app.synth();