import * as yup from 'yup';

export const chatSchema = yup.object().shape({
    message: yup.string().required('*Required'),
});
