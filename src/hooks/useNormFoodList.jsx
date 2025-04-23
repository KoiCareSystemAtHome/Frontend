import { useDispatch, useSelector } from "react-redux";
import { getListNormFoodSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListMember } from "../redux/slices/memberSlice";
import { getListNormFood } from "../redux/slices/normFoodSlice";

const useNormFoodList = () => {
  const dispatch = useDispatch();

  const normFoodList = useSelector(getListNormFoodSelector);

  useEffect(() => {
    const fetchNormFood = async () => {
      try {
        dispatch(getListNormFood());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchNormFood();
    return () => {};
  }, [dispatch]);

  return normFoodList;
};

export default useNormFoodList;
