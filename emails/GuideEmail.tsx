import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Section,
  Preview,
} from "@react-email/components";

type Props = {
  firstName: string;
  guideUrl: string;
};

export function GuideEmail({ firstName, guideUrl }: Props) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your free guide is ready — download it here</Preview>
      <Body
        style={{
          backgroundColor: "#f5f3ff",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(124,58,237,0.10)",
          }}
        >
          {/* Header bar */}
          <Section
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              padding: "28px 32px",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              EzwebOne
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ padding: "32px 32px 24px" }}>
            <Heading
              as="h2"
              style={{
                color: "#1c2a44",
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 12px",
              }}
            >
              Hi {firstName}, your guide is ready 🎉
            </Heading>

            <Text style={{ color: "#4b5563", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
              Thanks for downloading the guide — we hope it gives you real clarity on how to grow your UK business online.
            </Text>

            <Section style={{ textAlign: "center", margin: "0 0 28px" }}>
              <Button
                href={guideUrl}
                style={{
                  backgroundColor: "#f97316",
                  color: "#ffffff",
                  padding: "14px 32px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: "0 8px 24px rgba(249,115,22,0.30)",
                }}
              >
                Download Your Free Guide
              </Button>
            </Section>

            <Text style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 8px" }}>
              If the button doesn&apos;t work, copy and paste this link into your browser:
            </Text>
            <Text style={{ color: "#7c3aed", fontSize: 13, wordBreak: "break-all", margin: 0 }}>
              {guideUrl}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e9d5ff", margin: "0 32px" }} />

          {/* CTA */}
          <Section style={{ padding: "24px 32px" }}>
            <Text style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>
              Have questions or want to talk through your situation? Book a free 20-min call — no pressure, no obligation.
            </Text>
            <Button
              href="https://calendly.com/eduard-ezwebone/20min"
              style={{
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Book a Free Call
            </Button>
          </Section>

          <Hr style={{ borderColor: "#e9d5ff", margin: "0 32px" }} />

          {/* Footer */}
          <Section style={{ padding: "20px 32px 28px" }}>
            <Text style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              Not seeing this in your inbox? Check your <strong>spam folder</strong> and mark us as safe.
              <br />
              EzwebOne · London, UK · ezwebone.co.uk
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
