import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Action } from 'src/constants/enum';
import { Role } from 'src/constants/enum';
import { File } from 'src/files/schemas/file.schema';
import { Follower } from 'src/followers/entities/follower.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/users/schemas/user.schema';

type Subjects =
  | InferSubjects<
      | typeof Bookmark
      | typeof File
      | typeof Follower
      | typeof Like
      | typeof Tweet
      | typeof User
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === Role.Admin) {
      // can(Action.Read, 'all'); // read access to everything
      // can(Action.Update, User, ['role']);
      // can(Action.Delete, 'all');
    } else {
      // can(Action.Read, 'all'); // read-only access to everything
    }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
