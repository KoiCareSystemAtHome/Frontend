import { useDispatch, useSelector } from "react-redux";
import { getListProductManagementSelector } from "../redux/selector";
import { useEffect } from "react";
import { getProductsByShopId } from "../redux/slices/productManagementSlice";

const useProductManagementList = (shopId) => {
  const dispatch = useDispatch();

  const productManagementList = useSelector(getListProductManagementSelector);

  useEffect(() => {
    if (shopId) {
      dispatch(getProductsByShopId(shopId));
    }
  }, [dispatch, shopId]);

  return productManagementList;
};

export default useProductManagementList;
