import { Request, Response } from "express";
import AWS from "aws-sdk";
import itemsConfig from "../tablesConfig/itemsConfig";

const items_get = async (req: Request, res: Response) => {
  AWS.config.update(itemsConfig.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: itemsConfig.aws_table_name,
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err,
      });
    } else {
      const { Items } = data;
      res.status(200).send({
        success: true,
        items: Items,
      });
    }
  });
};

export default items_get;
