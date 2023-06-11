import {CommentView} from "lemmy-js-client";
import ILemmyComment from "./types/ILemmyComment";

class LemmyCommentsHelper {
    private readonly unparsedComments: CommentView[];
    private parsedComments: ILemmyComment[] = [];

    public constructor(comments: CommentView[]) {
        this.unparsedComments = comments.sort((a, b) => a.comment.path.localeCompare(b.comment.path));
    }

    public getParsed = (): ILemmyComment[]  => {
        this.parse();

        return this.parsedComments;
    };

    private parse = (): void => {
        for(const comment of this.unparsedComments) {
            const pathArr = comment.comment.path.split(".");

            if(pathArr[1] !== comment.comment.id.toString()) continue;

            const topComment: ILemmyComment = {
                top: comment,
                replies: []
            };

            this.addReplies(topComment);

            this.parsedComments.push(topComment);
        }
    };

    private addReplies = (lemmyComment: ILemmyComment): void => {
        const comments = this.unparsedComments.filter((x) => x.comment.path.startsWith(lemmyComment.top.comment.path));

        for(const comment of comments) {
            const pathArr = comment.comment.path.split(".");

            if(pathArr[pathArr.length - 2] !== lemmyComment.top.comment.id.toString()) continue;

            const newLemmyComment: ILemmyComment = {
                top: comment,
                replies: []
            };

            this.addReplies(newLemmyComment);

            lemmyComment.replies.push(newLemmyComment);
        }
    };
}

export default LemmyCommentsHelper;