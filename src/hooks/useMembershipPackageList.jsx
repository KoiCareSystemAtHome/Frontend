import { useDispatch, useSelector } from "react-redux";
import { getListMembershipPackageSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListMembershipPackage } from "../redux/slices/membershipPackageSlice";

const useMembershipPackageList = () => {
  const dispatch = useDispatch();

  const memberShipPackageList = useSelector(getListMembershipPackageSelector);

  useEffect(() => {
    const fecthMembershipPackage = async () => {
      try {
        dispatch(getListMembershipPackage());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthMembershipPackage();
    return () => {};
  }, [dispatch]);

  return memberShipPackageList;
};

export default useMembershipPackageList;
