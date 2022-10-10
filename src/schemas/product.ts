import * as yup from 'yup';
import { PERMIT_FILE_FORMATS } from './user';

export const postProductSchema = yup.object().shape({
    name: yup.string().min(10).required(),
    price: yup.number().required().positive(),
    inventory: yup.number().required().positive().integer().default(1),
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
                    return value.size <= 3 * 1024 * 1024;
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
        .min(3, 'Upload more than 3 images to overview')
        .max(8, 'File collection should be less than 8 images')
        .test(
            'FILE FORM LIMIT',
            'the collection of files are too large, can you help us to remove some file',
            (value) => {
                if (!value) {
                    return true;
                }
                return value.reduce((t, f) => t + f.size / 1024 / 1024, 0) < 3;
            }
        ),
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
                name: yup.string().required('Required name'),
                types: yup
                    .array()
                    .of(yup.string().required('Required type name')),
            })
        )
        .required('Specify your classify types')
        .max(2),
    classifyDetails: yup
        .array()
        .of(
            yup.object({
                price: yup
                    .number()
                    .min(2000, 'value must be greater than 2000'),
                inventory: yup.number().min(1, 'value must be larger than 1'),
                image: yup
                    .mixed()
                    .nullable()
                    .test(
                        'FILE SIZE',
                        'the upload files is too large',
                        (value) => {
                            if (!value) {
                                return true;
                            }
                            return value.size <= 5 * 1024 * 1024;
                        }
                    )
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
            })
        )
        .test(
            'IMAGES ARE BIG',
            'Your upload files are so huge, Can you help us to remove some images or select anothers',
            (value) => {
                if (!value) {
                    return true;
                }
                return (
                    value
                        .map((v) => v.image)
                        .reduce((p, c) => {
                            return !!c ? p + c.size : p;
                        }, 0) /
                        1024 /
                        1024 <
                    2
                );
            }
        ),
});

export const postProductClassifyDetail = yup.array().of(
    yup.object({
        price: yup.number().min(2000, 'value must be greater than 2000'),
        inventory: yup.number().min(1, 'value must be larger than 1'),
    })
);

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

export const reviewProductSchema = yup.object().shape({
    rate: yup
        .number()
        .moreThan(0)
        .lessThan(6)
        .required('Please rate our product'),
    name: yup.string().max(20).required(),
    subject: yup.string().max(20).required(),
    comment: yup.string().min(12).max(350).required(),
    userId: yup.number().required(),
    productId: yup.number().required(),
});
