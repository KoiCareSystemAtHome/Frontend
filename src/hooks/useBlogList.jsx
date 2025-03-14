import { useDispatch, useSelector } from "react-redux";
import { getListBlogSelector } from "../redux/selector";
import { getListBlog } from "../redux/slices/blogSlice";
import { useEffect } from "react";

const useBlogList = () => {
  const dispatch = useDispatch();

  const blogList = useSelector(getListBlogSelector);

  useEffect(() => {
    const fecthBlog = async () => {
      try {
        dispatch(getListBlog());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fecthBlog();
    return () => {};
  }, [dispatch, blogList.length]);

  return blogList;
};

export default useBlogList;
