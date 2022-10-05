import * as yup from 'yup';
import 'yup-phone';
export const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

export const changeAvatarSchema = yup.object().shape({
    file: yup
        .mixed()
        .nullable()
        .required()
        .test('FILE SIZE', 'the file is too large', (value) => {
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

export const updateInfoSchema = yup.object().shape({
    organizationName: yup.string().required('*Required'),
    biography: yup.string().min(10).required('*Required'),
    dateOfBirth: yup.date().default(() => new Date()),
});

export const createAddress = yup.object().shape({
    receiverName: yup.string().required('*Required'),
    streetAddress: yup.string().required('*Required'),
    district: yup.string().nullable(),
    ward: yup.string().nullable(),
    city: yup.string().required('*Required'),
    zipcode: yup.string().nullable(),
    isDefault: yup.bool().default(false),
    createdAt: yup.date().default(() => new Date(new Date().toUTCString())),
    updatedAt: yup.date().default(() => new Date(new Date().toUTCString())),
    phoneNumber: yup.string().phone().required('*Required'),
    country: yup.string().required('*Required'),
});

export const updateAddress = yup.object().shape({
    receiverName: yup.string().required('*Required'),
    streetAddress: yup.string().required('*Required'),
    province: yup.string().nullable(),
    city: yup.string().required('*Required'),
    zipcode: yup.string().nullable(),
    isDefault: yup.bool().default(false),
    updatedAt: yup.date().default(() => new Date(new Date().toUTCString())),
    phoneNumber: yup.string().phone().required('*Required'),
    country: yup.string().required('*Required'),
});

export const preventSpecialCharacters = yup
    .string()
    .test(
        'SPECIAL CHARs',
        'This field cannot accept the special characters',
        (value) => {
            var regex = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
            if (!value) return true;
            return !regex.test(value);
        }
    );
