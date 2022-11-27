import * as yup from 'yup';
import { PERMIT_FILE_FORMATS } from './user';

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('*Please enter a valid email')
        .required('*Required'),
    password: yup.string().required('*Required'),
});

export const registerSchema = yup.object().shape({
    email: yup
        .string()
        .email('*Please enter a valid email')
        .required('*Required'),
    password: yup.string().min(12).required('*Required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], '*Password not match')
        .required('*Required'),
});



export const registerWithUserSchema = yup.object().shape({
    account: yup.object().shape({
        email: yup
            .string()
            .email('*Please enter a valid email')
            .required('*Required'),
        password: yup.string().min(12).required('*Required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], '*Password not match')
            .required('*Required')
    }),
    organizationName: yup.string().required("*Required"),
    biography: yup.string().min(12).required(),
    dateOfBirth: yup.date().required(),
    image: yup.mixed()
        .nullable()
        .required()
        .test(
        'FILE SIZE', 
        'the file is too large', 
        (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test(
            'FILE FORMAT',
            `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
            (value) => {
                if (!value) {
                    return true;
                }
                return PERMIT_FILE_FORMATS.includes(value.type);
            }
        ),
});

export const sendEmailToChangePasswordSchema = yup.object().shape({
    email: yup
        .string()
        .email('*Please enter a valid email')
        .required('*Required'),
});

export const changePasswordSchema = yup.object().shape({
    email: yup.string().nullable(),
    token: yup.string().nullable(),
    password: yup.string().min(12).required('*Required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], '*Password not match')
        .required('*Required'),
});
