/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LeaderboardCreateFormInputValues = {
    name?: string;
};
export declare type LeaderboardCreateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LeaderboardCreateFormOverridesProps = {
    LeaderboardCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LeaderboardCreateFormProps = React.PropsWithChildren<{
    overrides?: LeaderboardCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LeaderboardCreateFormInputValues) => LeaderboardCreateFormInputValues;
    onSuccess?: (fields: LeaderboardCreateFormInputValues) => void;
    onError?: (fields: LeaderboardCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LeaderboardCreateFormInputValues) => LeaderboardCreateFormInputValues;
    onValidate?: LeaderboardCreateFormValidationValues;
} & React.CSSProperties>;
export default function LeaderboardCreateForm(props: LeaderboardCreateFormProps): React.ReactElement;
