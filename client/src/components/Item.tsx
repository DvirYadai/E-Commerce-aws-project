import axios from "axios";
import React, { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

type itemType = {
  item: {
    "item-name": string;
    id: number;
    "img-url": string;
    "item-price": number;
  };
};

const Item = ({ item }: itemType) => {
  const { currentUser } = useAuth();

  const numberOfItemsRef = useRef<any>();

  const addToCartButton = async () => {
    if (numberOfItemsRef.current.value === "") {
      alert("you have to choose quantity");
      return;
    }
    try {
      const res = await axios.post(
        "http://ec2-3-91-134-105.compute-1.amazonaws.com/api/v1/cart",
        {
          userId: currentUser.uid,
          quantity: numberOfItemsRef.current.value,
          item,
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <img src={item["img-url"]} alt={item["item-name"] + "img"} />
      <p>{item["item-name"]}</p>
      <p>{item["item-price"]}</p>
      <input type="number" min="1" max="10" ref={numberOfItemsRef} />
      <button type="button" onClick={addToCartButton}>
        Add to cart
      </button>
    </div>
  );
};

export default Item;
