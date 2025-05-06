import { useDispatch, useSelector } from "react-redux";
import { getListWalletWithdrawSelector } from "../redux/selector";
import { useEffect } from "react";
import { getWalletWithdraw } from "../redux/slices/transactionSlice";

const useWithdrawList = () => {
  const dispatch = useDispatch();

  const withdrawList = useSelector(getListWalletWithdrawSelector);

  useEffect(() => {
    const fecthWithdraw = async () => {
      try {
        dispatch(getWalletWithdraw());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthWithdraw();
    return () => {};
  }, [dispatch]);

  return withdrawList;
};

export default useWithdrawList;
