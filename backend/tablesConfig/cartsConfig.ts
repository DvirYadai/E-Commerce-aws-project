require("dotenv").config();

const cartsConfig = {
  aws_table_name: "carts",
  aws_local_config: {
    //Provide details for local configuration
  },
  aws_remote_config: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "us-east-1",
  },
};

export default cartsConfig;
