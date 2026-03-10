import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetLink: string;
  username?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const ResetPasswordEmail = ({
  resetLink,
  username,
}: ResetPasswordEmailProps) => {
  const previewText = "Réinitialisez votre mot de passe - Cowork";

  return (
    <Html>
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/logo.svg`}
                width="120"
                height="40"
                alt="Cowork"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Réinitialiser votre mot de passe
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Bonjour{username ? ` ${username}` : ""},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Vous avez demandé à réinitialiser le mot de passe de votre compte
              Cowork. Cliquez sur le bouton ci-dessous pour procéder.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#409F66] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={resetLink}
              >
                Réinitialiser mon mot de passe
              </Button>
            </Section>

            <Text className="mt-[24px] text-[12px] leading-[20px] text-[#666666]">
              Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous
              pouvez ignorer cet email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  resetLink: "https://cowork.example.com/reset-password?token=xxx",
  username: "Jean",
} satisfies ResetPasswordEmailProps;

export default ResetPasswordEmail;
