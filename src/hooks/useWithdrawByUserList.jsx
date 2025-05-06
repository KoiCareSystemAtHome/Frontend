import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { walletWithdrawByUser } from "../redux/slices/transactionSlice";

const useWithdrawByUserList = (userId) => {
  const dispatch = useDispatch();
  const {
    walletWithdrawalData,
    loading: withdrawalLoading,
    error,
  } = useSelector((state) => state.transactionSlice);
  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentUserId = userId || loggedInUser?.id;

  const [withdrawList, setWithdrawList] = useState([]);

  useEffect(() => {
    if (currentUserId) {
      dispatch(walletWithdrawByUser(currentUserId));
    }
  }, [currentUserId, dispatch]);

  useEffect(() => {
    // If walletWithdrawalData is an object and not empty, use it directly
    if (
      walletWithdrawalData &&
      typeof walletWithdrawalData === "object" &&
      Object.keys(walletWithdrawalData).length > 0
    ) {
      setWithdrawList([walletWithdrawalData]); // Wrap in array for Table component
    } else {
      setWithdrawList([]);
    }
  }, [walletWithdrawalData]);

  return {
    withdrawList,
    loading: withdrawalLoading,
    error,
  };
};

export default useWithdrawByUserList;
