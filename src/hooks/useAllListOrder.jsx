import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListOrder } from "../redux/slices/orderSlice";
import { getListOrderSelector } from "../redux/selector";

const useAllListOrder = () => {
  const dispatch = useDispatch();

  const allOrderList = useSelector(getListOrderSelector);

  useEffect(() => {
    const fetchAllOrderList = async () => {
      try {
        dispatch(getAllListOrder());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchAllOrderList();
    return () => {};
  }, [dispatch]);

  return allOrderList;
};

export default useAllListOrder;
