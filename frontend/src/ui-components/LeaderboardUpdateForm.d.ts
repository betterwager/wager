/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Leaderboard } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LeaderboardUpdateFormInputValues = {
    name?: string;
};
export declare type LeaderboardUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LeaderboardUpdateFormOverridesProps = {
    LeaderboardUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LeaderboardUpdateFormProps = React.PropsWithChildren<{
    overrides?: LeaderboardUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    leaderboard?: Leaderboard;
    onSubmit?: (fields: LeaderboardUpdateFormInputValues) => LeaderboardUpdateFormInputValues;
    onSuccess?: (fields: LeaderboardUpdateFormInputValues) => void;
    onError?: (fields: LeaderboardUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LeaderboardUpdateFormInputValues) => LeaderboardUpdateFormInputValues;
    onValidate?: LeaderboardUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LeaderboardUpdateForm(props: LeaderboardUpdateFormProps): React.ReactElement;
