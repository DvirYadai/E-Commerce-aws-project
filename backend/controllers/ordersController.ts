import { Request, Response } from "express";
import AWS from "aws-sdk";
import ordersConfig from "../tablesConfig/ordersConfig";

const order_post = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { basketItems } = req.body;
  const { totalCost } = req.body;
  const { personalInformation } = req.body;
  AWS.config.update(ordersConfig.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: ordersConfig.aws_table_name,
    Item: {
      "user-id": userId,
      basketItems,
      "total-cost": totalCost,
      personalInformation,
    },
  };
  docClient.put(params, function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err,
      });
    } else {
      console.log(JSON.stringify(data, null, 2));
      // Create sendEmail params
      const paramsEmail = {
        Destination: {
          ToAddresses: [personalInformation.emailAddress],
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: "<html><body><h1>Dear consumer,</h1><p style='color:red'>Thank you for buying</p></body></html>",
            },
            Text: {
              Charset: "UTF-8",
              Data: `${personalInformation.fullName}, thank you for buying with us`,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Thank for using our service",
          },
        },
        Source: "dvir195@gmail.com" /* required */,
      };

      // Create the promise and SES service object
      const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
        .sendEmail(paramsEmail)
        .promise();

      // Handle promise's fulfilled/rejected states
      sendPromise
        .then(function (data) {
          console.log(data.MessageId);
        })
        .catch(function (err) {
          console.error(err, err.stack);
        });
      const sns = new AWS.SNS();
      const phone = personalInformation.phoneNumber.substring(1);
      const paramsPhone = {
        Message: `Thanks for buying in my shop, ${personalInformation.fullName}!`,
        MessageStructure: "string",
        PhoneNumber: `+972${phone}`,
      };

      sns.publish(paramsPhone, function (err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
      });
      res.status(200).send({
        success: true,
      });
    }
  });
};

export default order_post;
