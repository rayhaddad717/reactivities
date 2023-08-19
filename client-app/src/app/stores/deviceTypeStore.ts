import { makeAutoObservable } from "mobx";

export default class DeviceTypeStore {
  isMobile = false;
  isTablet = false;
  mobileSize = 600;
  tabletSize = 900;

  constructor() {
    makeAutoObservable(this);
  }

  setIsMobile(state: boolean) {
    this.isMobile = state;
  }

  setIsTablet(state: boolean) {
    console.log(this);
    this.isTablet = state;
  }
}
