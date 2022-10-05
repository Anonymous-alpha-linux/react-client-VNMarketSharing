import * as yup from 'yup';
import moment from 'moment';
import { InvoiceCreationDTO } from '../models';

export const invoiceCreationSchema = yup.lazy((value: InvoiceCreationDTO) => {
    if (value.shipping === 'online') {
        return yup.object().shape({
            cashAmount: yup
                .number()
                .moreThan(20000, 'Your item value is too small')
                .positive('This field value must be positive'),
            shipping: yup.string().required().defined(),
            orders: yup
                .array()
                .of(
                    yup.object().shape({
                        buyerFullName: yup.string().required(),
                        description: yup.string().required(),
                        amount: yup.number().integer().positive(),
                        createdAt: yup
                            .string()
                            .default(() =>
                                moment(new Date())
                                    .locale('vn')
                                    .format('YYYY/MM/DD HH:mm:ss')
                            ),
                        expireTime: yup
                            .string()
                            .default(() =>
                                moment(new Date())
                                    .locale('vn')
                                    .add(1, 'day')
                                    .format('YYYY/MM/DD HH:mm:ss')
                            ),
                        productId: yup.number().required(),
                        buyerId: yup.number().required(),
                        merchantId: yup.number().required(),
                        addressId: yup.number().required(),
                    })
                )
                .nullable(),
            paymentId: yup.number().notRequired(),
            payment: yup
                .object()
                .shape({
                    createdAt: yup
                        .string()
                        .default(() =>
                            moment(new Date())
                                .locale('vn')
                                .format('YYYY/MM/DD HH:mm:ss')
                        ),
                    expireTime: yup
                        .string()
                        .default(() =>
                            moment(new Date())
                                .locale('vn')
                                .add(1, 'day')
                                .format('YYYY/MM/DD HH:mm:ss')
                        ),
                    bankCode: yup.string().required('Select your bank card'),
                    cardNumber: yup.string().notRequired(),
                })
                .notRequired()
                .nullable(),
        });
    }
    return yup.object().shape({
        cashAmount: yup
            .number()
            .moreThan(20000, 'Your item value is too small')
            .positive('This field value must be positive'),
        shipping: yup.string().required().defined(),
        orders: yup
            .array()
            .of(
                yup.object().shape({
                    buyerFullName: yup.string().required(),
                    description: yup.string().required(),
                    amount: yup.number().integer().positive(),
                    createdAt: yup.string().required(),
                    expireTime: yup.string().required(),
                    productId: yup.number().required(),
                    buyerId: yup.number().required(),
                    merchantId: yup.number().required(),
                    addressId: yup.number().required(),
                })
            )
            .nullable(),
        paymentId: yup.number().default(() => undefined),
        payment: yup.object().default(() => undefined),
    });
});

export const orderCreationSchema = yup.object().shape({
    buyerFullName: yup.string().required(),
    description: yup.string().required(),
    amount: yup.number().integer().positive(),
    price: yup.number().moreThan(20000),
    createdAt: yup.string().required(),
    expireTime: yup.string().required(),
    productId: yup.number().required(),
    buyerId: yup.number().required(),
    merchantId: yup.number().required(),
    addressId: yup.number().required(),
});

export const paymentCreationSchema = yup.object().shape({
    createdAt: yup.string().required(),
    expireTime: yup.string().required(),
    bankCode: yup.string().notRequired(),
    cardNumber: yup.string().notRequired(),
    userId: yup.number().required(),
});
