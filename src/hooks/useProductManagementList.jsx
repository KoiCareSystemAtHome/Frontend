import { useDispatch, useSelector } from "react-redux";
import { getListProductManagementSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListProductManagement } from "../redux/slices/productManagementSlice";

const useProductManagementList = () => {
  const dispatch = useDispatch();

  const productManagementList = useSelector(getListProductManagementSelector);

  useEffect(() => {
    const fecthProductManagement = async () => {
      try {
        dispatch(getListProductManagement());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthProductManagement();
    return () => {};
  }, [dispatch]);

  return productManagementList;
};

export default useProductManagementList;
