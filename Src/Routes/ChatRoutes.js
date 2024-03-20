import express from 'express';
let ChatRoutes = express.Router();
import { AuthenticationMiddleware } from '../Middleware';
import { ChatController } from '../Controller';

/* 
addChat
fetchChat
createGroupChat
renameGroup
removeFromGroup
addToGroup
*/

ChatRoutes.post(
    '/group',
    AuthenticationMiddleware,
    ChatController.createGroupChat
);
ChatRoutes.put(
    '/group/:id',
    AuthenticationMiddleware,
    ChatController.renameGroup
);
ChatRoutes.put(
    '/group/remove-member/:id',
    AuthenticationMiddleware,
    ChatController.removeFromGroup
);

ChatRoutes.put(
    '/group/add-member/:id',
    AuthenticationMiddleware,
    ChatController.addToGroup
);

ChatRoutes.get('/', AuthenticationMiddleware, ChatController.fetchChat);
ChatRoutes.post('/', AuthenticationMiddleware, ChatController.addChat);

export default ChatRoutes;
