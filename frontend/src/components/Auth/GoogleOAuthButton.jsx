import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleOAuthButton = ({ onSuccess, onError }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap={false}
      width="100%"
      text="signup_with"
      shape="rectangular"
      theme="filled_blue"
    />
  );
};

export default GoogleOAuthButton;
