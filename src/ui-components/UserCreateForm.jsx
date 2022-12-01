/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { User } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
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
}) {
  const { tokens } = useTheme();
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
      (currentFieldValue !== undefined ||
        currentFieldValue !== null ||
        currentFieldValue !== "") &&
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
  return (
    <React.Fragment>
      {isEditing && children}
      {!isEditing ? (
        <>
          <Text>{label}</Text>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
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
            color={tokens.colors.brand.primary[80]}
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
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
                {value.toString()}
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
}
export default function UserCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    email: undefined,
    name: undefined,
    birthdate: undefined,
    phonenumber: undefined,
    trustscore: undefined,
    bettingscore: undefined,
    bets: [],
    wallet: undefined,
    leaderboards: undefined,
  };
  const [email, setEmail] = React.useState(initialValues.email);
  const [name, setName] = React.useState(initialValues.name);
  const [birthdate, setBirthdate] = React.useState(initialValues.birthdate);
  const [phonenumber, setPhonenumber] = React.useState(
    initialValues.phonenumber
  );
  const [trustscore, setTrustscore] = React.useState(initialValues.trustscore);
  const [bettingscore, setBettingscore] = React.useState(
    initialValues.bettingscore
  );
  const [bets, setBets] = React.useState(
    initialValues.bets ? JSON.stringify(initialValues.bets) : undefined
  );
  const [wallet, setWallet] = React.useState(initialValues.wallet);
  const [leaderboards, setLeaderboards] = React.useState(
    initialValues.leaderboards
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setEmail(initialValues.email);
    setName(initialValues.name);
    setBirthdate(initialValues.birthdate);
    setPhonenumber(initialValues.phonenumber);
    setTrustscore(initialValues.trustscore);
    setBettingscore(initialValues.bettingscore);
    setBets(initialValues.bets);
    setCurrentBetsValue(undefined);
    setWallet(initialValues.wallet);
    setLeaderboards(initialValues.leaderboards);
    setErrors({});
  };
  const [currentBetsValue, setCurrentBetsValue] = React.useState(undefined);
  const betsRef = React.createRef();
  const validations = {
    email: [{ type: "Required" }, { type: "Email" }],
    name: [{ type: "Required" }],
    birthdate: [{ type: "Required" }],
    phonenumber: [{ type: "Required" }, { type: "Phone" }],
    trustscore: [{ type: "Required" }],
    bettingscore: [{ type: "Required" }],
    bets: [{ type: "Required" }, { type: "JSON" }],
    wallet: [{ type: "Required" }],
    leaderboards: [{ type: "Required" }],
  };
  const runValidationTasks = async (fieldName, value) => {
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
          email,
          name,
          birthdate,
          phonenumber,
          trustscore,
          bettingscore,
          bets,
          wallet,
          leaderboards,
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
          await DataStore.save(new User(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, "UserCreateForm")}
    >
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              bets,
              wallet,
              leaderboards,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name: value,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              bets,
              wallet,
              leaderboards,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name,
              birthdate: value,
              phonenumber,
              trustscore,
              bettingscore,
              bets,
              wallet,
              leaderboards,
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
        type="tel"
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name,
              birthdate,
              phonenumber: value,
              trustscore,
              bettingscore,
              bets,
              wallet,
              leaderboards,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name,
              birthdate,
              phonenumber,
              trustscore: value,
              bettingscore,
              bets,
              wallet,
              leaderboards,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore: value,
              bets,
              wallet,
              leaderboards,
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
              email,
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              bets: values,
              wallet,
              leaderboards,
            };
            const result = onChange(modelFields);
            values = result?.bets ?? values;
          }
          setBets(values);
          setCurrentBetsValue(undefined);
        }}
        currentFieldValue={currentBetsValue}
        label={"Bets"}
        items={bets}
        hasError={errors.bets?.hasError}
        setFieldValue={setCurrentBetsValue}
        inputFieldRef={betsRef}
        defaultFieldValue={undefined}
      >
        <TextAreaField
          label="Bets"
          isRequired={true}
          isReadOnly={false}
          value={currentBetsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.bets?.hasError) {
              runValidationTasks("bets", value);
            }
            setCurrentBetsValue(value);
          }}
          onBlur={() => runValidationTasks("bets", currentBetsValue)}
          errorMessage={errors.bets?.errorMessage}
          hasError={errors.bets?.hasError}
          ref={betsRef}
          {...getOverrideProps(overrides, "bets")}
        ></TextAreaField>
      </ArrayField>
      <TextField
        label="Wallet"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              bets,
              wallet: value,
              leaderboards,
            };
            const result = onChange(modelFields);
            value = result?.wallet ?? value;
          }
          if (errors.wallet?.hasError) {
            runValidationTasks("wallet", value);
          }
          setWallet(value);
        }}
        onBlur={() => runValidationTasks("wallet", wallet)}
        errorMessage={errors.wallet?.errorMessage}
        hasError={errors.wallet?.hasError}
        {...getOverrideProps(overrides, "wallet")}
      ></TextField>
      <TextField
        label="Leaderboards"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              name,
              birthdate,
              phonenumber,
              trustscore,
              bettingscore,
              bets,
              wallet,
              leaderboards: value,
            };
            const result = onChange(modelFields);
            value = result?.leaderboards ?? value;
          }
          if (errors.leaderboards?.hasError) {
            runValidationTasks("leaderboards", value);
          }
          setLeaderboards(value);
        }}
        onBlur={() => runValidationTasks("leaderboards", leaderboards)}
        errorMessage={errors.leaderboards?.errorMessage}
        hasError={errors.leaderboards?.hasError}
        {...getOverrideProps(overrides, "leaderboards")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex {...getOverrideProps(overrides, "RightAlignCTASubFlex")}>
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, "CancelButton")}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
