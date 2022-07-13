import * as yup from 'yup';

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
    password: yup.string()
    .min(12)
    .required('*Required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('*password'), null], '*Password not match')
        .required('*Required'),
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
