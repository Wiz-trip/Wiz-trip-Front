import React from 'react'
import * as T from '../../styles/mytrip.style'
import { useNavigate } from 'react-router-dom';
import { deleteTrip } from '../../apis/api/trip';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

function PlanningItemList({myTripData}) {

    const navigate = useNavigate();
    const userIdx = useSelector(state=>state.User.userIdx);
    const queryClient = useQueryClient();
    const deleteMutation = useMutation(deleteTrip, {
      onSuccess: () => {
        queryClient.invalidateQueries('getMyTrip');
      },
    });

    const handleDelete = async (tripId) => {
        await deleteMutation.mutateAsync(tripId);
    }
    console.log(myTripData);
     
    return (
        <>
        {myTripData.length > 0? 
            <T.TripItemBox>
            {myTripData.map((trip, index)=>(
            <T.TripItem key={index}>
                    <div className='d-day'>D{dayjs().diff(trip.startDate, 'day') >= 0 ? '+' : ''}{dayjs().diff(trip.startDate, 'day')}</div>
                <span className='place-text'>
                {trip.destination}
                </span> 
                <span className='period-text'>
                {dayjs(trip.startDate).format('YYYY-MM-DD')}~{dayjs(trip.finishDate).format('YYYY-MM-DD')}
                </span> 
                <T.ButtonWrapper>
                    <T.StyleButton $category='revise' onClick={()=>navigate(`/plan/${trip.tripId}`)}>계획 편집하기</T.StyleButton>
                    {trip.ownerId==userIdx &&<T.StyleButton $category='delete' onClick={()=>handleDelete(trip.tripId)} >계획 삭제하기</T.StyleButton>} 
                </T.ButtonWrapper> 
            </T.TripItem>
            ))}

            </T.TripItemBox>
            :
            <T.TripItem style={{alignItems: 'center', justifyContent: 'center'}}>
                <span className='default-text'> 예정된 내 일정이 없습니다.</span>
            </T.TripItem>
        }
        </>
    )
}

export default PlanningItemList