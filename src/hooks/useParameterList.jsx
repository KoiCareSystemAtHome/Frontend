import { useDispatch, useSelector } from "react-redux";
import { getListParameterSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListParameter } from "../redux/slices/parameterSlice";

const useParameterList = (type) => {
  const dispatch = useDispatch();
  const parameterList = useSelector(getListParameterSelector);

  useEffect(() => {
    if (!type) return;

    dispatch(getListParameter({ type }));
  }, [dispatch, type]); // Added type as a dependency

  return parameterList;
};

export default useParameterList;
