import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { CartItem } from "../components/cartItem";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

export default function Cart() {
  const fullNameRef = useRef<any>();
  const addressRef = useRef<any>();
  const phoneNumberRef = useRef<any>();
  const emailAddressRef = useRef<any>();
  const { currentUser } = useAuth();
  const history = useHistory();
  const [items, setItems] = useState<any>(false);
  const [totalCost, setTotalCost] = useState<number>(0);

  const checkOutButton = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bodyReq = {
      userId: currentUser.uid,
      basketItems: items,
      totalCost,
      personalInformation: {
        fullName: fullNameRef.current.value,
        address: addressRef.current.value,
        phoneNumber: phoneNumberRef.current.value,
        emailAddress: emailAddressRef.current.value,
      },
    };
    try {
      await axios.post(
        "http://ec2-3-91-134-105.compute-1.amazonaws.com/api/v1/order",
        bodyReq
      );
      const res = await axios.delete(
        "http://ec2-3-91-134-105.compute-1.amazonaws.com/api/v1/cart",
        {
          data: { userId: currentUser.uid },
        }
      );
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getCart = async () => {
    try {
      const res = await axios.get(
        `http://ec2-3-91-134-105.compute-1.amazonaws.com/api/v1/cart?userId=${currentUser.uid}`
      );
      if (res.data.message) {
        setItems({});
      } else {
        setItems(res.data.items.basketItems);
        setTotalCost(res.data.items["total-cost"]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div>
      <Header />
      <h1>Cart</h1>
      {Object.keys(items).length > 0 &&
        items.map((item: any, i: number) => <CartItem key={i} item={item} />)}
      <p>Total Price: {totalCost}</p>
      <form onSubmit={(e) => checkOutButton(e)}>
        <label htmlFor="fullName">Full Name</label>
        <input type="text" id="fullName" required ref={fullNameRef} />
        <label htmlFor="address">Address</label>
        <input type="text" id="address" required ref={addressRef} />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          required
          ref={phoneNumberRef}
          pattern="[0-9]{10}"
        />
        <label htmlFor="emailAddress">Email Address</label>
        <input type="email" id="emailAddress" required ref={emailAddressRef} />
        <button type="submit">Check out</button>
      </form>
    </div>
  );
}
