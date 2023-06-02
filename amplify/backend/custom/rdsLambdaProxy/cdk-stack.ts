import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
//import * as iam from 'aws-cdk-lib/aws-iam';
//import * as sns from 'aws-cdk-lib/aws-sns';
//import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
//import * as sqs from 'aws-cdk-lib/aws-sqs';

import { Duration, RemovalPolicy, aws_ec2 as ec2, aws_rds as rds, aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'path';
// import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha';
// import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });
    /* AWS CDK code goes here - learn more: https://docs.aws.amazon.com/cdk/latest/guide/home.html */
    
    // Example 1: Set up an SQS queue with an SNS topic 

    /*
    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();
    const sqsQueueResourceNamePrefix = `sqs-queue-${amplifyProjectInfo.projectName}`;
    const queue = new sqs.Queue(this, 'sqs-queue', {
      queueName: `${sqsQueueResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    // 👇create sns topic
    
    const snsTopicResourceNamePrefix = `sns-topic-${amplifyProjectInfo.projectName}`;
    const topic = new sns.Topic(this, 'sns-topic', {
      topicName: `${snsTopicResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    // 👇 subscribe queue to topic
    topic.addSubscription(new subs.SqsSubscription(queue));
    new cdk.CfnOutput(this, 'snsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    });
    */

    // Example 2: Adding IAM role to the custom stack 
    /*
    const roleResourceNamePrefix = `CustomRole-${amplifyProjectInfo.projectName}`;
    
    const role = new iam.Role(this, 'CustomRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      roleName: `${roleResourceNamePrefix}-${cdk.Fn.ref('env')}`
    }); 
    */

    // Example 3: Adding policy to the IAM role
    /*
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['*'],
        resources: [topic.topicArn],
      }),
    );
    */

    // Access other Amplify Resources 
    /*
    const retVal:AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this, 
      amplifyResourceProps.category, 
      amplifyResourceProps.resourceName, 
      [
        {category: <insert-amplify-category>, resourceName: <insert-amplify-resourcename>},
      ]
    );
    */

    // Access other Amplify Resources 
    const dependencies:AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this, 
      amplifyResourceProps.category, 
      amplifyResourceProps.resourceName, 
      [
        {category: "function", resourceName: "populateLambda"},
      ]
    );

    const vpc = new cdk.aws_ec2.Vpc(this, "RdsProxyExampleVpc", {
      subnetConfiguration: [
        {
          name: 'Isolated',
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          name: 'Public',
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        }
      ]
    });

    const dbUsername = 'syscdk';
    const rdsSecret = new secretsmanager.Secret(this, 'RdsProxyExampleSecret', {
      secretName: id+'-rds-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: dbUsername }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      }
    });

    // Create a security group to be used on the lambda functions
    const lambdaSecurityGroup = new cdk.aws_ec2.SecurityGroup(this, 'Lambda Security Group', {
      vpc
    });

    // Create a security group to be used on the RDS proxy
    const rdsProxySecurityGroup = new cdk.aws_ec2.SecurityGroup(this, 'Only Allow Access From Lambda', {
      vpc
    });
    rdsProxySecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(5432), 'allow lambda connection to rds proxy');

    // Create a security group to be used on the RDS instances
    const rdsSecurityGroup = new cdk.aws_ec2.SecurityGroup(this, 'Only Allow Access From RDS Proxy', {
      vpc
    });
    rdsSecurityGroup.addIngressRule(rdsProxySecurityGroup, cdk.aws_ec2.Port.tcp(5432), 'allow db connections from the rds proxy');
    
    const rdsCredentials = rds.Credentials.fromSecret(rdsSecret);

    const dbName = 'demoDB';
    const postgreSql = new rds.DatabaseCluster(this, 'RdsProxyExampleCluster', {
      instanceProps:
      {
        vpc,
        vpcSubnets: {
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED
        },
        instanceType: cdk.aws_ec2.InstanceType.of(cdk.aws_ec2.InstanceClass.T3, cdk.aws_ec2.InstanceSize.MEDIUM),
        securityGroups: [ rdsSecurityGroup ]
      },
      clusterIdentifier: 'RDSProxyExampleCluster',
      engine: cdk.aws_rds.DatabaseClusterEngine.auroraPostgres({
        version: cdk.aws_rds.AuroraPostgresEngineVersion.VER_14_6
      }),
      instances: 1,
      backup: { retention: Duration.days(1) },
      removalPolicy: RemovalPolicy.DESTROY,
      credentials: rdsCredentials,
      defaultDatabaseName: dbName,
    });

    const rdsProxy = postgreSql.addProxy('rdsProxyExample', {
      secrets: [ rdsSecret ],
      securityGroups: [ rdsProxySecurityGroup ],
      debugLogging: true,
      iamAuth: true,
      vpc
    });


    const rdsProxyPopulateLambda: NodejsFunction = new NodejsFunction(this, id+'-populateLambda', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/populate.ts'),
      vpc: vpc,
      vpcSubnets: { subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [ lambdaSecurityGroup ],
      environment: {
        PGHOST: rdsProxy.endpoint,
        PGDATABASE: dbName,
        PGUSER: dbUsername
      },
      // Bundler removes these dependencies since they aren't imported explicitly
      // Include them so sequelize can connect to Postgres
      bundling: {
        nodeModules: [ 'pg', 'pg-hstore' ]
      }
    });

    const rdsProxyGetDataLambda: NodejsFunction = new NodejsFunction(this, id+'-getDataLambda', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/getData.ts'),
      vpc: vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [ lambdaSecurityGroup ],
      environment: {
        PGHOST: rdsProxy.endpoint,
        PGDATABASE: dbName,
        PGUSER: dbUsername
      },
      // Bundler removes these dependencies since they aren't imported explicitly
      // Include them so sequelize can connect to Postgres
      bundling: {
        nodeModules: [ 'pg', 'pg-hstore' ]
      }
    });

    const populateFnUrl = rdsProxyPopulateLambda.addFunctionUrl()
    const getFnUrl = rdsProxyGetDataLambda.addFunctionUrl()

    rdsProxy.grantConnect(rdsProxyPopulateLambda, dbUsername);
    rdsProxy.grantConnect(rdsProxyGetDataLambda, dbUsername);

    new cdk.CfnOutput(this, 'populateEndpointUrl', {
      value: populateFnUrl.url,
      exportName: 'populateEndpointUrl'
    });
    new cdk.CfnOutput(this, 'populateEndpointUrl', {
      value: getFnUrl.url,
      exportName: 'getEndpointUrl'
    });
    // const httpApi: apigw.HttpApi = new apigw.HttpApi(this, 'HttpApi');

    // const populateLambdaIntegration = new HttpLambdaIntegration('rdsProxyPopulateLambda', rdsProxyPopulateLambda );

    // const getDataLambdaIntegration = new HttpLambdaIntegration('rdsProxyGetDataLambda', rdsProxyGetDataLambda);

    // httpApi.addRoutes({
    //   path: '/populate',
    //   methods: [apigw.HttpMethod.POST],
    //   integration: populateLambdaIntegration
    // });

    // new CfnOutput(this, 'populateEndpointUrl', {
    //   value: `${httpApi.url}populate`,
    //   exportName: 'populateEndpointUrl'
    // });

    // httpApi.addRoutes({
    //   path: '/',
    //   methods: [apigw.HttpMethod.GET],
    //   integration: getDataLambdaIntegration
    // });

    // new CfnOutput(this, 'stadiumsEndpointUrl', {
    //   value: `${httpApi.url}`,
    //   exportName: 'stadiumsEndpointUrl'
    // });
  };

}