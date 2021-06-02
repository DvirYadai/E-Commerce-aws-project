require("dotenv").config();

const itemsConfig = {
  aws_table_name: "hardware-shop-items",
  aws_local_config: {
    //Provide details for local configuration
  },
  aws_remote_config: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "us-east-1",
  },
};

export default itemsConfig;
