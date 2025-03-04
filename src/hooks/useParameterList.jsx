import { useDispatch, useSelector } from "react-redux";
import { getListParameterSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListParameter } from "../redux/slices/parameterSlice";

const useParameterList = (type) => {
  const dispatch = useDispatch();
  const parameterList = useSelector(getListParameterSelector);

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        if (type) dispatch(getListParameter(type));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchParameter();
  }, [dispatch, type]); // Added type as a dependency

  return parameterList;
};

export default useParameterList;
