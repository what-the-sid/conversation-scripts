const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.CONV_TABLE

class GetChatsController {

  constructor(event){
    this.event = { parameters: event.pathParameters, query:event.queryStringParameters }
  }

  async fetchAll(){
    const params = {
        TableName: tableName,
        FilterExpression:"group_id = :id",
        ExpressionAttributeValues: {
          ":id": this.event.parameters.id,
        },
    };

    const scanResults = [];
    let items;
    do{
        items = await ddb.scan(params).promise().catch(err=>console.log(err))
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey !== "undefined");
    return scanResults.slice((this.event.query.pageNumber-1) * this.event.query.pageSize,
                                this.event.query.pageNumber * this.event.query.pageSize)
  }
}

export default GetChatsController;
