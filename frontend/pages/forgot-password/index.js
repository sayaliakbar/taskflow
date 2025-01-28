import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, loginUser } from "../../redux/authSlice";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import LocalError from "@components/LocalError";
import GlobalError from "@components/GlobalError";
import { validateEmail } from "../../utils/validation";
import Success from "@components/Success";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.auth);

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
    const response = await dispatch(forgotPassword({ email }));

    if (response?.error) {
      setErrorMessage(response.payload);
      return;
    }

    if (response.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setEmail("");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  // Show loading spinner if status is "loading"
  if (status === "loading") {
    return <Loading />;
  }

  if (success) {
    return (
      <Success message="Password reset instructions have been sent to your email. Redirecting to login page..." />
    );
  }

  return (
    <div>
      <div className="glassmorphism flex flex-col items-center w-full max-w-sm p-8 space-y-6">
        <div>
          <div className="w-full space-y-4">
            <h1 className="sub_head_text blue_gradient text-center">
              Forgot Password
            </h1>
            <p className="desc text-center">
              Enter your email to receive password reset instructions.
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

              {/* Submit button */}
              <button type="submit" className="black_btn w-full">
                Send instructions
              </button>
            </form>
          </div>
        </div>

        {/* Forgot password and register links */}
        <a
          href="/login"
          className="hover:text-gray-800 text-sm text-gray-500 text-center hover:underline"
        >
          Back to login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
