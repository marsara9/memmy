import { HStack, useTheme } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconBookmark,
  IconMessagePlus,
  IconShare2,
} from "tabler-icons-react-native";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { shareLink } from "../../../helpers/ShareHelper";
import { setResponseTo } from "../../../slices/comments/newCommentSlice";
import { useAppDispatch } from "../../../store";
import { UsePost } from "../../hooks/post/postHooks";
import IconButtonWithText from "../common/IconButtonWithText";
import VoteButton from "../common/VoteButton";

interface IProps {
  post: UsePost;
}

function PostActionBar({ post }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const onCommentPress = () => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post: post.currentPost,
        languageId: post.currentPost.post.language_id,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    onGenericHapticFeedback();

    shareLink({
      link: post.currentPost.post.ap_id,
      title: post.currentPost.post.name,
    });
  };

  const onUpvotePress = () => {
    post.doVote(1);
  };

  const onDownvotePress = () => {
    post.doVote(-1);
  };

  const isUpvoted = post.currentPost?.my_vote === 1;
  const isDownvoted = post.currentPost?.my_vote === -1;

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <HStack
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      mx={4}
      py={1}
    >
      <VoteButton
        onPressHandler={onUpvotePress}
        type="upvote"
        isVoted={isUpvoted}
        text={
          post.currentPost.my_vote === 1
            ? post.currentPost.counts.upvotes + 1
            : post.currentPost.counts.upvotes
        }
        isAccented
      />

      <VoteButton
        onPressHandler={onDownvotePress}
        type="downvote"
        isVoted={isDownvoted}
        text={
          post.currentPost.my_vote === -1
            ? post.currentPost.counts.downvotes + 1
            : post.currentPost.counts.downvotes
        }
        isAccented
      />

      <IconButtonWithText
        onPressHandler={post.doSave}
        icon={
          <IconBookmark
            size={25}
            color={
              post.currentPost.saved
                ? colors.app.bookmarkText
                : colors.app.accent
            }
          />
        }
        iconBgColor={
          post.currentPost.saved ? colors.app.bookmark : "transparent"
        }
      />

      <IconButtonWithText
        onPressHandler={onCommentPress}
        icon={<IconMessagePlus color={colors.app.accent} size={25} />}
      />

      <IconButtonWithText
        icon={<IconShare2 size={25} color={colors.app.accent} />}
        onPressHandler={onSharePress}
      />
    </HStack>
  );
}

export default PostActionBar;