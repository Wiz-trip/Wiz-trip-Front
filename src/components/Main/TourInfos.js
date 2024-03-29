import { cities, cityToCode } from '../../assets/korea-cities';
import { landmarks } from '../../assets/korea-landmarks';
import * as S from '../../styles/tourinfo.style';
import SlidePrevIcon from '../../assets/slide-prev-icon';
import SlideNextIcon from '../../assets/slide-next-icon';
import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import Spinner from '../../assets/loading-spinner.gif';

import {
  getLandmarkPage,
  getLandmarks,
  getCityLandmark,
} from '../../apis/api/landmark';
import LandmarkCard from './LandmarkCard';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';

function TourInfo() {
  const [slidePx, setSlidePx] = useState(0);
  const [city, setCity] = useState('전체');

  //도시별로 데이터 불러오기
  const { data: fetchedLandmarksCity, isLoading: isLoadingCity } = useQuery({
    queryKey: ['landmark', city],
    queryFn: () => getCityLandmark(cityToCode[city]),
    stateTime: 60 * 1000,
    enabled: city != '전체',
  });

  //페이징 처리된 랜드마크 불러오기
  const {
    data: paging,
    isLoading,
    isSuccess,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['page'],
    ({ pageParam = 1 }) => getLandmarkPage(pageParam),
    {
      getNextPageParam: (lastPage) => {
        const totalPage = lastPage.totalPage;
        const currentPage = lastPage.pageable.pageNumber;
        return currentPage + 1 !== totalPage ? currentPage + 1 : totalPage;
      },
    },
  );

  //캐러셀 버튼 조작
  const toPrev = () => {
    if (slidePx < 0) setSlidePx(slidePx + 1000);
  };
  const toNext = () => {
    if (slidePx > -2000) setSlidePx(slidePx - 1000);
  };

  //도시 선택시
  const onCityClick = (event) => {
    setCity(event.target.textContent);
  };

  //로딩처리
  if (isLoading && paging === undefined) {
    return (
      <S.SpinnerContainer>
        <img src={Spinner} alt="loading-spinner" />{' '}
      </S.SpinnerContainer>
    );
  } else if (
    city !== '전체' &&
    isLoadingCity &&
    fetchedLandmarksCity === undefined
  ) {
    return (
      <S.SpinnerContainer>
        <img src={Spinner} alt="loading-spinner" />
      </S.SpinnerContainer>
    );
  }

  return (
    <>
      <S.TourCityBox slide={slidePx}>
        <div className="slide-nav">
          <button className="slide-button" onClick={toPrev}>
            <SlidePrevIcon width="40" height="40" fill="none" />
          </button>

          <ul className="slide-item-wrapper">
            {cities.map((c, index) => (
              <li key={index} className="slide-item">
                <button
                  onClick={onCityClick}
                  style={{ color: city == c ? '#6446FF' : '#C9CDD2' }}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>

          <button className="slide-button" onClick={toNext}>
            <SlideNextIcon width="40" height="40" fill="none" />
          </button>
        </div>
      </S.TourCityBox>
      <S.TourCardBox>
        {city === '전체' ? (
          <InfiniteScroll
            hasMore={hasNextPage}
            loadMore={() => fetchNextPage()}
          >
            {' '}
            <S.TourCardBox>
              {paging?.pages.map((page, index) =>
                page?.content.map((data, index) => (
                  <LandmarkCard data={data} key={index} />
                )),
              )}
            </S.TourCardBox>
          </InfiniteScroll>
        ) : isLoadingCity ? (
          <S.SpinnerContainer>
            <img src={Spinner} alt="loading-spinner" />
          </S.SpinnerContainer>
        ) : (
          fetchedLandmarksCity?.map((data, index) => (
            <LandmarkCard data={data} key={index} />
          ))
        )}
      </S.TourCardBox>
    </>
  );
}
export default TourInfo;
