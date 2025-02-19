import { useDispatch, useSelector } from "react-redux";
import { getListDiseaseSelector } from "../redux/selector";
import { useEffect } from "react";
import { getListDisease } from "../redux/slices/diseasesSlice";

const useDiseaseList = () => {
  const dispatch = useDispatch();

  const diseaseList = useSelector(getListDiseaseSelector);

  useEffect(() => {
    const fecthDisease = async () => {
      try {
        dispatch(getListDisease());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthDisease();
    return () => {};
  }, [dispatch]);

  return diseaseList;
};

export default useDiseaseList;
