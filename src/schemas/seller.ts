import { PhoneNumberUtil } from 'google-libphonenumber';
import * as yup from 'yup';
import { PERMIT_FILE_FORMATS } from './user';

export const sellerProfileCreationSchema = yup.object().shape({
    name: yup.string().required('Input string name').max(25),
    phone: yup.string().test({
        name: 'phone number',
        exclusive: true,
        message: 'this field must be in phone number format',
        test: (value) => {
            let phoneUtil = PhoneNumberUtil.getInstance();
            try{
                let userPhoneNumber = phoneUtil.parse(value);

                return phoneUtil.isValidNumber(userPhoneNumber);
            }
            catch(e: any){
                return false;
            }
        },
    }).required('*Required'),
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
export const sellerChangeAvatar = yup.object().shape({
    avatar: yup
        .mixed()
        .nullable()
        .notRequired()
        .test('FILE SIZE', 'the file is too large', (value) => {
            if (!value) {
                return true;
            }
            console.log(value);
            console.log(value.size <= 2 * 1024 * 1024);

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
    banner: yup
        .mixed()
        .nullable()
        .notRequired()
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
