export type AmplifyDependentResourcesAttributes = {
  "api": {
    "magicRestAPI": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "wager": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "WagerAuth": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "CreatedSNSRole": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "wagerMagicAuthentication": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "s3wagerprofiles": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}