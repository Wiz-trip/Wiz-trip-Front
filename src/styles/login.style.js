import styled from 'styled-components'

export const LoginWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: #EDF3FB;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const LoginForm = styled.form`
    width: 404px;
    height: 460px;
    border-radius: 20px;
    background: #FFF;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
        font-size: 36px;
        color: ${({ theme }) => theme.mainAccentColor};
      }

    .form-text{
        color: ${({ theme }) => theme.gray400Cool};
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        font-family: Pretendard Variable;
        margin-top: 2px;
    }
    .input-container{
        width: 290px;
        height: 40px;
        border: 1px solid #BFC6FA;
        font-family: Pretendard Variable;
        color: ${({ theme }) => theme.gray400Cool};
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        margin-top: 13px;
        padding-left: 5px;
    }
    
    .submit-button{
        width: 290px;
        height: 40px;
        border: 1px solid  ${({ theme }) => theme.paleAccentColor};
        background:  ${({ theme }) => theme.paleAccentColor};
        color: #FFF;
        font-family: Pretendard Variable;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        margin-top: 13px;
        padding-left: 5px;
    }
    .bottom-text{
        color: ${({ theme }) => theme.gray600};
        font-family: Pretendard Variable;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        margin-top: 25px;

        a{
            color: #6446FF;
            cursor: pointer;
        }
    }
    .error{
        width: 290px;
        font-family: Pretendard Variable;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        color: ${({ theme }) => theme.red900};
        margin-bottom: -5px;
    
    }


`

export const LineContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 15px 0;
    
    hr{
        width: 140px;
        height: 1px;
        background: ${({ theme }) => theme.gray600};
    }
    span{
        color: ${({ theme }) => theme.gray600};
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        margin: 0 16px;
    }

`