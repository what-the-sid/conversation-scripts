import IntentController from './controllers/create-intents.controller';

const joi = require('joi')

export const handler = async (event,context,callback)=> {
    try {
        const schema = joi.object().keys({
          phrases:joi.array().required(),
          responses:joi.object().keys({
            instagram: joi.string().required(),
            facebook: joi.string().required(),
            whatsapp: joi.string().required(),
            email: joi.string().required()
          }).required()
        })
        const { error } = schema.validate(JSON.parse(event.body))
        if(error){
          return {
            statusCode: 400,
            body: JSON.stringify(error)
          }
        }
        const intentController = new IntentController(event)
        const response = await intentController.createIntent()
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
