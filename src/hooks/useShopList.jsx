import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListShop } from "../redux/slices/shopSlice";
import { getListShopSelector } from "../redux/selector";

const useShopList = () => {
  const dispatch = useDispatch();

  const shopList = useSelector(getListShopSelector);

  useEffect(() => {
    const fecthShop = async () => {
      try {
        dispatch(getListShop());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthShop();
    return () => {};
  }, [dispatch]);

  return shopList;
};

export default useShopList;
