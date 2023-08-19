import { makeAutoObservable } from "mobx";

export default class MenuStore {
  isOpened = false;
  constructor() {
    makeAutoObservable(this);
  }

  setState(state: boolean) {
    this.isOpened = state;
  }
}
