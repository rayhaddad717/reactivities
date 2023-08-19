import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { ProfileFormValues } from "../../app/models/profile";
export default observer(function ProfileDetails() {
  const {
    profileStore: { profile, isCurrentUser, updateProfile },
  } = useStore();

  const [editProfileMode, setEditProfileMode] = useState(false);
  const initialValues = useMemo(
    () =>
      ({
        displayName: profile!.displayName,
        bio: profile!.bio || "",
      } as ProfileFormValues),
    [profile]
  );

  function handleProfileEditSubmit(values: ProfileFormValues) {
    updateProfile({ displayName: values.displayName, bio: values.bio || null })
      .then(() => {
        setEditProfileMode(false);
      })
      .catch(console.error);
  }
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            content={`About ${profile!.displayName}`}
            icon="user"
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </Grid.Column>
        {profile!.bio && !editProfileMode && (
          <Grid.Column width={16}>
            <div style={{ whiteSpace: "pre-wrap" }}>{profile!.bio}</div>
          </Grid.Column>
        )}

        {isCurrentUser && editProfileMode && (
          <Grid.Column width={16}>
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                displayName: Yup.string().required(),
                bio: Yup.string().nullable(),
              })}
              onSubmit={(values) => handleProfileEditSubmit(values)}
            >
              {({ isSubmitting, isValid, dirty, handleSubmit }) => (
                <Form
                  className="ui form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <MyTextInput name="displayName" placeholder="Display Name" />
                  <MyTextArea name="bio" placeholder="Add your bio" rows={4} />
                  <Button
                    positive
                    color="green"
                    loading={isSubmitting}
                    type="submit"
                    content="Update profile"
                    floated="right"
                    disabled={isSubmitting || !isValid || !dirty}
                  />
                </Form>
              )}
            </Formik>
          </Grid.Column>
        )}
      </Grid>
    </Tab.Pane>
  );
});
