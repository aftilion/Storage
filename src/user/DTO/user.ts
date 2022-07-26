import { getAuth } from 'firebase/auth';
import { PrismaService } from '../../prisma/prisma.service';

export class User {
  public photoURL: string;
  public email: string;
  public name: string;
  private _isValid: boolean;
  public readonly uid: string;
  private static prismaService: PrismaService;

  public static async initialize(): Promise<User> {
    if (this.prismaService === undefined)
      this.prismaService = new PrismaService();
    const auth = getAuth();
    if (auth.currentUser === null) return new User('0');
    const user = new User(auth.currentUser.uid);
    user._isValid = false;
    user.email = auth.currentUser.email;
    user.photoURL = auth.currentUser.photoURL ?? '/img/pic.jpg';

    const dbUser = await this.prismaService.user.findUnique({
      where: {
        uid: auth.currentUser.uid,
      },
    });
    if (dbUser === null) return user;
    user.name = dbUser.name;

    user._isValid = !dbUser.isFrozen;
    user._isValid = true;
    return user;
  }

  private constructor(uid: string) {
    this.uid = uid;
  }

  public async containsPermission(permission: string): Promise<boolean> {
    const dbPermission = await User.prismaService.permission.findFirst({
      where: {
        name: permission,
        roles: {
          some: {
            users: {
              some: {
                uid: this.uid,
              },
            },
          },
        },
      },
    });
    return dbPermission != null;
  }

  public get isValid() {
    return this._isValid;
  }
}
