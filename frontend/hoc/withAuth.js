import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const token = useSelector((state) => state.auth.token);
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.push("/login");
      }
    }, [token, router]);

    if (!token) {
      return null; // Show nothing while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

const withOutToken = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (router.isReady) {
        const { token } = router.query; // Access token from query parameters
        console.log("Token:", token);

        if (!token) {
          router.push("/login");
        }
      }
    }, [router]);

    if (!router.isReady) {
      return null; // Prevent rendering until router is ready
    }

    return <WrappedComponent {...props} />;
  };
};

const authHOCs = { withAuth, withOutToken };
export default authHOCs;
