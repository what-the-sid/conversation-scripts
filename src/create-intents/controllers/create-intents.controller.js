const dialogflow = require('@google-cloud/dialogflow');

const intentsClient = new dialogflow.IntentsClient();

const { v4: uuidv4 } = require('uuid');

class IntentController {

  constructor(event){
    this.event = JSON.parse(event.body)
    this.projectId = process.env.PROJECTID
    this.sessionId = uuidv4()
  }
  async createIntent() {
  const agentPath = intentsClient.projectAgentPath(this.projectId);

  const trainingPhrases = [];
  const payload = {fields:{}}

  for(let i of this.event.phrases){
    const trainingPhrase = {
      type: 'EXAMPLE',
      parts: [{
        text: i
      }],
    };

    trainingPhrases.push(trainingPhrase);
  }

  for(let i of Object.keys(this.event.responses)){
    payload.fields[i] = {stringValue:this.event.responses[i]}
  }
  console.log("Payload:::",payload)
  const intent = {
    displayName: this.event.phrases[0],
    trainingPhrases: trainingPhrases,
    messages: [{payload}],
  };

  const createIntentRequest = {
    parent: agentPath,
    intent: intent,
  };
  const [response] = await intentsClient.createIntent(createIntentRequest);
  console.log(`Intent ${response.name} created`);
  return {
    error:false,
    message:`Intent ${response.name} created`
  }
}
}

export default IntentController;
