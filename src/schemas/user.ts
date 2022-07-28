import * as yup from 'yup';

export const changeAvatarSchema = yup.object().shape({
    file: yup
        .mixed()
        .test(
            'file size',
            'the file is too large',
            (value: HTMLInputElement) => {
                if (!value.files) {
                    return true;
                }
                return value.files[0].size <= 5 * 1024 * 1024;
            }
        )
        .nullable(),
});

export const updateInfoSchema = yup.object().shape({
    organizationName: yup.string().required('*Required'),
    biography: yup.string().min(240).required('*Required'),
    dateOfBirth: yup.date().default(() => new Date()),
});
