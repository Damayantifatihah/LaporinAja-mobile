import api from "./api";

export const loginUser = async (
  email: string,
  password: string
) => {
  const { data } = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return data;
};

export const registerUser = async (
  userData: {
    name: string;
    email: string;
    password: string;
    nik: string;
    no_tlp: string;
  }
) => {
  const { data } = await api.post(
    "/auth/register",
    userData
  );

  return data;
};

export const getMe = async () => {
  const { data } = await api.get(
    "/auth/me"
  );

  return data;
};