const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    return token;
  }
};

const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user;
  }
};

const getItems = { getToken, getUser };

export default getItems;
