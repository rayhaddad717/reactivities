import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import { useMediaQuery } from "usehooks-ts";
import DeviceTypeStore from "../stores/deviceTypeStore";
import Menu from "../../features/home/Menu";
function App() {
  const location = useLocation();
  const { commonStore, userStore, deviceTypeStore, menuStore } = useStore();
  const { mobileSize, tabletSize } = deviceTypeStore;
  const isTablet = useMediaQuery(`(max-width:${tabletSize}px)`);
  const isMobile = useMediaQuery(`(max-width:${mobileSize})`);

  useEffect(() => {
    deviceTypeStore.setIsTablet(isTablet);
    console.log(isTablet);
  }, [isTablet, deviceTypeStore]);
  useEffect(() => {
    deviceTypeStore.setIsMobile(isMobile);
  }, [isMobile, deviceTypeStore]);

  useEffect(() => {
    menuStore.setState(false);
  }, [location, menuStore]);
  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;
  return (
    <>
      <Menu />
      <ScrollRestoration />
      <ModalContainer />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}
//so that our component observes our store
export default observer(App);
