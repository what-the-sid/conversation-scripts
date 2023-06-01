const uploadCsv = require('../upload-csv')

describe('Upload File Error Handling:::', () => {
  it('ERROR:invalid file format', async () => {

    payload = {
      headers:{
        'content-type':'application/json'
      }
    }

    const response = await uploadCsv.handler(payload,null,null);

    expect(response).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify({
        succes:false,
        message: 'Invalid file format',
        })
      });
  });
});
