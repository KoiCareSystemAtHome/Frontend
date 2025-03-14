import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListOrder } from "../redux/slices/orderSlice";

const useOrderList = (shopId) => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderSlice.listOrder);
  console.log("Fetched Orders from Redux:", orderList);

  useEffect(() => {
    if (shopId) {
      dispatch(getListOrder(shopId));
    }
  }, [dispatch, shopId]);

  return orderList;
};

export default useOrderList;
