import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListTransactionSelector } from "../redux/selector";
import { transactionByShop } from "../redux/slices/transactionSlice";

const useTransactionList = (shopId) => {
  const dispatch = useDispatch();

  const transactionList = useSelector(getListTransactionSelector);

  useEffect(() => {
    if (shopId) {
      dispatch(transactionByShop(shopId));
    }
  }, [dispatch, shopId]);

  return transactionList;
};

export default useTransactionList;
