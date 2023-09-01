import { makeAutoObservable, reaction, runInAction } from "mobx";
import {
  Photo,
  Profile,
  ProfileFormValues,
  UserActivity,
} from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  followings: Profile[] = [];
  loadingFollowings = false;
  activeTab = 0;
  userActivities: UserActivity[] = [];
  loadingActivities = false;
  eventPredicate = "future";

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else if (activeTab === 2) {
          this.loadActivities(this.eventPredicate);
        } else {
          this.userActivities = [];
          this.followings = [];
        }
      }
    );

    reaction(
      () => this.eventPredicate,
      () => {
        if (this.activeTab === 2) {
          this.loadActivities(this.eventPredicate);
        }
      }
    );
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  setActiveTab = (activeTab: number) => {
    this.activeTab = activeTab;
  };

  setEventPredicate = (eventPredicate: string) => {
    this.eventPredicate = eventPredicate;
  };

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.uploading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
        }
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => (this.loading = false));
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile)
          this.profile.photos = this.profile.photos?.filter(
            (p) => p.id !== photo.id
          );
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          following
            ? this.profile.followersCount++
            : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        if (
          this.profile &&
          this.profile.username === store.userStore.user?.username
        ) {
          following
            ? this.profile.followingCount++
            : this.profile.followingCount--;
        }

        this.followings.forEach((profile) => {
          if (profile.username === username) {
            profile.following
              ? profile.followersCount--
              : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;
    try {
      const followings = await agent.Profiles.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        this.followings = followings;
        this.loadingFollowings = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => (this.loadingFollowings = false));
    }
  };

  loadActivities = async (predicate: string) => {
    this.loadingActivities = true;
    try {
      const events = await agent.Profiles.listEvents(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        this.userActivities = events.map((activity) => ({
          ...activity,
          date: new Date(activity.date),
        }));
        this.loadingActivities = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loadingActivities = false;
      });
    }
  };

  updateProfile = async (profileFormValues: ProfileFormValues) => {
    try {
      await agent.Profiles.updateProfile(profileFormValues);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username === store.userStore.user?.username
        ) {
          let { bio } = profileFormValues;
          const { displayName } = profileFormValues;
          if (bio === null) bio = "";
          this.profile.displayName = displayName;
          this.profile.bio = bio;
          store.userStore.setDisplayName(displayName);
          store.activityStore.updateProfileDisplayNameAndBio(displayName, bio);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
}
