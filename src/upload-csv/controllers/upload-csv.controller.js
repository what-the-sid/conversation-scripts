const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

class UploadController {

  constructor(event){
    this.event = event
  }

  extractFile() {
    let schema = ["sender_username","reciever_username","message","channel"]
    let firstLine = this.event.body.split('\n')[0].split(",");
    console.log("Headers:::",firstLine)
    const allValuesAreThere = firstLine.every(item => {
      if(schema.indexOf(item.replace("\r","").trim())>=0){
        return true
      }
      else{
        false
      }
    })
    if(firstLine.length===4 && allValuesAreThere){
      return {
        filename:uuidv4()+'.csv',
        data:this.event.body,
        error:false
      }
    }
    else{
      console.log("CSV schema doesn't match")
      return {
        error:true
      }
    }
  }

  async upload(BUCKET){
    try{

      const { filename, data, error } = this.extractFile()
      console.log("filename:::",filename)
      if(!error){
        await s3.putObject({ Bucket: BUCKET, Key: filename, Body: data }).promise();
        return {
          error:false,
          filename
        }
      }
      else{
        return {error:true}
      }
    }
    catch(error){
      console.log(error)
      return {
        error: true,
        errorCode: 500,
        details: "Internal Server Error"
      }
    }
  }
}

export default UploadController;
