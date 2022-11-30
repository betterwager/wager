/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LeaderboardCreateFormInputValues = {
    users?: string[];
};
export declare type LeaderboardCreateFormValidationValues = {
    users?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LeaderboardCreateFormOverridesProps = {
    LeaderboardCreateFormGrid?: FormProps<GridProps>;
    users?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LeaderboardCreateFormProps = React.PropsWithChildren<{
    overrides?: LeaderboardCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LeaderboardCreateFormInputValues) => LeaderboardCreateFormInputValues;
    onSuccess?: (fields: LeaderboardCreateFormInputValues) => void;
    onError?: (fields: LeaderboardCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: LeaderboardCreateFormInputValues) => LeaderboardCreateFormInputValues;
    onValidate?: LeaderboardCreateFormValidationValues;
}>;
export default function LeaderboardCreateForm(props: LeaderboardCreateFormProps): React.ReactElement;
