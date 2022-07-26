import {
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { BadRequestException } from '@nestjs/common';

export class UserService {
  async changeEmail(mails) {
    if (mails.newEmail != mails.reNewEmail) return;
    else {
      try {
        console.log(mails.newEmail);
        await updateEmail(getAuth().currentUser, mails.newEmail);
        console.log(222);
        return;
      } catch {
        return;
      }
    }
  }

  async changePassword(user, pass) {
    if (pass.newPassword != pass.reNewPassword) return;
    else {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(
          auth,
          auth.currentUser.email,
          pass.oldPassword,
        );
        await updatePassword(getAuth().currentUser, pass.newPassword);
        return;
      } catch (error) {
        return;
      }
    }
  }

  private generateLink() {
    let res = '';
    const availableChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 10; i++) {
      res +=
        availableChar[Math.floor(Math.random() * (availableChar.length - 1))];
    }
    return res;
  }

  async addLink(name: string, prismaService) {
    try {
      await prismaService.inviteLink.create({
        data: {
          link: this.generateLink(),
          name: name,
        },
      });
      return;
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteLink(link: string, prismaService) {
    try {
      await prismaService.inviteLink.delete({
        where: {
          link: link,
        },
      });
      return;
    } catch {
      throw new BadRequestException();
    }
  }

  async editUser(id, user, prismaService) {
    try {
      if (user.name !== undefined)
        await prismaService.user.update({
          where: {
            uid: id,
          },
          data: {
            name: user.name,
          },
        });
      if (user.isFrozen !== undefined)
        await prismaService.user.update({
          where: {
            uid: id,
          },
          data: {
            isFrozen: Boolean(user.isFrozen),
          },
        });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async removeUser(id, prismaService) {
    await prismaService.user.delete({
      where: {
        uid: id,
      },
    });
    await deleteUser(getAuth().currentUser);
  }
}
