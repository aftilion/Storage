import { UserLoginDto } from './models/user.login.model';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export class LoginService {
  async loginPost(user: UserLoginDto, res) {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, user.username, user.password);
      res.redirect('/');
      return;
    } catch {
      res.status(403).render('user/login');
      return;
    }
  }

  async logout(res) {
    const auth = getAuth();
    try {
      await signOut(auth);
      res.redirect('/login');
    } catch {
      res.redirect('/');
    }
  }

  async invite(link, params, linkInfo, prismaService, res) {
    const auth = getAuth();
    try {
      console.log(params);
      const credential = await createUserWithEmailAndPassword(
        auth,
        params.login,
        params.password,
      );
      const user = credential.user;
      await prismaService.user.create({
        data: {
          uid: user.uid,
          name: linkInfo.name,
        },
      });
      await prismaService.inviteLink.delete({
        where: {
          link: linkInfo.link,
        },
      });
      res.redirect('/');
    } catch (e) {
      res.render('user/invite', {
        link: linkInfo,
      });
    }
  }
}
