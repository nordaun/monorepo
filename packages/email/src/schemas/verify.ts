import config from "@repo/config";

type VerifySchema = {
  header: string;
  main: string;
  otp: string;
  footer: string;
};

/**
 * ## Verify Email
 * @description Creates an HTML markup that can be used in emails to display verification codes.
 * @param header The header of the email. (usually holds a greeting message).
 * @param main The main part of the email holding contents and the aim of the email.
 * @param otp The code that is displayed in the center of the email.
 * @param footer The footer of the email. (goodbye message without the signature).
 * @returns HTML document processable by emails.
 */
export default function VerifyEmail({
  header,
  main,
  otp,
  footer,
}: VerifySchema): string {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verification Email</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #eeeeeeff;
      font-family: Arial, sans-serif;
    "
  >
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #eeeeeeff; height: 100%"
    >
      <tr>
        <td align="center" style="padding: 20px 10px">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="
              max-width: 600px;
              background-color: #18181b;
              color: #eeeeeeff;
              border-radius: 4px;
            "
          >
            <tr>
              <td align="center" style="padding: 30px 40px 10px 40px">
                <img
                  src="${config.urls.cdn}/branding/banner.png"
                  alt="${config.name} Logo"
                  height="15"
                  style="display: block; margin: 0 auto"
                />
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px">
                <hr
                  style="
                    border: 0;
                    border-top: 1px solid #eeeeeeff;
                    margin: 20px 0;
                  "
                />
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 20px 40px; color: #eeeeeeff">
                <h1
                  style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold"
                >
                  ${header}
                </h1>
                <p
                  style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; text-align: justify"
                >
                  ${main}
                </p>
                <div
                  style="
                    font-size: 32px;
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                  "
                >
                  ${otp}
                </div>
                <p style="margin: 0; font-size: 16px">
                  ${footer}, <br /><strong>${config.name}</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
