import {
  H2,
  Box,
  Icon,
  Label,
  Input,
  Button,
} from "@adminjs/design-system";
import { LoginProps } from "adminjs";
import React, { useState } from "react";
import {
  styled,
  keyframes,
} from "@adminjs/design-system/styled-components";

const Login: React.FC<LoginProps> = ({ action }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const formAction = action || "/admin/login";

  return (
    <LoginContainer>
      <BackgroundPattern />
      <WrapperBox>
        <LoginCard>
          <LogoContainer>
            <LogoIcon>
              <Icon
                size={32}
                icon="Copy"
                color="#4F46E5"
              />
            </LogoIcon>
            <StyledH2>Template</StyledH2>
          </LogoContainer>
          <form
            action={formAction}
            method="POST"
          >
            <FormGroup>
              <StyledLabel
                htmlFor="email"
                active={isEmailFocused || email.length > 0}
              >
                <Icon
                  icon="EnvelopeOpen"
                  size={16}
                />
                Email Address
              </StyledLabel>
              <StyledInput
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                required
                active={isEmailFocused}
              />
            </FormGroup>

            <FormGroup>
              <StyledLabel
                htmlFor="password"
                active={isPasswordFocused || password.length > 0}
              >
                <Icon
                  icon="Key"
                  size={16}
                />
                Password
              </StyledLabel>
              <StyledInput
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                active={isPasswordFocused}
              />
            </FormGroup>

            <ButtonsContainer>
              <LoginButton
                as="button"
                type="submit"
                variant="contained"
              >
                <Icon
                  icon="LogIn"
                  size={16}
                />
                <span>Sign In</span>
              </LoginButton>

              <ForgotPasswordLink href="#">
                Forgot password?
              </ForgotPasswordLink>
            </ButtonsContainer>
          </form>

          <Footer>
            <SecurityText>
              <Icon
                icon="Shield"
                size={14}
                color="#6B7280"
              />
              <span>Secure Authentication</span>
            </SecurityText>
          </Footer>
        </LoginCard>
      </WrapperBox>
    </LoginContainer>
  );
};

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const LoginContainer = styled(Box)`
  min-height: 100vh;
  position: relative;
  background: #f8faf9;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  background-size: 100px 100px;
  z-index: 1;
`;

const WrapperBox = styled(Box)`
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 1rem 10rem;
`;

interface LoginCardProps {
  isHovering: boolean;
}

const LoginCard = styled(Box)<LoginCardProps>`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(79, 70, 229, 0.1) inset;
  backdrop-filter: blur(10px);
  transition: all 0.8s ease;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background-size: 400% 400%;
    border-radius: 18px;
    z-index: -1;
    opacity: ${(props) => (props.isHovering ? 1 : 0.7)};
    transition: opacity 0.5s ease;
  }

  &:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(79, 70, 229, 0.2) inset;

    &:before {
      opacity: 1;
    }
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #eef2ff 0%, #c7d2fe 100%);
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 3s infinite ease-in-out;
`;

const StyledH2 = styled(H2)`
  font-weight: 700;
  font-size: 1.75rem;
  background: linear-gradient(to right, #4f46e5, #818cf8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  margin: 0;
`;

const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  position: relative;
`;

interface LabelProps {
  active: boolean;
}

const StyledLabel = styled(Label)<LabelProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.active ? "#4F46E5" : "#6B7280")};
  transition: color 0.2s ease;

  svg {
    color: ${(props) => (props.active ? "#4F46E5" : "#9CA3AF")};
    transition: color 0.2s ease;
  }
`;

interface InputProps {
  active: boolean;
}

const StyledInput = styled(Input)<InputProps>`
  background: ${(props) => (props.active ? "#F9FAFB" : "#F3F4F6")};
  border: 1px solid
    ${(props) => (props.active ? "#818CF8" : "#E5E7EB")};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 0 4px rgba(129, 140, 248, 0.1)" : "none"};

  &:hover {
    border-color: ${(props) =>
      props.active ? "#818CF8" : "#D1D5DB"};
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #f9fafb;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const LoginButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: none;
  width: 100%;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.5);
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
    background: linear-gradient(135deg, #4338ca, #4f46e5);
  }

  &:active {
    box-shadow: 0 2px 4px -1px rgba(99, 102, 241, 0.5);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.7s ease;
  }

  &:hover:before {
    left: 100%;
  }
`;

const ForgotPasswordLink = styled.a`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const SecurityText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
`;

export default Login;
