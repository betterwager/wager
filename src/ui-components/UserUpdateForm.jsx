/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { User } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function UserUpdateForm(props) {
  const {
    id: idProp,
    user: userModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    birthdate: "",
    phonenumber: "",
    trustscore: "",
    bettingscore: "",
    friends: [],
    requests: [],
  };
  const [name, setName] = React.useState(initialValues.name);
  const [birthdate, setBirthdate] = React.useState(initialValues.birthdate);
  const [phonenumber, setPhonenumber] = React.useState(
    initialValues.phonenumber
  );
  const [trustscore, setTrustscore] = React.useState(initialValues.trustscore);
  const [bettingscore, setBettingscore] = React.useState(
    initialValues.bettingscore
  );
  const [friends, setFriends] = React.useState(initialValues.friends);
  const [requests, setRequests] = React.useState(initialValues.requests);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userRecord
      ? { ...initialValues, ...userRecord }
      : initialValues;
    setName(cleanValues.name);
    setBirthdate(cleanValues.birthdate);
    setPhonenumber(cleanValues.phonenumber);
    setTrustscore(cleanValues.trustscore);
    setBettingscore(cleanValues.bettingscore);
    setFriends(cleanValues.friends ?? []);
    setCurrentFriendsValue("");
    setRequests(cleanValues.requests ?? []);
    setCurrentRequestsValue("");
    setErrors({});
  };
  const [userRecord, setUserRecord] = React.useState(userModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(User, idProp)
        : userModelProp;
      setUserRecord(record);
    };
    queryData();
  }, [idProp, userModelProp]);
  React.useEffect(resetStateValues, [userRecord]);
  const [currentFriendsValue, setCurrentFriendsValue] = React.useState("");
  const friendsRef = React.createRef();
  const [currentRequestsValue, setCurrentRequestsValue] = React.useState("");
  const requestsRef = React.createRef();
  const validations = {
    name: [{ type: "Required" }],
    birthdate: [{ type: "Required" }],
    phonenumber: [{ type: "Required" }],
    trustscore: [{ type: "Required" }],
    bettingscore: [{ type: "Required" }],
    friends: [{ type: "Required" }],
    requests: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          birthdate,
          phonenumber,
          trustscore,
          bettingscore,
          friends,
          requests,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            User.copyOf(userRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              friends,
              requests,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Birthdate"
        isRequired={true}
        isReadOnly={false}
        type="date"
        value={birthdate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              birthdate: value,
              phonenumber,
              trustscore,
              bettingscore,
              friends,
              requests,
            };
            const result = onChange(modelFields);
            value = result?.birthdate ?? value;
          }
          if (errors.birthdate?.hasError) {
            runValidationTasks("birthdate", value);
          }
          setBirthdate(value);
        }}
        onBlur={() => runValidationTasks("birthdate", birthdate)}
        errorMessage={errors.birthdate?.errorMessage}
        hasError={errors.birthdate?.hasError}
        {...getOverrideProps(overrides, "birthdate")}
      ></TextField>
      <TextField
        label="Phonenumber"
        isRequired={true}
        isReadOnly={false}
        value={phonenumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              birthdate,
              phonenumber: value,
              trustscore,
              bettingscore,
              friends,
              requests,
            };
            const result = onChange(modelFields);
            value = result?.phonenumber ?? value;
          }
          if (errors.phonenumber?.hasError) {
            runValidationTasks("phonenumber", value);
          }
          setPhonenumber(value);
        }}
        onBlur={() => runValidationTasks("phonenumber", phonenumber)}
        errorMessage={errors.phonenumber?.errorMessage}
        hasError={errors.phonenumber?.hasError}
        {...getOverrideProps(overrides, "phonenumber")}
      ></TextField>
      <TextField
        label="Trustscore"
        isRequired={true}
        isReadOnly={false}
        value={trustscore}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              birthdate,
              phonenumber,
              trustscore: value,
              bettingscore,
              friends,
              requests,
            };
            const result = onChange(modelFields);
            value = result?.trustscore ?? value;
          }
          if (errors.trustscore?.hasError) {
            runValidationTasks("trustscore", value);
          }
          setTrustscore(value);
        }}
        onBlur={() => runValidationTasks("trustscore", trustscore)}
        errorMessage={errors.trustscore?.errorMessage}
        hasError={errors.trustscore?.hasError}
        {...getOverrideProps(overrides, "trustscore")}
      ></TextField>
      <TextField
        label="Bettingscore"
        isRequired={true}
        isReadOnly={false}
        value={bettingscore}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore: value,
              friends,
              requests,
            };
            const result = onChange(modelFields);
            value = result?.bettingscore ?? value;
          }
          if (errors.bettingscore?.hasError) {
            runValidationTasks("bettingscore", value);
          }
          setBettingscore(value);
        }}
        onBlur={() => runValidationTasks("bettingscore", bettingscore)}
        errorMessage={errors.bettingscore?.errorMessage}
        hasError={errors.bettingscore?.hasError}
        {...getOverrideProps(overrides, "bettingscore")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              friends: values,
              requests,
            };
            const result = onChange(modelFields);
            values = result?.friends ?? values;
          }
          setFriends(values);
          setCurrentFriendsValue("");
        }}
        currentFieldValue={currentFriendsValue}
        label={"Friends"}
        items={friends}
        hasError={errors?.friends?.hasError}
        errorMessage={errors?.friends?.errorMessage}
        setFieldValue={setCurrentFriendsValue}
        inputFieldRef={friendsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Friends"
          isRequired={true}
          isReadOnly={false}
          value={currentFriendsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.friends?.hasError) {
              runValidationTasks("friends", value);
            }
            setCurrentFriendsValue(value);
          }}
          onBlur={() => runValidationTasks("friends", currentFriendsValue)}
          errorMessage={errors.friends?.errorMessage}
          hasError={errors.friends?.hasError}
          ref={friendsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "friends")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              friends,
              requests: values,
            };
            const result = onChange(modelFields);
            values = result?.requests ?? values;
          }
          setRequests(values);
          setCurrentRequestsValue("");
        }}
        currentFieldValue={currentRequestsValue}
        label={"Requests"}
        items={requests}
        hasError={errors?.requests?.hasError}
        errorMessage={errors?.requests?.errorMessage}
        setFieldValue={setCurrentRequestsValue}
        inputFieldRef={requestsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Requests"
          isRequired={true}
          isReadOnly={false}
          value={currentRequestsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.requests?.hasError) {
              runValidationTasks("requests", value);
            }
            setCurrentRequestsValue(value);
          }}
          onBlur={() => runValidationTasks("requests", currentRequestsValue)}
          errorMessage={errors.requests?.errorMessage}
          hasError={errors.requests?.hasError}
          ref={requestsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "requests")}
        ></TextField>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || userModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || userModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
