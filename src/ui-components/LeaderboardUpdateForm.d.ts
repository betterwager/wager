/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Leaderboard } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LeaderboardUpdateFormInputValues = {
    users?: string[];
};
export declare type LeaderboardUpdateFormValidationValues = {
    users?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LeaderboardUpdateFormOverridesProps = {
    LeaderboardUpdateFormGrid?: FormProps<GridProps>;
    users?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LeaderboardUpdateFormProps = React.PropsWithChildren<{
    overrides?: LeaderboardUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    leaderboard?: Leaderboard;
    onSubmit?: (fields: LeaderboardUpdateFormInputValues) => LeaderboardUpdateFormInputValues;
    onSuccess?: (fields: LeaderboardUpdateFormInputValues) => void;
    onError?: (fields: LeaderboardUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: LeaderboardUpdateFormInputValues) => LeaderboardUpdateFormInputValues;
    onValidate?: LeaderboardUpdateFormValidationValues;
}>;
export default function LeaderboardUpdateForm(props: LeaderboardUpdateFormProps): React.ReactElement;
