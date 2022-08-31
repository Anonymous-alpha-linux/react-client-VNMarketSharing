import * as yup from 'yup';
import { SelectCategoryValues } from '../pages/User';
import { PERMIT_FILE_FORMATS } from './user';

export const postProductSchema = yup.object().shape({
    name: yup.string().min(30).required(),
    price: yup.number().required().positive(),
    inventory: yup.number().required().positive().integer().moreThan(0),
    inPages: yup.boolean().default(false),
    description: yup
        .string()
        .required('Write some descriptions to suggest the knowing of product')
        .min(20),
    files: yup
        .array()
        .of(
            yup
                .mixed()
                .test('FILE SIZE', 'the upload files is too large', (value) => {
                    if (!value) {
                        return true;
                    }
                    return value.size <= 5 * 1024 * 1024;
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
                )
        )
        .min(3),
    categoryIds: yup
        .array()
        .min(1, 'Select product category')
        .test('test category ids', 'Select our suggested category', (value) => {
            if (Array.isArray(value) && value.length) {
                return !value[value?.length - 1]['subCategoryCount'];
            }
            return true;
        }),
    classifies: yup
        .array()
        .of(
            yup.object({
                name: yup.string().required('Required name').min(3),
                types: yup
                    .array()
                    .of(
                        yup
                            .string()
                            .required()
                            .min(
                                10,
                                'Give client know more about your classifies'
                            )
                    ),
            })
        )
        .max(2)
        .required(),
});

export const postProductClassifySchema = yup
    .array()
    .of(
        yup.object({
            name: yup.string().required('Required name').min(3),
            types: yup
                .array()
                .of(
                    yup
                        .string()
                        .required()
                        .min(10, 'Give client know more about your classifies')
                ),
        })
    )
    .max(2)
    .required();
