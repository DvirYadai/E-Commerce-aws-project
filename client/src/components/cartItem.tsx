import React from "react";

type CartItemType = {
  item: {
    id: number;
    "img-url": string;
    "item-name": string;
    "item-price": number;
    quantity: number;
  };
};

export const CartItem = ({ item }: CartItemType) => {
  return (
    <div>
      <img src={item["img-url"]} alt={item["item-name"] + "img"} />
      <p>{item["item-name"]}</p>
      <p>{"Quantity: " + item.quantity}</p>
    </div>
  );
};
