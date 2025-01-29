import { useRouter } from "next/router";
import { useEffect } from "react";

import getItem from "@utils/getToken";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";

const { getToken, getUser } = getItem;

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    const token = getToken();

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

const onlyAdmin = (WrappedComponent) => {
  return (props) => {
    const token = getToken();
    const user = getUser();

    const router = useRouter();

    useEffect(() => {
      if (!token) {
        // If not logged in, redirect to login page and save the attempted URL
        router.push(`/login?redirect=${router.pathname}`);
      } else if (user?.role !== "admin") {
        // If logged in but not an admin, redirect to home page
        router.push("/");
      }
    }, [user, token, router]);

    if (!token || user?.role !== "admin") {
      return null; // Show nothing while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

const authHOCs = { withAuth, withOutToken, onlyAdmin };
export default authHOCs;
