import { createTransport, Transporter } from 'nodemailer';
import { read } from 'xlsx';
import { MailPostDto } from './mail.post.model';

export class SmtpClient {
  private transport: Transporter;
  private readonly login: string;
  private readonly name: string;
  private readonly userId: string;

  public static fromMail(mail, userId: string): SmtpClient {
    return new SmtpClient(
      mail.host,
      mail.name,
      mail.mail,
      mail.password,
      userId,
    );
  }

  constructor(
    host: string,
    name: string,
    login: string,
    password: string,
    userId: string,
  ) {
    this.transport = createTransport({
      host: host,
      port: 465,
      secure: true,
      auth: {
        user: login,
        pass: password,
      },
    });
    this.login = login;
    this.name = name;
    this.userId = userId;
  }

  public async distributionFromDTO(
    fileBuffer,
    mailParams: MailPostDto,
    NotificationFunction,
  ): Promise<void> {
    const data = new Uint8Array(fileBuffer);
    const arr = [];
    for (let i = 0; i != data.length; ++i)
      arr[i] = String.fromCharCode(data[i]);
    const bstr = arr.join('');
    this.distribution(
      bstr,
      mailParams.mailText.replace('\n', '<br>\n').replace('}%', '}%\n'),
      mailParams.subject,
      NotificationFunction,
    ).then();
  }

  public async distribution(
    workbookFile: string,
    textFile: string,
    subjects: string,
    NotificationFunction,
  ): Promise<void> {
    const workbook = read(workbookFile, { type: 'binary' }); //Read workbook
    if (!workbook.SheetNames.includes('mails')) return; //Check sheet "mails"
    const sheet = workbook.Sheets['mails'];
    let maxChar = 0;
    const header = [];
    while (sheet[this.idOf(maxChar) + '1'] != undefined)
      header.push('%{' + sheet[this.idOf(maxChar++) + '1'].v + '}%'); //Get header
    maxChar--;
    const mailsListIndex = header.indexOf('%{mails}%');
    let row = 2;

    while (sheet[this.idOf(mailsListIndex) + row] != undefined) {
      //Check mails
      const mail = sheet[this.idOf(mailsListIndex) + row].v;
      let textHTML = textFile;

      const regArr = [...textHTML.matchAll(/%{.*}%/g)];
      for (const regEl of regArr) {
        const char = header.indexOf(regEl.toString());
        textHTML = textHTML.replace(
          regEl.toString(),
          sheet[this.idOf(char) + row].v,
        );
      }
      this.send(mail, subjects, textHTML)
        .then()
        .catch(() => {
          NotificationFunction({
            user: this.userId,
            name: 'Error at send mail',
            description: mail,
            status: 2,
          });
        });
      row++;
    }
  }

  private idOf(i) {
    return (
      (i >= 26 ? this.idOf(((i / 26) >> 0) - 1) : '') +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i % 26 >> 0]
    );
  }

  public async send(
    to: string,
    subject: string,
    textHTML: string,
  ): Promise<any> {
    return this.transport.sendMail({
      from: '"' + this.name + '" ' + this.login,
      to: to,
      bcc: this.login,
      subject: subject,
      html: textHTML,
    });
  }
}
