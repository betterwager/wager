/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { User } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserUpdateFormInputValues = {
    email?: string;
    name?: string;
    birthdate?: string;
    phonenumber?: string;
    trustscore?: string;
    bettingscore?: string;
    bets?: string[];
    wallet?: string;
    leaderboards?: string;
};
export declare type UserUpdateFormValidationValues = {
    email?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    birthdate?: ValidationFunction<string>;
    phonenumber?: ValidationFunction<string>;
    trustscore?: ValidationFunction<string>;
    bettingscore?: ValidationFunction<string>;
    bets?: ValidationFunction<string>;
    wallet?: ValidationFunction<string>;
    leaderboards?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserUpdateFormOverridesProps = {
    UserUpdateFormGrid?: FormProps<GridProps>;
    email?: FormProps<TextFieldProps>;
    name?: FormProps<TextFieldProps>;
    birthdate?: FormProps<TextFieldProps>;
    phonenumber?: FormProps<TextFieldProps>;
    trustscore?: FormProps<TextFieldProps>;
    bettingscore?: FormProps<TextFieldProps>;
    bets?: FormProps<TextAreaFieldProps>;
    wallet?: FormProps<TextFieldProps>;
    leaderboards?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    user?: User;
    onSubmit?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onSuccess?: (fields: UserUpdateFormInputValues) => void;
    onError?: (fields: UserUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onValidate?: UserUpdateFormValidationValues;
}>;
export default function UserUpdateForm(props: UserUpdateFormProps): React.ReactElement;
