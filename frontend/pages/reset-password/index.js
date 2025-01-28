import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/authSlice";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import PasswordShowHideButton from "@components/PasswordShowHideButton";
import LocalError from "@components/LocalError";
import GlobalError from "@components/GlobalError";
import Success from "@components/Success";
import { validatePassword } from "../../utils/validation";
import authHOCs from "@hoc/withAuth";

const { withOutToken } = authHOCs;

const ResetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { status } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    // Clear previous errors
    setErrorMessage("");

    // Dispatch login action
    const response = await dispatch(resetPassword({ token, password }));

    console.log(response);
    if (response?.error) {
      setErrorMessage(response.payload);
      return;
    }

    if (response.meta.requestStatus === "fulfilled") {
      setSuccess(true);

      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  // Show loading spinner if status is "loading"
  if (status === "loading") {
    return <Loading />;
  }

  if (success) {
    return (
      <Success message="Password updated successfully. Redirecting to login page..." />
    );
  }

  return (
    <div>
      <div className="glassmorphism flex flex-col items-center w-full max-w-sm p-8 space-y-6">
        <div>
          <div className="w-full space-y-4">
            <h1 className="sub_head_text blue_gradient text-center">
              Reset Password
            </h1>
            <p className="desc text-center">Enter your new password.</p>

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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="form_input search_input relative"
                  aria-describedby="password-error"
                />
                <PasswordShowHideButton
                  togglePasswordVisibility={togglePasswordVisibility}
                  showPassword={showPassword}
                />
              </span>
              {passwordError && (
                <LocalError errorDetail={passwordError} id="password-error" />
              )}

              {/*Confirm Password input */}
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
              >
                Confirm Password
              </label>
              <span className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Re-enter your password..."
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  className="form_input search_input relative"
                  aria-describedby="confirmPassword-error"
                />
                <PasswordShowHideButton
                  togglePasswordVisibility={toggleConfirmPasswordVisibility}
                  showPassword={showConfirmPassword}
                />
              </span>
              {confirmPasswordError && (
                <LocalError
                  errorDetail={confirmPasswordError}
                  id="password-error"
                />
              )}

              {/* Submit button */}
              <button type="submit" className="black_btn w-full">
                Reset Password
              </button>
            </form>
          </div>
        </div>

        {/* Forgot password and register links */}
        <a
          href="/forgot-password"
          className="hover:text-gray-800 text-sm text-gray-500 text-center hover:underline"
        >
          Resend Instructions
        </a>
      </div>
    </div>
  );
};

export default withOutToken(ResetPassword);
