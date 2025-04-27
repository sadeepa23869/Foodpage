import React from "react";

const LoginGoogleOAuthButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4043/oauth2/authorization/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center mt-4"
      type="button"
    >
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_17_40)">
          <path
            d="M47.9999 24.5525C47.9999 22.7334 47.8472 21.0667 47.5144 19.4667H24.4799V28.7334H37.8407C37.2536 31.3334 35.6262 33.4667 33.2536 34.9334V40.0802H41.2536C45.6262 36.0802 47.9999 30.8002 47.9999 24.5525Z"
            fill="#4285F4"
          />
          <path
            d="M24.48 48C30.48 48 35.5734 46.08 39.2534 42.9333L31.2534 37.8667C29.5734 39.0667 27.3334 39.8667 24.48 39.8667C18.64 39.8667 13.5734 35.7333 11.7334 30.4H3.57336V35.68C7.25336 43.0933 15.2534 48 24.48 48Z"
            fill="#34A853"
          />
          <path
            d="M11.7334 30.4C11.2534 29.2 10.96 27.8933 10.96 26.5333C10.96 25.1733 11.2534 23.8667 11.7334 22.6667V17.3867H3.57336C2.29336 20.08 1.57336 23.0133 1.57336 26.5333C1.57336 30.0533 2.29336 32.9867 3.57336 35.68L11.7334 30.4Z"
            fill="#FBBC05"
          />
          <path
            d="M24.48 13.8667C27.6267 13.8667 30.0267 14.96 31.8134 16.6667L39.3867 9.09333C35.5734 5.54667 30.48 3.46667 24.48 3.46667C15.2534 3.46667 7.25336 8.37333 3.57336 15.7867L11.7334 21.0667C13.5734 15.7333 18.64 13.8667 24.48 13.8667Z"
            fill="#EA4335"
          />
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
      Sign in with Google
    </button>
  );
};

export default LoginGoogleOAuthButton;
