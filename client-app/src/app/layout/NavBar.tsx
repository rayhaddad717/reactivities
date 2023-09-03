import {
  Button,
  Container,
  Dropdown,
  Icon,
  Image,
  Menu,
} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

//no longer get it from props
// interface Props {
//   openForm: () => void;
// }
export default observer(function NavBar() {
  const {
    userStore: { user, logout, isLoggedIn },
    deviceTypeStore: { isTablet },
    menuStore,
  } = useStore();
  return (
    <Menu
      inverted //darker color
      fixed="top"
    >
      <Container>
        <Menu.Item as={NavLink} to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        {!isTablet && isLoggedIn && (
          <>
            <Menu.Item as={NavLink} to="/activities" name="Activities" />
            <Menu.Item as={NavLink} to="/errors" name="Errors" />

            <Menu.Item>
              <Button
                as={NavLink}
                to="/createActivity"
                positive
                content="Create Activity"
              />
            </Menu.Item>
            <Menu.Item position="right">
              <Image
                src={user?.image || "assets/user.png"}
                avatar
                spaced="right"
              />
              <Dropdown pointing="top left" text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profiles/${user?.username}`}
                    text="My Profile"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
        {isTablet && isLoggedIn && (
          <Menu.Item position="right" onClick={() => menuStore.setState(true)}>
            <Icon name="bars" size="big" inverted />
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
});
