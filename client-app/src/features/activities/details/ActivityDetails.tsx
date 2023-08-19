import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

// interface Props {
//   activity: Activity;
//   cancelSelectActivity: () => void;
//   openForm: (id: string) => void;
// }
export default observer(function ActivityDetails() {
  const {
    activityStore,
    deviceTypeStore: { isTablet },
  } = useStore();
  const {
    selectedActivity: activity,
    loadingInitial,
    loadActivity,
    clearSelectedActivity,
  } = activityStore;
  const { id } = useParams();
  useEffect(() => {
    if (id) loadActivity(id);
    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity]);

  if (loadingInitial || !activity)
    return <LoadingComponent content={"Loading"} />;
  return (
    <Grid>
      <Grid.Column width={isTablet ? 16 : 10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat activityId={activity.id} />
      </Grid.Column>
      <Grid.Column width={isTablet ? 16 : 6}>
        <ActivityDetailedSidebar activity={activity!} />
      </Grid.Column>
    </Grid>
  );
});
