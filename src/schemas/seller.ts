import * as yup from 'yup';

export const sellerProfileCreationSchema = yup.object().shape({
    name: yup.string().required('Input string name').max(25),
    description: yup
        .string()
        .required('Give us know about your slogan')
        .min(10)
        .max(30),
    biography: yup
        .string()
        .required('Fill your biography to recognize !')
        .min(10)
        .max(120),
});
