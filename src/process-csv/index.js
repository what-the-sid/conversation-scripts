import ProcessController from './controllers/process-csv.controller';

export const handler = async (event,context,callback)=> {
    try {
        const processController = new ProcessController(event)
        const response = await processController.createAndStoreResponses()
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
