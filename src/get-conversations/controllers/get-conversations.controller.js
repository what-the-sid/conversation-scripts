const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.USER_TABLE

class GetConversationController {

  constructor(event){
    this.event = event.queryStringParameters
  }

  async fetchAll(){
    const params = {
        TableName: tableName,
    };

    const scanResults = [];
    let items;
    do{
        items = await ddb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey !== "undefined");
    return scanResults.slice((this.event.pageNumber-1) * this.event.pageSize,
                                this.event.pageNumber * this.event.pageSize)
  }
}

export default GetConversationController;
