import { useRouter } from "next/router";
import { useState } from "react";

import GlobalError from "./GlobalError";
import LocalError from "./LocalError";
import PasswordShowHideButton from "./PasswordShowHideButton";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation";

const Form = ({
  title,
  description,
  buttonText,
  onSubmit,
  errorMessage,
  setErrorMessage,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  username,
  setUsername,
}) => {
  const router = useRouter();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isRegisterPage = router.pathname.includes("/register");
  const isForgotPasswordPage = router.pathname.includes("/forgot-password");
  const isResetPasswordPage = router.pathname.includes("/reset-password");
  const isLoginPage = router.pathname.includes("/login");

  const isDisabled =
    (isResetPasswordPage && !confirmPassword) ||
    (!isForgotPasswordPage && !password) ||
    (isRegisterPage && !username) ||
    (!isResetPasswordPage && !email);

  const validateFields = () => {
    if (isLoginPage) {
      const emailError = validateEmail(email);

      setErrors({ email: emailError });

      return !emailError;
    }
    if (isRegisterPage) {
      const nameError = validateName(username);
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
      });

      return !nameError && !emailError && !passwordError;
    }
    if (isForgotPasswordPage) {
      const emailError = validateEmail(email);

      setErrors({ email: emailError });

      return !emailError;
    }
    if (isResetPasswordPage) {
      const passwordError = validatePassword(password);
      const confirmPasswordError = validateConfirmPassword(
        password,
        confirmPassword
      );

      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });

      return !passwordError && !confirmPasswordError;
    }

    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) onSubmit();
  };

  const [showPassword, setShowPassword] = useState(false);

  const renderInputField = (id, label, type, value, onChange, error) => {
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

    return (
      <div className="relative">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
        >
          {label}
        </label>
        <input
          type={type === "password" && showPassword ? "text" : type}
          id={id}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className="form_input search_input"
          required
          value={value}
          onChange={onChange}
          style={{ paddingRight: type === "password" ? "40px" : undefined }}
        />
        {type === "password" && password && (
          <PasswordShowHideButton
            togglePasswordVisibility={togglePasswordVisibility}
            showPassword={showPassword}
          />
        )}
        {error && <LocalError errorDetail={error} />}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="sub_head_text blue_gradient text-center">{title}</h1>
      <p className="desc text-center">{description}</p>

      {errorMessage && (
        <GlobalError
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          onClear={() => setErrorMessage("")}
        />
      )}

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        {isRegisterPage &&
          renderInputField(
            "username",
            "Full Name",
            "text",
            username,
            (e) => {
              setUsername(e.target.value);
              // setErrors({ ...errors, name: "" });
            },
            errors.name
          )}

        {!isResetPasswordPage &&
          renderInputField(
            "email",
            "Email Address",
            "email",
            email,
            (e) => {
              setEmail(e.target.value);
              // setErrors({ ...errors, email: "" });
            },
            errors.email
          )}

        {!isForgotPasswordPage &&
          !isResetPasswordPage &&
          renderInputField(
            "password",
            "Password",
            "password",
            password,
            (e) => {
              setPassword(e.target.value);
              // setErrors({ ...errors, password: "" });
            },
            errors.password
          )}

        {isResetPasswordPage && (
          <>
            {renderInputField(
              "password",
              "New Password",
              "password",
              password,
              (e) => {
                setPassword(e.target.value);
                // setErrors({ ...errors, name: "" });
              },
              errors.password
            )}
            {renderInputField(
              "confirm_password",
              "Confirm Password",
              "password",
              confirmPassword,
              (e) => {
                setConfirmPassword(e.target.value);
                // setErrors({ ...errors, name: "" });
              },
              errors.confirmPassword
            )}
          </>
        )}

        <button
          disabled={isDisabled}
          type="submit"
          className={`w-full ${
            isDisabled ? "disable_btn" : "black_btn cursor-pointer"
          }`}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default Form;
