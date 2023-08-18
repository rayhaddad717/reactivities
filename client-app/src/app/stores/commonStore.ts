import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ServerError } from "../models/serverError";
import agent from "../api/agent";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem("jwt");
  appLoaded = false;
  constructor() {
    makeAutoObservable(this);

    reaction(
      //called when we manually change the token not for initial value
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
