const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();

const csv = require('csvtojson');
const { v4: uuidv4 } = require('uuid');

const dialogflow = require('@google-cloud/dialogflow');

const sessionClient = new dialogflow.SessionsClient();

const convTableName = process.env.CONV_TABLE
const userTableName = process.env.USER_TABLE

class ProcessController {

  constructor(event){
    this.event = event
    this.projectId = process.env.PROJECTID
    this.sessionId = uuidv4()
  }

  async detectIntent( query ) {

    const sessionPath = sessionClient.projectAgentSessionPath(
      this.projectId,
      this.sessionId
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: 'en',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
  }

  async saveConversation(parsedResponse){
    const params = {
      RequestItems:{
        [convTableName]:parsedResponse
      }
    };
    const putData = await ddb.batchWrite(params).promise().catch(err=>{
      return {error:true}
    });
    if(putData.error){
      return false
    }
    return true
  }

  async saveUser(id,user1,user2){
    const params = {
        TableName: userTableName,
        Key:{
            group_id: id,
        }
    }
    const results = await ddb.get(params).promise().catch(err=>{
      console.log(err)
    })
    if(results.Item){
      return true
    }
    else{
      await ddb.put({
        TableName: userTableName,
          Item: {
            group_id: id,
            user1,
            user2
          },
        }).promise().catch(err=>{
          console.log(err)
        });
      return true
    }
  }

  async extractFileFromS3(){
    const bucketName = this.event.Records[0].s3.bucket.name
    const key = this.event.Records[0].s3.object.key

    const options = {
      Bucket: bucketName,
      Key: key
    }

    const stream = s3.getObject(options).createReadStream();
    const itm = await csv().fromStream(stream);
    return itm
  }

  async encryptGroupId(sender,reciever){
    let buffer = ""
    let user1 = sender
    let user2 = reciever
    if(sender<reciever){
      buffer = Buffer.from(`${sender}/${reciever}`).toString('base64')
    }
    else{
      user1 = reciever
      user2 = sender
      buffer = Buffer.from(`${reciever}/${sender}`).toString('base64')
    }
    await this.saveUser(buffer,user1,user2)
    return buffer
  }

  async createAndStoreResponses(){
    try{
      const data = await this.extractFileFromS3()
      const responses = []
      for(let i of data){
        try{
          const intentResponse = await this.detectIntent(i.message)
          const parsedResponse = {
            message_id: uuidv4(),
            group_id: await this.encryptGroupId(i.sender_username,i.reciever_username),
            sender_username: i.sender_username,
            reciever_username: i.reciever_username,
            message: i.message
          }
          const response = intentResponse.queryResult.fulfillmentMessages[0].payload.fields
          parsedResponse.response = response[i.channel].stringValue
          // Object.keys(response).forEach((item) => {
          //   parsedResponse[item] = response[item].stringValue
          // });
          responses.push({
            PutRequest:{
              Item: parsedResponse
            }
          })
        }
        catch(err){
          console.log(err)
          continue
        }
      }

      const saving = await this.saveConversation(responses)
      if(!saving){
        return {
          error:true,
          message:"Couldn't generate and store responses"
        }
      }
      return {
        error:false,
        message:"Succefully generated and stored responses"
      }
    }

    catch(err){
      console.log(err)
      return {
        error:true,
        message:"Couldn't generate and store responses"
      }
    }

  }
}

export default ProcessController;
