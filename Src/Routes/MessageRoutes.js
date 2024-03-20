import express from 'express';
let MessageRoutes = express.Router();
import { AuthenticationMiddleware } from '../Middleware';
import { MessageController } from '../Controller';

MessageRoutes.get(
    '/:chatId',
    AuthenticationMiddleware,
    MessageController.doFetchMessage
);

MessageRoutes.post(
    '/',
    AuthenticationMiddleware,
    MessageController.doSendMessage
);

export default MessageRoutes;
