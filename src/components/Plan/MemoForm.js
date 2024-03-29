import React, { useEffect, useCallback } from 'react'
import * as M from '../../styles/memo-form.style'
import SubmitIcon from '../../assets/submit-icon';
import { useForm } from 'react-hook-form';
import { addMemoData } from '../../apis/api/memo';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
function MemoForm({ category }) {
  const { register, handleSubmit, reset } = useForm();

  const tripId = useParams().tripId;

  // 폼 초기화 함수
  const resetForm = useCallback(() => {
    reset({
      title: "",
      content: "",
      url: "",
    });
  }, [reset]);

  // useEffect 훅에 resetForm 함수를 의존성으로 추가
  useEffect(() => {
    resetForm();
  }, [category, resetForm]);

  const queryClient = useQueryClient();

  const mutation = useMutation(addMemoData, {
    onSuccess: () => {
      // API 호출이 성공하면 메모 목록 쿼리를 무효화하여 다시 불러오도록 합니다.
      queryClient.invalidateQueries('getMemoData');
    },
  });

  const onSubmit = async (data) => {
    let memo = {
      title: data.title,
      content: data.content,
      url: data.url,
      category: category,
    };

    mutation.mutateAsync({ tripId: tripId, data: memo });
    resetForm();
  };

  return (
    <M.FormLayout onSubmit={handleSubmit(onSubmit)} $category={category}>
      <M.FormContainer>
        <M.InputContainer>
          <span className="input-label">제목</span>
          <input
            className="input-text"
            name="title"
            type="text"
            {...register('title', {
              required: true,
            })}
          />
        </M.InputContainer>
        <M.InputContainer>
          <span className="input-label">내용</span>
          <input
            className="input-text"
            name="content"
            type="text"
            {...register('content', {
              required: true,
            })}
          />
        </M.InputContainer>
        {category !== 'MEMO' && (
          <M.InputContainer>
            <span className="input-label">링크</span>
            <input
              className="input-text"
              name="url"
              type="url"
              {...register('url', {
                required: true,
              })}
            />
          </M.InputContainer>
        )}
      </M.FormContainer>
      <button
        type="submit"
        style={{ background: 'transparent', border: 0, marginRight: '25px' }}
      >
        <SubmitIcon />
      </button>
    </M.FormLayout>
  );
}

export default MemoForm;
