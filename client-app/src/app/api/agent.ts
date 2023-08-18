import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { Photo, Profile } from "../models/profile";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
const bobToken =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJvYiIsIm5hbWVpZCI6ImJiMDEyNmEwLTk3ZjAtNGU5MC04ZjRlLWUyN2EzOTNkNzYzYiIsImVtYWlsIjoiYm9iQHRlc3QuY29tIiwibmJmIjoxNjkyMDg3MDE3LCJleHAiOjE2OTI2OTE4MTcsImlhdCI6MTY5MjA4NzAxN30.TP1KImNxyBXNwy0upwJ4sHRlAFG2zZUq45nxMMQyVsYTC68uMXBSf0lm_qFS95YlpDxnoy5QTJlJESKHHXdxRQ";
const tomToken =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJvYiIsIm5hbWVpZCI6ImJiMDEyNmEwLTk3ZjAtNGU5MC04ZjRlLWUyN2EzOTNkNzYzYiIsImVtYWlsIjoiYm9iQHRlc3QuY29tIiwibmJmIjoxNjkyMDg3Mjg3LCJleHAiOjE2OTI2OTIwODcsImlhdCI6MTY5MjA4NzI4N30.aac3ISM0p6eNoAR8BZQ0R8ojBt80gGdGAnI0Vbf3T7awV4BsTT7ZePXK1dCQwnMxvVLbkMyJAosoClGpMn7Qrg";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// axios.defaults.headers.common["Authorization"] = `Bearer ${tomToken}`;
axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          return router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          toast.error(data);
        }
        toast.error("bad request");
        break;
      case 401:
        toast.error("unauthorized");
        break;
      case 403:
        toast.error("forbidden");
        break;
      case 404:
        router.navigate("/not-found");
        toast.error("not found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => request.get<Activity[]>("/activities"),
  details: (id: string) => request.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) =>
    request.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
    request.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del<void>(`/activities/${id}`),
  attend: (id: string) => request.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => request.get<User>("/account"),
  login: (user: UserFormValues) => request.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    request.post<User>("/account/register", user),
};

const Profiles = {
  get: (username: string) => request.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo>("photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => request.del(`/photos/${id}`),
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
