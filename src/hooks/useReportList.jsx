import { useDispatch, useSelector } from "react-redux";
import { getListReportSelector } from "../redux/selector";
import { getListReport } from "../redux/slices/reportSlice";
import { useEffect } from "react";

const useReportList = () => {
  const dispatch = useDispatch();

  const reportList = useSelector(getListReportSelector);

  useEffect(() => {
    const fecthReport = async () => {
      try {
        dispatch(getListReport());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthReport();
    return () => {};
  }, [dispatch]);

  return reportList;
};

export default useReportList;
