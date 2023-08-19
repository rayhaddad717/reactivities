import React from "react";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Menu, Tab, Image, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default observer(function ProfileActivities() {
  const {
    profileStore,
    deviceTypeStore: { isTablet },
  } = useStore();
  const {
    loadingActivities: loadingEvents,
    eventPredicate,
    userActivities: events,
    setEventPredicate,
  } = profileStore;
  return (
    <Tab.Pane loading={loadingEvents}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content="Activities" />
        </Grid.Column>

        <Grid.Column width={16}>
          <Menu pointing secondary>
            <Menu.Item
              name="Future Events"
              active={eventPredicate === "future"}
              onClick={() => setEventPredicate("future")}
            />
            <Menu.Item
              name="Past Events"
              active={eventPredicate === "past"}
              onClick={() => setEventPredicate("past")}
            />
            <Menu.Item
              name="Hosting"
              active={eventPredicate === "hosting"}
              onClick={() => setEventPredicate("hosting")}
            />
          </Menu>
        </Grid.Column>

        <Grid.Column width={16}>
          <Card.Group itemsPerRow={isTablet ? 2 : 4}>
            {events.map((activity) => (
              <Card key={activity.id}>
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header as={Link} to={`/activities/${activity.id}`}>
                    {activity.title}
                  </Card.Header>
                  <Card.Meta textAlign="center">
                    <span>{format(activity.date, "do MMM")}</span>
                  </Card.Meta>
                  <Card.Meta textAlign="center">
                    <span>{format(activity.date, "k:mm aa")}</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
