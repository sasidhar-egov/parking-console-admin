import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotFoundWrapper,NotFoundTitle,NotFoundMessage,GoHomeButton } from '../styles/StyledComponents';



const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const role = localStorage.getItem("role");
    const username =localStorage.getItem("username")
    if (!role || !username) {
        navigate('/');
    } else {
        navigate(`/${role}/home`);
    }
  };

  console.log("hiiiiiiiiejn");
  return (
    <NotFoundWrapper>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundMessage>Oops! The page you're looking for doesn't exist.</NotFoundMessage>
      <GoHomeButton onClick={handleGoHome}>Go to Home</GoHomeButton>
    </NotFoundWrapper>
  );
};

export default NotFound;
