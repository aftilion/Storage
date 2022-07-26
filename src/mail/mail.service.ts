import { SmtpClient } from './models/SmtpClient';

export class MailsService {
  async mailPost(mailParams, user, file, prismaService, notificationGateway) {
    const mail = await prismaService.mail.findUnique({
      where: {
        id: +mailParams.mail,
      },
    });
    if (file === undefined) {
      return {
        mails: await prismaService.mail.findMany(),
        user,
        message: 'bad file',
      };
    }
    await SmtpClient.fromMail(mail, user.uid).distributionFromDTO(
      file.buffer,
      mailParams,
      notificationGateway.addNotification,
    );
  }
}
