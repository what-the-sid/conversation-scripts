```bash
Note: GCP Service account tokens are revoked ones
```
# Conversation Scripts
##### Serverless scripts to handle conversations from CSV and fetch it through APIs
##
[API Documentation](https://documenter.getpostman.com/view/25655079/2s93mBxKZw) from postman can be found here




## API Reference

```http
BASE_URL: https://z20oldsi76.execute-api.us-east-1.amazonaws.com/production
```

#### Get all conversations

```http
  PUT /upload-csv
```

| Query | Type     | Mandatory                |
| :-------- | :------- | :------------------------- |
| `file` | `file` | **Required**|

#### Get all conversations

```http
  GET /conversations?pageNumber=1&pageSize=5
```

| Query | Type     | Mandatory                |
| :-------- | :------- | :------------------------- |
| `pageNumber` | `string` | **Required**|
| `pageSize` | `string` | **Required**|


#### Get all Chats

```http
  GET /conversations/{id}/?pageNumber=1&pageSize=5
```
`id` is the `group_id` from the **Get all conversations** response

| Query | Type     | Mandatory                |
| :-------- | :------- | :------------------------- |
| `pageNumber` | `string` | **Required**|
| `pageSize` | `string` | **Required**|

#### Create New Intent

```http
  POST /create-intents
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `phrases` | `string` | **Required**, Phrases that a user can enter|
| `responses` | `string` | **Required**, Responses to be passed per channel|





## Deployment

To deploy this project run

Make sure you have added `Access key ID` and `Secret access key` and `region` as `us-east-1` using:

```bash
  aws configure
```

The create IAM role must have permissions for

```
 - dynamodb
 - API Gateway
 - S3
 - CloudFormation
 - Lambda
 - Cloudwatch
 - IAM:CreateRole
 ```

Create AWS resources with these commands:

**Create required buckets**
```bash
  aws s3api create-bucket --bucket conversation-csv

  aws s3api create-bucket --bucket serverless-artifacts-siena
```

**Create required dynamodb tables**
```bash
  aws dynamodb create-table --table-name conversation-data --attribute-definitions AttributeName=message_id,AttributeType=S AttributeName=group_id,AttributeType=S --key-schema AttributeName=message_id,KeyType=HASH AttributeName=group_id,KeyType=RANGE --billing-mode PAY_PER_REQUEST

  aws dynamodb create-table --table-name user-data --attribute-definitions AttributeName=group_id,AttributeType=S --key-schema AttributeName=group_id,KeyType=HASH --billing-mode PAY_PER_REQUEST
```

**install dependencies**
```bash
  npm i
  npm i -g serverless
```

**build scripts**
```bash
  npm run build
```

**test scripts**
```bash
  npm run test
```

**deploy scripts**
```bash
  sls deploy -s production -r us-east-1
```


## Run Locally

To run locally, run the following command

```bash
  sls offline
```
