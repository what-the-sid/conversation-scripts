import GetConversationController from './controllers/get-conversations.controller';

const joi = require('joi')

export const handler = async (event,context,callback)=> {
    try {
        const schema = joi.object().keys({
          pageNumber:joi.number().required(),
          pageSize:joi.number().required()
        })
        const { error } = schema.validate(event.queryStringParameters)
        if(error){
          return {
            statusCode: 400,
            body: JSON.stringify(error)
          }
        }
        const convoController = new GetConversationController(event)
        const response = await convoController.fetchAll()
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        }
      }
  catch (err) {
    console.log(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" })
      }
    }
}
