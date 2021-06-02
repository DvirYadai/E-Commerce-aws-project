import { Request, Response } from "express";
import AWS from "aws-sdk";
import cartsConfig from "../tablesConfig/cartsConfig";

type ItemObjType = {
  "item-name": string;
  id: number;
  "img-url": string;
  "item-price": string;
  quantity: number;
};

const cart_get = async (req: Request, res: Response) => {
  const { userId } = req.query;
  AWS.config.update(cartsConfig.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: cartsConfig.aws_table_name,
    Key: {
      "user-id": userId,
    },
  };
  docClient.get(params, function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err,
      });
    } else {
      const { Item } = data;
      if (Item) {
        res.status(200).send({
          success: true,
          items: Item,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "User doesn't have items in the cart",
        });
      }
    }
  });
};

const cart_post = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { quantity } = req.body;
  const { item } = req.body;
  AWS.config.update(cartsConfig.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: cartsConfig.aws_table_name,
    Key: {
      "user-id": userId,
    },
  };

  docClient.get(params, function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err,
      });
    } else {
      const { Item } = data;
      if (Item === undefined) {
        const totalCost = Number(quantity) * item["item-price"];
        const params = {
          TableName: cartsConfig.aws_table_name,
          Item: {
            "user-id": userId,
            basketItems: [
              {
                "item-name": item["item-name"],
                id: item.id,
                "img-url": item["img-url"],
                "item-price": item["item-price"],
                quantity,
              },
            ],
            "total-cost": totalCost,
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
            res.status(200).send({
              success: true,
            });
          }
        });
      } else {
        const isExist = Item.basketItems.filter(
          (obj: ItemObjType) => obj.id === item.id
        );
        if (isExist.length > 0) {
          Item.basketItems.forEach((obj: ItemObjType) => {
            if (obj.id === item.id) {
              obj.quantity = Number(obj.quantity) + Number(quantity);
            }
          });
          const newTotalCost =
            Number(quantity) * item["item-price"] + Item["total-cost"];
          const params = {
            TableName: cartsConfig.aws_table_name,
            Key: {
              "user-id": userId,
            },
            UpdateExpression: "set basketItems = :i, #bp = :t",
            ExpressionAttributeValues: {
              ":i": Item.basketItems,
              ":t": newTotalCost,
            },
            ExpressionAttributeNames: {
              "#bp": "total-cost",
            },
            ReturnValues: "UPDATED_NEW",
          };
          docClient.update(params, function (err, data) {
            if (err) {
              console.error(
                "Unable to update item. Error JSON:",
                JSON.stringify(err, null, 2)
              );
              res.status(500).send({
                success: false,
                message: err,
              });
            } else {
              console.log(
                "UpdateItem succeeded:",
                JSON.stringify(data, null, 2)
              );
              res.status(200).send({
                success: true,
              });
            }
          });
        } else {
          Item.basketItems.push({
            "item-name": item["item-name"],
            id: item.id,
            "img-url": item["img-url"],
            "item-price": item["item-price"],
            quantity,
          });
          const newTotalCost =
            Number(quantity) * item["item-price"] + Item["total-cost"];
          const params = {
            TableName: cartsConfig.aws_table_name,
            Key: {
              "user-id": userId,
            },
            UpdateExpression: "set basketItems = :i, #bp = :t",
            ExpressionAttributeValues: {
              ":i": Item.basketItems,
              ":t": newTotalCost,
            },
            ExpressionAttributeNames: {
              "#bp": "total-cost",
            },
            ReturnValues: "UPDATED_NEW",
          };
          docClient.update(params, function (err, data) {
            if (err) {
              console.error(
                "Unable to update item. Error JSON:",
                JSON.stringify(err, null, 2)
              );
              res.status(500).send({
                success: false,
                message: err,
              });
            } else {
              console.log(
                "UpdateItem succeeded:",
                JSON.stringify(data, null, 2)
              );
              res.status(200).send({
                success: true,
              });
            }
          });
        }
      }
    }
  });
};

const cart_delete = async (req: Request, res: Response) => {
  const { userId } = req.body;
  AWS.config.update(cartsConfig.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: cartsConfig.aws_table_name,
    Key: {
      "user-id": userId,
    },
  };
  docClient.delete(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.status(500).send({
        success: false,
        message: err,
      });
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      res.status(200).send({
        success: true,
      });
    }
  });
};

export { cart_get, cart_post, cart_delete };
