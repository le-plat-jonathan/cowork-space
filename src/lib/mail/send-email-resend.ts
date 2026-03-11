import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";
import { resend } from "./resend";

type ResendSendType = typeof resend.emails.send;
type ResendParamsType = Parameters<ResendSendType>;
type ResendParamsTypeWithConditionalFrom = [
  payload: Omit<ResendParamsType[0], "from"> & { from?: string },
  options?: ResendParamsType[1],
];

export const sendEmail = async (
  ...params: ResendParamsTypeWithConditionalFrom
) => {
  if (process.env.NODE_ENV === "development") {
    params[0].subject = `[DEV] ${params[0].subject}`;
  }

  if (
    Array.isArray(params[0].to)
      ? params[0].to.some((to) => to.startsWith("playwright-test-"))
      : params[0].to.startsWith("playwright-test-")
  ) {
    logger.info("[sendEmail] Sending email to playwright-test", {
      subject: params[0].subject,
      to: params[0].to,
    });
    return {
      error: null,
      data: {
        id: nanoid(),
      },
    };
  }

  const resendParams = [
    {
      from: params[0].from ?? process.env.RESEND_EMAIL_FROM,
      ...params[0],
    } as ResendParamsType[0],
    params[1],
  ] satisfies ResendParamsType;

  const result = await resend.emails.send(...resendParams);

  if (result.error) {
    logger.error("[sendEmail] Error", { result, subject: params[0].subject });
  }

  return result;
};
