import { UserModel } from '../Models';
import ChatModel from '../Models/ChatModel';
import MessageModel from '../Models/MessageModel';
import { ErrorHandler, SuccessHandler } from '../Services';

const MessageController = {
    async doSendMessage(req, res, next) {
        try {
            const { content, chatId } = req.body;
            if (!content || !chatId) {
                return next(
                    new ErrorHandler.serverError('Please fill all details')
                );
            }

            let payload = {
                sender: req.user._id,
                content: content,
                chat: chatId,
            };
            let response = await MessageModel.create(payload);
            let doFindRecord = await MessageModel.findOne({
                _id: response._id,
            })
                .populate('sender', 'name email')
                .populate('chat', 'users chatName isGroupChat');
            // response = await response
            //     .populate('sender', 'name email')
            //     .execPopulate();

            // response = await response.populate('chat').execPopulate();
            response = await UserModel.populate(doFindRecord, {
                path: 'chat.users',
                select: 'name email',
            });

            await ChatModel.findByIdAndUpdate(req.body.chatId, {
                latestMessage: response,
            });

            SuccessHandler(
                200,
                response,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(err));
        }
    },

    async doFetchMessage(req, res, next) {
        try {
            const message = await MessageModel.find({
                chat: req.params.chatId,
            })
                .populate('sender', 'name email')
                .populate('chat', 'users chatName isGroupChat');
            SuccessHandler(
                200,
                message,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(err));
        }
    },
};

export default MessageController;
