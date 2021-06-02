import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import Item from "../components/Item";

export default function Shop() {
  const [items, setItems] = useState([]);

  const getAllItems = async () => {
    try {
      const res = await axios.get(
        "http://ec2-3-91-134-105.compute-1.amazonaws.com/api/v1/items"
      );
      res.data.items.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
      setItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <div>
      <Header />
      <h1>Shop</h1>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </div>
  );
}
