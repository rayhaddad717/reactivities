import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../app/stores/store";
import {
  Button,
  Dimmer,
  Dropdown,
  Grid,
  GridColumn,
  Header,
  Icon,
  Image,
  Menu as SMenu,
} from "semantic-ui-react";
import { NavLink, Link } from "react-router-dom";

export default observer(function Menu() {
  const {
    menuStore,
    userStore: { user, logout },
  } = useStore();
  return (
    <Dimmer
      active={menuStore.isOpened}
      onClickOutside={() => menuStore.setState(false)}
      page
      className="dimmer"
    >
      <Grid>
        <Grid.Column width={16} floated="right">
          <Icon
            onClick={() => menuStore.setState(false)}
            inverted
            name="close"
            size="big"
          />
        </Grid.Column>
      </Grid>
      <SMenu vertical fluid>
        <SMenu.Item position="right">
          <Image src={user?.image || "assets/user.png"} avatar spaced="right" />
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
        </SMenu.Item>
        <SMenu.Item as={NavLink} to="/activities" name="Activities" />
        <SMenu.Item as={NavLink} to="/errors" name="Errors" />

        <SMenu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          />
        </SMenu.Item>
      </SMenu>
    </Dimmer>
  );
});
