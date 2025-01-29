import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/authSlice";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import PasswordShowHideButton from "@components/PasswordShowHideButton";
import LocalError from "@components/LocalError";
import GlobalError from "@components/GlobalError";
import Success from "@components/Success";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";
import Link from "next/link";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const nameError = validateName(name);
    const passwordError = validatePassword(password);

    setNameError(nameError || "");
    setEmailError(emailError || "");
    setPasswordError(passwordError || "");

    if (nameError || emailError || passwordError) {
      return;
    }

    setErrorMessage("");
    const response = await dispatch(registerUser({ name, email, password }));

    if (response?.error) {
      setErrorMessage(response.payload);
      return;
    }

    if (response.payload.status === "success") {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (success) {
    return (
      <Success message="Registration successful. Redirecting to login page..." />
    );
  }

  return (
    <div className="glassmorphism flex flex-col items-center w-full max-w-sm p-8 space-y-6">
      <div>
        <div className="w-full space-y-4">
          <h1 className="sub_head_text blue_gradient text-center">
            Register Now
          </h1>
          <p className="desc text-center">
            Register now to get access to all the features of the app.
          </p>

          {errorMessage && (
            <GlobalError
              setErrorMessage={setErrorMessage}
              errorMessage={errorMessage}
              onClear={() => setErrorMessage("")}
            />
          )}
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name..."
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              className="form_input search_input"
            />
            {nameError && <LocalError errorDetail={nameError} />}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter you email address..."
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className="form_input search_input"
            />
            {emailError && <LocalError errorDetail={emailError} />}
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
            >
              Password
            </label>
            <span className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password..."
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className="form_input search_input relative"
              />
              {passwordError && <LocalError errorDetail={passwordError} />}

              <PasswordShowHideButton
                togglePasswordVisibility={togglePasswordVisibility}
                showPassword={showPassword}
              />
            </span>

            <button type="submit" className="black_btn w-full">
              Register
            </button>
          </form>
        </div>
      </div>

      <Link
        href="/login"
        className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
      >
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;
