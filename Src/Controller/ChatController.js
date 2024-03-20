import { UserModel } from '../Models';
import ChatModel from '../Models/ChatModel';
import { ErrorHandler, SuccessHandler } from '../Services';

const ChatController = {
    async addChat(req, res, next) {
        try {
            const { userId } = req.body;
            if (!userId) {
                throw next(ErrorHandler.serverError('User Id is missing'));
            }
            let isChat = await ChatModel.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: req.user._id } } },
                    { users: { $elemMatch: { $eq: userId } } },
                ],
            })
                .populate('users', 'name email profile_img')
                .populate('latestMessage');

            isChat = await UserModel.populate(isChat, {
                path: 'latestMessage.sender',
                select: 'name email profile_img',
            });

            if (isChat.length > 0) {
                SuccessHandler(
                    200,
                    isChat[0],
                    'User Details Display Successfully',
                    res
                );
            } else {
                let chatData = await ChatModel.create({
                    chatName: 'private',
                    isGroupChat: false,
                    users: [req.user._id, userId],
                });
                const fullChat = await ChatModel.findOne({
                    _id: chatData._id,
                }).populate('users', 'name email profile_img');

                SuccessHandler(
                    200,
                    fullChat,
                    'User Details Display Successfully',
                    res
                );
            }
        } catch (err) {
            return next(ErrorHandler.serverError(err));
        }
    },

    async fetchChat(req, res, next) {
        try {
            const doFindChatOfUser = await ChatModel.find({
                users: { $elemMatch: { $eq: req.user._id } },
            })
                .populate('users', 'name email profile_img')
                .populate('groupAdmin', 'name email profile_img')
                .populate('latestMessage')
                .sort({ updatedAt: -1 });

            let populatedRecord = await UserModel.populate(doFindChatOfUser, {
                path: 'latestMessage.sender',
                select: 'name email profile_img',
            });

            SuccessHandler(
                200,
                populatedRecord,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(err));
        }
    },
    async createGroupChat(req, res, next) {
        try {
            if (!req.body.name || !req.body.users) {
                return next(
                    ErrorHandler.serverError('Please fill all details')
                );
            }

            const doCheckGroupExist = await ChatModel.findOne({
                chatName: req.body.name,
                groupAdmin: req.user._id,
            });

            if (doCheckGroupExist) {
                return next(ErrorHandler.alreadyExist('Group Already Exists'));
            }

            let users = JSON.parse(req.body.users);

            if (users.length < 2) {
                return next(
                    ErrorHandler.serverError(
                        'More then 2 user required to create group'
                    )
                );
            }

            users.push(req.user);
            const groupChat = await ChatModel.create({
                chatName: req.body.name,
                users,
                isGroupChat: true,
                groupAdmin: req.user,
            });

            const fullGroupChat = await ChatModel.findOne({
                _id: groupChat._id,
            })
                .populate('users', 'name email profile_img.url')
                .populate('groupAdmin', 'name email profile_img.url');

            SuccessHandler(
                200,
                fullGroupChat,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(err));
        }
    },
    async renameGroup(req, res, next) {
        try {
            const doChangeGroupName = await ChatModel.findByIdAndUpdate(
                req.params.id,
                { chatName: req.body.newGroupName },
                { new: true }
            )
                .populate('users', 'name email profile_img.url')
                .populate('groupAdmin', 'name email profile_img.url');

            SuccessHandler(
                200,
                doChangeGroupName,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(error));
        }
    },
    async removeFromGroup(req, res, next) {
        try {
            const doRemoveMembers = await ChatModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { users: req.body.userId },
                },
                { new: true }
            );
            SuccessHandler(
                200,
                doRemoveMembers,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(error));
        }
    },
    async addToGroup(req, res, next) {
        try {
            const doAddMember = await ChatModel.findByIdAndUpdate(
                req.params.id,
                {
                    $push: { users: req.body.userId },
                },
                { new: true }
            );
            SuccessHandler(
                200,
                doAddMember,
                'User Details Display Successfully',
                res
            );
        } catch (err) {
            return next(ErrorHandler.serverError(err));
        }
    },
};

export default ChatController;
