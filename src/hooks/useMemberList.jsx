import { useDispatch, useSelector } from "react-redux";
import { getLissMemberSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListMember } from "../redux/slices/memberSlice";

const useMemberList = () => {
  const dispatch = useDispatch();

  const memberList = useSelector(getLissMemberSelector);

  useEffect(() => {
    const fecthMember = async () => {
      try {
        dispatch(getListMember());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthMember();
    return () => {};
  }, [dispatch]);

  return memberList;
};

export default useMemberList;
