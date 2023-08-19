import React from "react";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import ProfileFollowings from "./ProfileFollowings";
import { useStore } from "../../app/stores/store";
import ProfileActivities from "./ProfileActivities";
import ProfileDetails from "./ProfileDetails";

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const {
    profileStore,
    deviceTypeStore: { isTablet },
  } = useStore();
  const panes = [
    { menuItem: "About", render: () => <ProfileDetails /> },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: "Events", render: () => <ProfileActivities /> },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowings />,
    },
    {
      menuItem: "Following",
      render: () => <ProfileFollowings />,
    },
  ];
  return (
    <Tab
      className="profileContent"
      menu={isTablet ? {} : { fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) =>
        profileStore.setActiveTab(parseInt(data.activeIndex?.toString() || "0"))
      }
    />
  );
});
