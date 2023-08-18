import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

//no longer get it from props
// interface Props {
//   openForm: () => void;
// }
export default function NavBar() {
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
      </Container>
    </Menu>
  );
}
