import UploadController from './controllers/upload-csv.controller';

export const handler = async (event,context,callback)=> {
    try {

      const BUCKET = process.env.BUCKET;

      if(event.headers['content-type'] && event.headers['content-type']!=="text/csv"){
        return {
          statusCode: 400,
          body: JSON.stringify({
            succes:false,
            message: 'Invalid file format',
            })
          }
        }
        const uploadController = new UploadController(event)
        const response = await uploadController.upload(BUCKET)
        if(response.error){
          return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
          }
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ link: `https://${BUCKET}.s3.amazonaws.com/${response.filename}` })
        }
      }
  catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" })
      }
    }
}
