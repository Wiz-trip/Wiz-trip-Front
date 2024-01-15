import { useState, useEffect, useParams } from 'react';
import {
  createClockTimes,
  createSelectTimes,
} from '../../utils/createSelectTimes';
import CloseIcon from '../../assets/close-icon';
import * as M from '../../styles/planmodal.style';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { createDatesArr } from '../../utils/createDaysArr';
import { categoryToEng, categoryToKo } from '../../assets/category-palette';
import { createTimestamp } from '../../utils/createTimestamp';
import KakaoPostcode from './KakaoPostcode';
import { createPlan, getTargetPlan } from '../../apis/api/plan';
import { useMutation, useQueryClient } from 'react-query';
function PlanModal({
  isOpenModal,
  setIsOpenModal,
  defaultDate,
  days,
  setPlans,
  tripId,
}) {
  const times = createSelectTimes();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    setValue,
    clearErrors,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange' });
  const [isOpenPostcode, setIsOpenPostcode] = useState(false);
  const [address, setAddress] = useState('');

  const queryClient = useQueryClient();
  const uploadPlanMutation = useMutation({
    mutationFn: (newPlan) => createPlan(tripId, newPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllPlan'] });
    },
  });

  const onSubmit = (data) => {
    //실제 plan 생성
    const cur_date = days[data.selectDay];
    const obj = createTimestamp(
      cur_date.date_full,
      data.startTime,
      data.endTime,
    );

    const newPlan = {
      name: 'defaultName',
      address: {
        roadNameAddress: address,
        localAddress: 'defaultLocalAddress',
      },
      startTime: obj.startTimestamp,
      finishTime: obj.endTimestamp,
      content: data.content,
      category: categoryToEng[data.category],
    };

    uploadPlanMutation.mutate(newPlan);

    //초기화
    setIsOpenModal(false);
    reset({
      selectDay: 0,
      startTime: 0,
      endTime: 0,
      content: '',
      category: '',
    });
    setAddress('');
  };

  useEffect(() => {
    //update를 위해 창이 열렸을 때
    if (isOpenModal !== false && isOpenModal !== true) {
      console.log('수정하기 clicked', isOpenModal); //isOpenModal상태에 planId값 존재
      //tripId와 planId에 해당하는 자료 값 가져오기
      const currentPlan = getTargetPlan(tripId, isOpenModal);
      console.log('수정될 plan', currentPlan);
      setAddress(currentPlan.address?.roadNameAddress);
      setValue('category', categoryToKo[currentPlan.category]);
      setValue('content', currentPlan.content);
    }
  }, [isOpenModal]);
  console.log('isOpenModal', isOpenModal);
  return (
    <div>
      <M.ModalWrapper isopen={isOpenModal}>
        <div className="button-box">
          <button
            className="close-modal-button"
            onClick={() => setIsOpenModal(false)}
          >
            <CloseIcon width="19" height="19" fill="#6446ff" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <M.FormWrapper>
            <div className="field">
              <p className="label">장소</p>
              <div className="address-box">
                <input value={address} />
                <KakaoPostcode setAddress={setAddress} />
              </div>
            </div>
            <div className="field">
              <p className="label">
                시간
                <strong>*</strong>
              </p>
              <div>
                <M.Selecter
                  className="seleter"
                  name="selectDay"
                  {...register('selectDay', { required: true })}
                >
                  {days.map((day, index) => (
                    <option key={index} value={index}>
                      {day.date_trimed}
                    </option>
                  ))}
                </M.Selecter>
                <br />
                <M.Selecter
                  className="seleter"
                  name="startTime"
                  {...register('startTime', { required: true })}
                >
                  {times.map((time, index) => (
                    <option key={index} value={index}>
                      {time.text}
                    </option>
                  ))}
                </M.Selecter>
                <span> ~ </span>
                <M.Selecter
                  className="seleter"
                  name="endTime"
                  {...register('endTime', { required: true })}
                >
                  {times.slice(watch('startTime')).map((time, index) => (
                    <option key={index} value={index}>
                      {time.text}
                    </option>
                  ))}
                </M.Selecter>
              </div>
            </div>

            <div className="field">
              <p className="label">
                카테고리<strong>*</strong>
              </p>
              <M.Selecter
                name="category"
                {...register('category', { required: true })}
              >
                {['음식', '숙소', '관광', '기타'].map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </M.Selecter>
            </div>

            <div className="field">
              <p className="label">
                내용<strong>*</strong>
              </p>
              <textarea
                name="content"
                {...register('content', { required: true })}
              />
            </div>
          </M.FormWrapper>
          <div className="button-box">
            <button className="submit-button">완료</button>
          </div>
        </form>
      </M.ModalWrapper>
      <M.ModalBackground isopen={isOpenModal}>{''}</M.ModalBackground>
    </div>
  );
}
export default PlanModal;
