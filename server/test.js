require('dotenv').config();


const { sendWhatsapp, getTemplatedMessageInput } = require("./messageHelper");
msisdn = process.env.RECIPIENT_WAID;
params = {
    'number': 1,
    'title': 'Question 1',
    'answer': "Question 1 \\\\n The correct choice is:\\n\\nd.\\nA virtual assistant",
    'balance': 25,
    'whatsapp': msisdn
};

let data={};
template = getTemplatedMessageInput(msisdn,params);

r=sendWhatsapp(msisdn,params).then(res=>{
	console.log("response from: then");
	data=res;
}).catch(res=>{
	console.log("response from: catch");
	data=res;
}).finally(()=>{
	console.log("response from: finally");
	console.log(data?.response?.data);
});


