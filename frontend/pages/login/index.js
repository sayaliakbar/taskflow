import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import PasswordShowHideButton from "@components/PasswordShowHideButton";
import LocalError from "@components/LocalError";
import GlobalError from "@components/GlobalError";
import { validateEmail } from "../../utils/validation";
import Success from "@components/Success";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
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

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    // Clear previous errors
    setErrorMessage("");
    setEmailError("");

    // Dispatch login action
    const response = await dispatch(loginUser({ email, password }));

    if (response?.error) {
      setErrorMessage(response.payload);
      return;
    }

    if (response.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setEmail("");
      setPassword("");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  // Show loading spinner if status is "loading"
  if (status === "loading") {
    return <Loading />;
  }

  if (success) {
    return <Success message="Successfully logged in." />;
  }

  return (
    <div>
      <div className="glassmorphism flex flex-col items-center w-full max-w-sm p-8 space-y-6">
        <div>
          <div className="w-full space-y-4">
            <h1 className="sub_head_text blue_gradient text-center">
              Welcome Back
            </h1>
            <p className="desc text-center">
              Please log in to your account to continue.
            </p>

            {/* Display global error message */}
            {errorMessage && (
              <GlobalError
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                onClear={() => setErrorMessage("")}
              />
            )}

            {/* Login form */}
            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              {/* Email input */}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address..."
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className="form_input search_input"
                aria-describedby="email-error"
              />
              {emailError && (
                <LocalError errorDetail={emailError} id="email-error" />
              )}

              {/* Password input */}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="form_input search_input relative"
                  aria-describedby="password-error"
                />
                <PasswordShowHideButton
                  togglePasswordVisibility={togglePasswordVisibility}
                  showPassword={showPassword}
                />
              </span>

              {/* Submit button */}
              <button type="submit" className="black_btn w-full">
                Log In
              </button>
            </form>
          </div>
        </div>

        {/* Forgot password and register links */}
        <div className="flex justify-between w-full text-sm text-gray-500">
          <a
            href="/forgot-password"
            className="hover:text-gray-800 hover:underline"
          >
            Forgot Password?
          </a>
          <a href="/register" className="hover:text-gray-800 hover:underline">
            Create an Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
