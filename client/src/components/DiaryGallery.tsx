import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "../hooks/usePagination";
import { fetchDiaryWithImages } from "../utils/http";
import Pagination from "./common/Pagination";
import classes from "../styles/DiaryGallery.module.css";
import { useDispatch } from "react-redux";
import { diaryId } from "../store/diary/diarySlice";
import { openModal } from "../store/modal/modalSlice";

interface DiaryDataType {
  id: number;
  title: string;
  content: string;
  hasImage: boolean;
}

function extractImageUrls(content: string) {
  const imgTagRegex = /<img\s+[^>]*src="([^"]*)"[^>]*>/gi;
  const urls = [];
  let match;
  while ((match = imgTagRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

const DiaryGallery: React.FC = () => {
  const dispatch = useDispatch();
  const {
    currentPage,
    totalPages,
    setTotalPages,
    onPageChangeHandler,
    onPrevPageHandler,
    onNextPageHandler,
  } = usePagination();

  const { data: galleryListData, isLoading } = useQuery({
    queryKey: ["gallerylist", currentPage],
    queryFn: ({ signal }) => fetchDiaryWithImages({ signal, page: currentPage }),
  });

  useEffect(() => {
    if (galleryListData) {
      setTotalPages(galleryListData.total_pages);
    }
  }, [galleryListData]);

  return (
    <div>
      <h1 className={classes.gallery__title}>갤러리</h1>
      <div className={classes.gallery}>
        {isLoading && <p>Loading...</p>}
        {!isLoading &&
          galleryListData &&
          galleryListData.data.map((diary: DiaryDataType) => {
            const imageUrls = extractImageUrls(diary.content);
            const firstImageUrl = imageUrls[0];
            const additionalImagesCount = imageUrls.length - 1;

            return (
              <div
                className={classes.gallery__item}
                key={diary.id}
                onClick={() => {
                  dispatch(diaryId(diary.id));
                  dispatch(openModal("diarydetail"));
                }}
              >
                <img src={firstImageUrl} alt="First in diary" className={classes.gallery__image} />
                {additionalImagesCount > 0 && <p>{additionalImagesCount} more images</p>}
              </div>
            );
          })}
        <div className={classes.gallery__pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChangeHandler}
            onPrevPage={onPrevPageHandler}
            onNextPage={onNextPageHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default DiaryGallery;
