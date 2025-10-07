(function (designSystem, React, styledComponents, adminjs) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const StatCard = ({
    icon,
    label,
    value,
    iconColor
  }) => {
    const displayValue = value === undefined || value === null ? "-" : value;
    const iconDisplayColor = iconColor || "primary100";
    return /*#__PURE__*/React__default.default.createElement(StyledStatCard, null, /*#__PURE__*/React__default.default.createElement(IconCircle, {
      $color: iconColor
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: icon,
      size: 28,
      color: iconDisplayColor
    })), /*#__PURE__*/React__default.default.createElement(StatLabel, null, label), /*#__PURE__*/React__default.default.createElement(StatValue, null, displayValue));
  };
  const StyledStatCard = styledComponents.styled(designSystem.Box)`
  background: ${({
  theme
}) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border: 1px solid ${({
  theme
}) => theme.colors.border};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;
  const StatLabel = styledComponents.styled(designSystem.Text)`
  font-size: 0.9rem;
  color: ${({
  theme
}) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;
  const StatValue = styledComponents.styled(designSystem.Text)`
  font-size: 2rem;
  font-weight: 700;
  color: ${({
  theme
}) => theme.colors.primary100};
`;
  const IconCircle = styledComponents.styled(designSystem.Box)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({
  $color,
  theme
}) => $color ? `${$color}1A` : theme.colors.primary10};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

  // import axios from "axios";
  const Dashboard = () => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});

    // ApiClient is used to communicate with the AdminJS backend routes,
    // including the custom dashboard handler
    const api = new adminjs.ApiClient();
    const sendNotice = adminjs.useNotice();
    const [currentAdmin] = adminjs.useCurrentAdmin();
    React.useEffect(() => {
      fetchDashboardData();
    }, []);

    /**
     * Fetches dashboard data from the custom dashboard handler
     */
    const fetchDashboardData = (showLoading = true) => {
      if (showLoading) setLoading(true);
      setError(null);
      api.getDashboard().then(response => {
        const fetchedData = response.data;
        if (fetchedData.error) {
          setError(fetchedData.error);
          sendNotice({
            message: fetchedData.error,
            type: "error"
          });
        } else {
          setData(fetchedData);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data due to a network or server issue.");
        sendNotice({
          message: "Failed to load dashboard data.",
          type: "error"
        });
        setLoading(false);
      });
    };

    // Note that you can also use axios directly
    // if you need to fetch data or send data to other endpoints
    // based on user interactions within the dashboard.
    // const handlerFetchData = async () => {
    //   try {
    //     const response = await axios.get('/your-custom-api-endpoint');
    //     console.log('Data from custom endpoint:', response.data);
    //   } catch (error) {
    //     console.error('Error fetching from custom endpoint:', error);
    //   }
    // };

    if (loading && Object.keys(data).length === 0) return /*#__PURE__*/React__default.default.createElement(LoadingContainer, null, /*#__PURE__*/React__default.default.createElement(LoadingContent, null, /*#__PURE__*/React__default.default.createElement(LoadingIcon, {
      icon: "Loader",
      spin: true,
      size: 32
    }), /*#__PURE__*/React__default.default.createElement(LoadingText, null, "Loading dashboard data...")));
    if (error) return /*#__PURE__*/React__default.default.createElement(ErrorContainer, null, /*#__PURE__*/React__default.default.createElement(ErrorContent, null, /*#__PURE__*/React__default.default.createElement(ErrorIcon, {
      icon: "AlertCircle",
      size: 40
    }), /*#__PURE__*/React__default.default.createElement(ErrorTitle, null, "Something went wrong"), /*#__PURE__*/React__default.default.createElement(ErrorMessage, null, error), /*#__PURE__*/React__default.default.createElement(RetryButton, {
      onClick: () => fetchDashboardData()
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "RefreshCw",
      mr: "sm"
    }), " ", "Try Again")));
    return /*#__PURE__*/React__default.default.createElement(DashboardContainer, null, /*#__PURE__*/React__default.default.createElement(HeaderBox, null, /*#__PURE__*/React__default.default.createElement(GreetingText, null, data.message || `Welcome, ${currentAdmin?.email || "Admin"}!`), /*#__PURE__*/React__default.default.createElement(SubtitleText, null, "Overview of your application's key dummy metrics.")), /*#__PURE__*/React__default.default.createElement(StatsGrid, null, /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "Active Jobs",
      value: data.activeJobs,
      icon: "Zap",
      iconColor: data.activeJobs && data.activeJobs > 0 ? "#007bff" : "#6c757d"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "Failed Jobs",
      value: data.failedJobs,
      icon: "AlertTriangle",
      iconColor: data.failedJobs && data.failedJobs > 0 ? "#dc3545" : "#6c757d"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "Completed Jobs",
      value: data.completedJobs,
      icon: "CheckCircle",
      iconColor: "#28a745"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "Total PDFs",
      value: data.pdfs?.total,
      icon: "FileText",
      iconColor: "#17a2b8"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "PDFs Processed",
      value: data.pdfs?.processed,
      icon: "CheckSquare",
      iconColor: "#28a745"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "PDFs Pending",
      value: data.pdfs?.pending,
      icon: "Clock",
      iconColor: data.pdfs?.pending && data.pdfs.pending > 0 ? "#ffc107" : "#6c757d"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "Queue Size",
      value: data.queue?.items,
      icon: "List",
      iconColor: data.queue?.items && data.queue.items > 0 ? "#fd7e14" : "#6c757d"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      label: "Extra Data",
      value: data.queue?.items,
      icon: "List",
      iconColor: data.queue?.items && data.queue.items > 0 ? "#fd7e14" : "#6c757d"
    })), /*#__PURE__*/React__default.default.createElement(FooterBox, null, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      small: true,
      color: "textMuted"
    }, "Last updated: ", data.lastUpdated || "N/A"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "outlined",
      size: "sm",
      onClick: () => fetchDashboardData(),
      disabled: loading
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "RefreshCw",
      mr: "sm"
    }), " ", "Refresh Data")));
  };
  const DashboardContainer = styledComponents.styled(designSystem.Box)`
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  position: relative;
  max-width: 100%;
  color: ${({
  theme
}) => theme.colors.text};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 1rem;
`;
  const HeaderBox = styledComponents.styled(designSystem.Box)`
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({
  theme
}) => theme.colors.border};
`;
  const GreetingText = styledComponents.styled(designSystem.Text)`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 48px;
  color: ${({
  theme
}) => theme.colors.primary100};
  margin-bottom: 0.75rem;
`;
  const SubtitleText = styledComponents.styled(designSystem.Text)`
  font-size: 1.2rem;
  color: ${({
  theme
}) => theme.colors.textMuted};
`;
  const StatsGrid = styledComponents.styled(designSystem.Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;
  const FooterBox = styledComponents.styled(designSystem.Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid ${({
  theme
}) => theme.colors.border};
  flex-wrap: wrap;
  gap: 1rem;
`;
  const ErrorMessage = styledComponents.styled(designSystem.Text)`
  color: ${({
  theme
}) => theme.colors.error};
  background: ${({
  theme
}) => theme.colors.errorLight};
  padding: ${({
  small
}) => small ? "0.5rem 0.75rem" : "0.75rem 1rem"};
  border-radius: 8px;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "!";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({
  theme
}) => theme.colors.error};
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;
  const LoadingContainer = styledComponents.styled(DashboardContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  margin: 1rem;
`;
  const LoadingContent = styledComponents.styled(designSystem.Box)`
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: ${({
  theme
}) => theme.colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
`;
  const LoadingIcon = styledComponents.styled(designSystem.Icon)`
  color: ${({
  theme
}) => theme.colors.primary100};
  margin-bottom: 1rem;
`;
  const LoadingText = styledComponents.styled(designSystem.Text)`
  color: ${({
  theme
}) => theme.colors.textMuted};
  font-size: 1rem;
`;
  const ErrorContainer = styledComponents.styled(LoadingContainer)``;
  const ErrorContent = styledComponents.styled(LoadingContent)`
  padding: 3rem 2rem;
`;
  const ErrorIcon = styledComponents.styled(designSystem.Icon)`
  color: ${({
  theme
}) => theme.colors.error};
  margin-bottom: 1rem;
`;
  const ErrorTitle = styledComponents.styled(designSystem.Text)`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({
  theme
}) => theme.colors.text};
  margin-bottom: 0.5rem;
`;
  const RetryButton = styledComponents.styled(designSystem.Button)`
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
`;

  const getLogPropertyName$1 = (property, mapping = {}) => {
    if (!mapping[property]) {
      return property;
    }
    return mapping[property];
  };
  const viewHelpers$1 = new adminjs.ViewHelpers();
  const ListRecordLinkProperty = ({
    record,
    property
  }) => {
    if (!record?.params) {
      return null;
    }
    const {
      custom = {}
    } = property;
    const {
      propertiesMapping = {}
    } = custom;
    const recordIdParam = getLogPropertyName$1("recordId", propertiesMapping);
    const resourceIdParam = getLogPropertyName$1("resource", propertiesMapping);
    const recordTitleParam = getLogPropertyName$1("recordTitle", propertiesMapping);
    const recordId = record.params[recordIdParam];
    const resource = record.params[resourceIdParam];
    const recordTitle = record.params[recordTitleParam];
    if (!recordId || !resource) {
      return null;
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Link, {
      href: viewHelpers$1.recordActionUrl({
        actionName: "show",
        recordId,
        resourceId: resource
      })
    }, recordTitle));
  };

  const EditPasswordProperty = props => {
    const {
      onChange,
      property,
      record,
      resource
    } = props;
    const {
      translateButton: tb
    } = adminjs.useTranslation();
    const [showPassword, togglePassword] = React.useState(false);
    React.useEffect(() => {
      if (!showPassword) {
        onChange(property.name, "");
      }
    }, [onChange, showPassword]);

    // For new records always show the property
    if (!record.id) {
      return /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent.Password.Edit, props);
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, showPassword && /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent.Password.Edit, props), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      onClick: () => togglePassword(!showPassword),
      type: "button"
    }, showPassword ? tb("cancel", resource.id) : tb("changePassword", resource.id)))));
  };

  const Cell$1 = styledComponents.styled(designSystem.TableCell)`
  width: 100%;
  word-break: break-word;
`;
  const Row$1 = styledComponents.styled(designSystem.TableRow)`
  display: flex;
  position: unset;
`;
  const Head$1 = styledComponents.styled(designSystem.TableHead)`
  display: flex;
  position: unset;
`;
  const Table$1 = styledComponents.styled(designSystem.Table)`
  width: 100%;
  position: unset;
  display: block;
`;
  const DifferenceRecordProperty = ({
    record,
    property
  }) => {
    // Get the unflattened version of the entire record
    const unflattenedParams = adminjs.flat.unflatten(record?.params ?? {});
    const differences = unflattenedParams?.[property.name];
    if (!differences || typeof differences !== "object") return null;
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, property.label), /*#__PURE__*/React__default.default.createElement(Table$1, null, /*#__PURE__*/React__default.default.createElement(Head$1, null, /*#__PURE__*/React__default.default.createElement(Row$1, null, /*#__PURE__*/React__default.default.createElement(Cell$1, null, "Property name"), /*#__PURE__*/React__default.default.createElement(Cell$1, null, "Before"), /*#__PURE__*/React__default.default.createElement(Cell$1, null, "After"))), /*#__PURE__*/React__default.default.createElement(designSystem.TableBody, null, Object.entries(differences).map(([propertyName, {
      before,
      after
    }]) => {
      return /*#__PURE__*/React__default.default.createElement(Row$1, {
        key: propertyName
      }, /*#__PURE__*/React__default.default.createElement(Cell$1, {
        width: 1 / 3
      }, propertyName), /*#__PURE__*/React__default.default.createElement(Cell$1, {
        color: "red",
        width: 1 / 3
      }, JSON.stringify(before) || "undefined"), /*#__PURE__*/React__default.default.createElement(Cell$1, {
        color: "green",
        width: 1 / 3
      }, JSON.stringify(after) || "undefined"));
    }))));
  };

  const Login = ({
    action
  }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isEmailFocused, setIsEmailFocused] = React.useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
    const formAction = action || "/admin/login";
    return /*#__PURE__*/React__default.default.createElement(LoginContainer, null, /*#__PURE__*/React__default.default.createElement(BackgroundPattern, null), /*#__PURE__*/React__default.default.createElement(WrapperBox, null, /*#__PURE__*/React__default.default.createElement(LoginCard, null, /*#__PURE__*/React__default.default.createElement(LogoContainer, null, /*#__PURE__*/React__default.default.createElement(LogoIcon, null, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      size: 32,
      icon: "Copy",
      color: "#4F46E5"
    })), /*#__PURE__*/React__default.default.createElement(StyledH2, null, "Template")), /*#__PURE__*/React__default.default.createElement("form", {
      action: formAction,
      method: "POST"
    }, /*#__PURE__*/React__default.default.createElement(FormGroup, null, /*#__PURE__*/React__default.default.createElement(StyledLabel, {
      htmlFor: "email",
      active: isEmailFocused || email.length > 0
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "EnvelopeOpen",
      size: 16
    }), "Email Address"), /*#__PURE__*/React__default.default.createElement(StyledInput, {
      type: "email",
      name: "email",
      id: "email",
      value: email,
      onChange: e => setEmail(e.target.value),
      onFocus: () => setIsEmailFocused(true),
      onBlur: () => setIsEmailFocused(false),
      required: true,
      active: isEmailFocused
    })), /*#__PURE__*/React__default.default.createElement(FormGroup, null, /*#__PURE__*/React__default.default.createElement(StyledLabel, {
      htmlFor: "password",
      active: isPasswordFocused || password.length > 0
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Key",
      size: 16
    }), "Password"), /*#__PURE__*/React__default.default.createElement(StyledInput, {
      type: "password",
      name: "password",
      id: "password",
      value: password,
      onChange: e => setPassword(e.target.value),
      onFocus: () => setIsPasswordFocused(true),
      onBlur: () => setIsPasswordFocused(false),
      required: true,
      active: isPasswordFocused
    })), /*#__PURE__*/React__default.default.createElement(ButtonsContainer, null, /*#__PURE__*/React__default.default.createElement(LoginButton, {
      as: "button",
      type: "submit",
      variant: "contained"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "LogIn",
      size: 16
    }), /*#__PURE__*/React__default.default.createElement("span", null, "Sign In")), /*#__PURE__*/React__default.default.createElement(ForgotPasswordLink, {
      href: "#"
    }, "Forgot password?"))), /*#__PURE__*/React__default.default.createElement(Footer, null, /*#__PURE__*/React__default.default.createElement(SecurityText, null, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Shield",
      size: 14,
      color: "#6B7280"
    }), /*#__PURE__*/React__default.default.createElement("span", null, "Secure Authentication"))))));
  };
  const pulse = styledComponents.keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
`;
  const LoginContainer = styledComponents.styled(designSystem.Box)`
  min-height: 100vh;
  position: relative;
  background: #f8faf9;
`;
  const BackgroundPattern = styledComponents.styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  background-size: 100px 100px;
  z-index: 1;
`;
  const WrapperBox = styledComponents.styled(designSystem.Box)`
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
  const LoginCard = styledComponents.styled(designSystem.Box)`
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
    opacity: ${props => props.isHovering ? 1 : 0.7};
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
  const LogoContainer = styledComponents.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;
  const LogoIcon = styledComponents.styled.div`
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
  const StyledH2 = styledComponents.styled(designSystem.H2)`
  font-weight: 700;
  font-size: 1.75rem;
  background: linear-gradient(to right, #4f46e5, #818cf8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  margin: 0;
`;
  const FormGroup = styledComponents.styled(designSystem.Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  position: relative;
`;
  const StyledLabel = styledComponents.styled(designSystem.Label)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? "#4F46E5" : "#6B7280"};
  transition: color 0.2s ease;

  svg {
    color: ${props => props.active ? "#4F46E5" : "#9CA3AF"};
    transition: color 0.2s ease;
  }
`;
  const StyledInput = styledComponents.styled(designSystem.Input)`
  background: ${props => props.active ? "#F9FAFB" : "#F3F4F6"};
  border: 1px solid
    ${props => props.active ? "#818CF8" : "#E5E7EB"};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active ? "0 0 0 4px rgba(129, 140, 248, 0.1)" : "none"};

  &:hover {
    border-color: ${props => props.active ? "#818CF8" : "#D1D5DB"};
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #f9fafb;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;
  const ButtonsContainer = styledComponents.styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;
  const LoginButton = styledComponents.styled(designSystem.Button)`
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
  const ForgotPasswordLink = styledComponents.styled.a`
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
  const Footer = styledComponents.styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;
  const SecurityText = styledComponents.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
`;

  const Cell = styledComponents.styled(designSystem.TableCell)`
  width: 100%;
  word-break: break-word;
`;
  const Row = styledComponents.styled(designSystem.TableRow)`
  display: flex;
  position: unset;
`;
  const Head = styledComponents.styled(designSystem.TableHead)`
  display: flex;
  position: unset;
`;
  const Table = styledComponents.styled(designSystem.Table)`
  width: 100%;
  position: unset;
  display: block;
`;
  const RecordDifference = ({
    record,
    property
  }) => {
    const differences = JSON.parse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adminjs.flat.unflatten(record?.params ?? {})?.[property.name] ?? {});
    if (!differences) {
      return null;
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, property.label), /*#__PURE__*/React__default.default.createElement(Table, null, /*#__PURE__*/React__default.default.createElement(Head, null, /*#__PURE__*/React__default.default.createElement(Row, null, /*#__PURE__*/React__default.default.createElement(Cell, null, "Property name"), /*#__PURE__*/React__default.default.createElement(Cell, null, "Before"), /*#__PURE__*/React__default.default.createElement(Cell, null, "After"))), /*#__PURE__*/React__default.default.createElement(designSystem.TableBody, null, Object.entries(differences).map(([propertyName, {
      before,
      after
    }]) => {
      return /*#__PURE__*/React__default.default.createElement(Row, {
        key: propertyName
      }, /*#__PURE__*/React__default.default.createElement(Cell, {
        width: 1 / 3
      }, propertyName), /*#__PURE__*/React__default.default.createElement(Cell, {
        color: "red",
        width: 1 / 3
      }, JSON.stringify(before) || 'undefined'), /*#__PURE__*/React__default.default.createElement(Cell, {
        color: "green",
        width: 1 / 3
      }, JSON.stringify(after) || 'undefined'));
    }))));
  };

  const getLogPropertyName = (property, mapping = {}) => {
    if (!mapping[property]) {
      return property;
    }
    return mapping[property];
  };

  const viewHelpers = new adminjs.ViewHelpers();
  const RecordLink = ({
    record,
    property
  }) => {
    if (!record?.params) {
      return null;
    }
    const {
      custom = {}
    } = property;
    const {
      propertiesMapping = {}
    } = custom;
    const recordIdParam = getLogPropertyName('recordId', propertiesMapping);
    const resourceIdParam = getLogPropertyName('resource', propertiesMapping);
    const recordTitleParam = getLogPropertyName('recordTitle', propertiesMapping);
    const recordId = record.params[recordIdParam];
    const resource = record.params[resourceIdParam];
    const recordTitle = record.params[recordTitleParam];
    if (!recordId || !resource) {
      return null;
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Link, {
      href: viewHelpers.recordActionUrl({
        actionName: 'show',
        recordId,
        resourceId: resource
      })
    }, recordTitle));
  };

  const PasswordEdit = props => {
    const {
      onChange,
      property,
      record,
      resource
    } = props;
    const {
      translateButton: tb
    } = adminjs.useTranslation();
    const [showPassword, togglePassword] = React.useState(false);
    React.useEffect(() => {
      if (!showPassword) {
        onChange(property.name, '');
      }
    }, [onChange, showPassword]);
    // For new records always show the property
    if (!record.id) {
      return /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent.Password.Edit, props);
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, showPassword && /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent.Password.Edit, props), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      onClick: () => togglePassword(!showPassword),
      type: "button"
    }, showPassword ? tb('cancel', resource.id) : tb('changePassword', resource.id)))));
  };

  const ImportComponent = ({
    resource
  }) => {
    const [file, setFile] = React.useState(null);
    const sendNotice = adminjs.useNotice();
    const [isFetching, setFetching] = React.useState();
    const onUpload = uploadedFile => {
      setFile(uploadedFile?.[0] ?? null);
    };
    const onSubmit = async () => {
      if (!file) {
        return;
      }
      setFetching(true);
      try {
        const importData = new FormData();
        importData.append('file', file, file?.name);
        await new adminjs.ApiClient().resourceAction({
          method: 'post',
          resourceId: resource.id,
          actionName: 'import',
          data: importData
        });
        sendNotice({
          message: 'Imported successfully',
          type: 'success'
        });
      } catch (e) {
        sendNotice({
          message: e.message,
          type: 'error'
        });
      }
      setFetching(false);
    };
    if (isFetching) {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null);
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      margin: "auto",
      maxWidth: 600,
      display: "flex",
      justifyContent: "center",
      flexDirection: "column"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.DropZone, {
      files: [],
      onChange: onUpload,
      multiple: false
    }), file && /*#__PURE__*/React__default.default.createElement(designSystem.DropZoneItem, {
      file: file,
      filename: file.name,
      onRemove: () => setFile(null)
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      justifyContent: "center",
      m: 10
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      onClick: onSubmit,
      disabled: !file || isFetching
    }, "Upload")));
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var FileSaver_min = {exports: {}};

  (function (module, exports) {
    (function (a, b) {
      b();
    })(commonjsGlobal, function () {

      function b(a, b) {
        return "undefined" == typeof b ? b = {
          autoBom: false
        } : "object" != typeof b && (console.warn("Deprecated: Expected third argument to be a object"), b = {
          autoBom: !b
        }), b.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob(["\uFEFF", a], {
          type: a.type
        }) : a;
      }
      function c(a, b, c) {
        var d = new XMLHttpRequest();
        d.open("GET", a), d.responseType = "blob", d.onload = function () {
          g(d.response, b, c);
        }, d.onerror = function () {
          console.error("could not download file");
        }, d.send();
      }
      function d(a) {
        var b = new XMLHttpRequest();
        b.open("HEAD", a, false);
        try {
          b.send();
        } catch (a) {}
        return 200 <= b.status && 299 >= b.status;
      }
      function e(a) {
        try {
          a.dispatchEvent(new MouseEvent("click"));
        } catch (c) {
          var b = document.createEvent("MouseEvents");
          b.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), a.dispatchEvent(b);
        }
      }
      var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof commonjsGlobal && commonjsGlobal.global === commonjsGlobal ? commonjsGlobal : void 0,
        a = f.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent),
        g = f.saveAs || ("object" != typeof window || window !== f ? function () {} : "download" in HTMLAnchorElement.prototype && !a ? function (b, g, h) {
          var i = f.URL || f.webkitURL,
            j = document.createElement("a");
          g = g || b.name || "download", j.download = g, j.rel = "noopener", "string" == typeof b ? (j.href = b, j.origin === location.origin ? e(j) : d(j.href) ? c(b, g, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b), setTimeout(function () {
            i.revokeObjectURL(j.href);
          }, 4E4), setTimeout(function () {
            e(j);
          }, 0));
        } : "msSaveOrOpenBlob" in navigator ? function (f, g, h) {
          if (g = g || f.name || "download", "string" != typeof f) navigator.msSaveOrOpenBlob(b(f, h), g);else if (d(f)) c(f, g, h);else {
            var i = document.createElement("a");
            i.href = f, i.target = "_blank", setTimeout(function () {
              e(i);
            });
          }
        } : function (b, d, e, g) {
          if (g = g || open("", "_blank"), g && (g.document.title = g.document.body.innerText = "downloading..."), "string" == typeof b) return c(b, d, e);
          var h = "application/octet-stream" === b.type,
            i = /constructor/i.test(f.HTMLElement) || f.safari,
            j = /CriOS\/[\d]+/.test(navigator.userAgent);
          if ((j || h && i || a) && "undefined" != typeof FileReader) {
            var k = new FileReader();
            k.onloadend = function () {
              var a = k.result;
              a = j ? a : a.replace(/^data:[^;]*;/, "data:attachment/file;"), g ? g.location.href = a : location = a, g = null;
            }, k.readAsDataURL(b);
          } else {
            var l = f.URL || f.webkitURL,
              m = l.createObjectURL(b);
            g ? g.location = m : location.href = m, g = null, setTimeout(function () {
              l.revokeObjectURL(m);
            }, 4E4);
          }
        });
      f.saveAs = g.saveAs = g, (module.exports = g);
    });
  })(FileSaver_min);
  var FileSaver_minExports = FileSaver_min.exports;

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
    }
  }

  /**
   * @name isDate
   * @category Common Helpers
   * @summary Is the given value a date?
   *
   * @description
   * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
   *
   * @param {*} value - the value to check
   * @returns {boolean} true if the given value is a date
   * @throws {TypeError} 1 arguments required
   *
   * @example
   * // For a valid date:
   * const result = isDate(new Date())
   * //=> true
   *
   * @example
   * // For an invalid date:
   * const result = isDate(new Date(NaN))
   * //=> true
   *
   * @example
   * // For some value:
   * const result = isDate('2014-02-31')
   * //=> false
   *
   * @example
   * // For an object:
   * const result = isDate({})
   * //=> false
   */
  function isDate(value) {
    requiredArgs(1, arguments);
    return value instanceof Date || _typeof(value) === 'object' && Object.prototype.toString.call(value) === '[object Date]';
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */
  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument);

    // Clone the date
    if (argument instanceof Date || _typeof(argument) === 'object' && argStr === '[object Date]') {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime());
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument);
    } else {
      if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
        // eslint-disable-next-line no-console
        console.warn(new Error().stack);
      }
      return new Date(NaN);
    }
  }

  /**
   * @name isValid
   * @category Common Helpers
   * @summary Is the given date valid?
   *
   * @description
   * Returns false if argument is Invalid Date and true otherwise.
   * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
   * Invalid Date is a Date, whose time value is NaN.
   *
   * Time value of Date: http://es5.github.io/#x15.9.1.1
   *
   * @param {*} date - the date to check
   * @returns {Boolean} the date is valid
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // For the valid date:
   * const result = isValid(new Date(2014, 1, 31))
   * //=> true
   *
   * @example
   * // For the value, convertable into a date:
   * const result = isValid(1393804800000)
   * //=> true
   *
   * @example
   * // For the invalid date:
   * const result = isValid(new Date(''))
   * //=> false
   */
  function isValid(dirtyDate) {
    requiredArgs(1, arguments);
    if (!isDate(dirtyDate) && typeof dirtyDate !== 'number') {
      return false;
    }
    var date = toDate(dirtyDate);
    return !isNaN(Number(date));
  }

  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }
    var number = Number(dirtyNumber);
    if (isNaN(number)) {
      return number;
    }
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }

  /**
   * @name addMilliseconds
   * @category Millisecond Helpers
   * @summary Add the specified number of milliseconds to the given date.
   *
   * @description
   * Add the specified number of milliseconds to the given date.
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the milliseconds added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
   * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:30.750
   */
  function addMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var timestamp = toDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount);
  }

  /**
   * @name subMilliseconds
   * @category Millisecond Helpers
   * @summary Subtract the specified number of milliseconds from the given date.
   *
   * @description
   * Subtract the specified number of milliseconds from the given date.
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the milliseconds subtracted
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
   * const result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:29.250
   */
  function subMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, -amount);
  }

  var MILLISECONDS_IN_DAY = 86400000;
  function getUTCDayOfYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var timestamp = date.getTime();
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    var startOfYearTimestamp = date.getTime();
    var difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
  }

  function startOfUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var weekStartsOn = 1;
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  function getUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();
    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }

  function startOfUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var year = getUTCISOWeekYear(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(year, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCISOWeek(fourthOfJanuary);
    return date;
  }

  var MILLISECONDS_IN_WEEK$1 = 604800000;
  function getUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
  }

  var defaultOptions = {};
  function getDefaultOptions() {
    return defaultOptions;
  }

  function startOfUTCWeek(dirtyDate, options) {
    var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
    requiredArgs(1, arguments);
    var defaultOptions = getDefaultOptions();
    var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);

    // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
    }
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  function getUTCWeekYear(dirtyDate, options) {
    var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();
    var defaultOptions = getDefaultOptions();
    var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);

    // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
    }
    var firstWeekOfNextYear = new Date(0);
    firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
    var firstWeekOfThisYear = new Date(0);
    firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }

  function startOfUTCWeekYear(dirtyDate, options) {
    var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
    requiredArgs(1, arguments);
    var defaultOptions = getDefaultOptions();
    var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
    var year = getUTCWeekYear(dirtyDate, options);
    var firstWeek = new Date(0);
    firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCWeek(firstWeek, options);
    return date;
  }

  var MILLISECONDS_IN_WEEK = 604800000;
  function getUTCWeek(dirtyDate, options) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
  }

  function addLeadingZeros(number, targetLength) {
    var sign = number < 0 ? '-' : '';
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return sign + output;
  }

  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* |                                |
   * |  d  | Day of month                   |  D  |                                |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  m  | Minute                         |  M  | Month                          |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  y  | Year (abs)                     |  Y  |                                |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   */
  var formatters$1 = {
    // Year
    y: function y(date, token) {
      // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
      // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
      // |----------|-------|----|-------|-------|-------|
      // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
      // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
      // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
      // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
      // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

      var signedYear = date.getUTCFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
    },
    // Month
    M: function M(date, token) {
      var month = date.getUTCMonth();
      return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    // Day of the month
    d: function d(date, token) {
      return addLeadingZeros(date.getUTCDate(), token.length);
    },
    // AM or PM
    a: function a(date, token) {
      var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';
      switch (token) {
        case 'a':
        case 'aa':
          return dayPeriodEnumValue.toUpperCase();
        case 'aaa':
          return dayPeriodEnumValue;
        case 'aaaaa':
          return dayPeriodEnumValue[0];
        case 'aaaa':
        default:
          return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
      }
    },
    // Hour [1-12]
    h: function h(date, token) {
      return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
    },
    // Hour [0-23]
    H: function H(date, token) {
      return addLeadingZeros(date.getUTCHours(), token.length);
    },
    // Minute
    m: function m(date, token) {
      return addLeadingZeros(date.getUTCMinutes(), token.length);
    },
    // Second
    s: function s(date, token) {
      return addLeadingZeros(date.getUTCSeconds(), token.length);
    },
    // Fraction of second
    S: function S(date, token) {
      var numberOfDigits = token.length;
      var milliseconds = date.getUTCMilliseconds();
      var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
      return addLeadingZeros(fractionalSeconds, token.length);
    }
  };

  var dayPeriodEnum = {
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  };
  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* | Milliseconds in day            |
   * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
   * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
   * |  d  | Day of month                   |  D  | Day of year                    |
   * |  e  | Local day of week              |  E  | Day of week                    |
   * |  f  |                                |  F* | Day of week in month           |
   * |  g* | Modified Julian day            |  G  | Era                            |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  i! | ISO day of week                |  I! | ISO week of year               |
   * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
   * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
   * |  l* | (deprecated)                   |  L  | Stand-alone month              |
   * |  m  | Minute                         |  M  | Month                          |
   * |  n  |                                |  N  |                                |
   * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
   * |  p! | Long localized time            |  P! | Long localized date            |
   * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
   * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
   * |  u  | Extended year                  |  U* | Cyclic year                    |
   * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
   * |  w  | Local week of year             |  W* | Week of month                  |
   * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
   * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
   * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   *
   * Letters marked by ! are non-standard, but implemented by date-fns:
   * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
   * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
   *   i.e. 7 for Sunday, 1 for Monday, etc.
   * - `I` is ISO week of year, as opposed to `w` which is local week of year.
   * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
   *   `R` is supposed to be used in conjunction with `I` and `i`
   *   for universal ISO week-numbering date, whereas
   *   `Y` is supposed to be used in conjunction with `w` and `e`
   *   for week-numbering date specific to the locale.
   * - `P` is long localized date format
   * - `p` is long localized time format
   */

  var formatters = {
    // Era
    G: function G(date, token, localize) {
      var era = date.getUTCFullYear() > 0 ? 1 : 0;
      switch (token) {
        // AD, BC
        case 'G':
        case 'GG':
        case 'GGG':
          return localize.era(era, {
            width: 'abbreviated'
          });
        // A, B
        case 'GGGGG':
          return localize.era(era, {
            width: 'narrow'
          });
        // Anno Domini, Before Christ
        case 'GGGG':
        default:
          return localize.era(era, {
            width: 'wide'
          });
      }
    },
    // Year
    y: function y(date, token, localize) {
      // Ordinal number
      if (token === 'yo') {
        var signedYear = date.getUTCFullYear();
        // Returns 1 for 1 BC (which is year 0 in JavaScript)
        var year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize.ordinalNumber(year, {
          unit: 'year'
        });
      }
      return formatters$1.y(date, token);
    },
    // Local week-numbering year
    Y: function Y(date, token, localize, options) {
      var signedWeekYear = getUTCWeekYear(date, options);
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

      // Two digit year
      if (token === 'YY') {
        var twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2);
      }

      // Ordinal number
      if (token === 'Yo') {
        return localize.ordinalNumber(weekYear, {
          unit: 'year'
        });
      }

      // Padding
      return addLeadingZeros(weekYear, token.length);
    },
    // ISO week-numbering year
    R: function R(date, token) {
      var isoWeekYear = getUTCISOWeekYear(date);

      // Padding
      return addLeadingZeros(isoWeekYear, token.length);
    },
    // Extended year. This is a single number designating the year of this calendar system.
    // The main difference between `y` and `u` localizers are B.C. years:
    // | Year | `y` | `u` |
    // |------|-----|-----|
    // | AC 1 |   1 |   1 |
    // | BC 1 |   1 |   0 |
    // | BC 2 |   2 |  -1 |
    // Also `yy` always returns the last two digits of a year,
    // while `uu` pads single digit years to 2 characters and returns other years unchanged.
    u: function u(date, token) {
      var year = date.getUTCFullYear();
      return addLeadingZeros(year, token.length);
    },
    // Quarter
    Q: function Q(date, token, localize) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
      switch (token) {
        // 1, 2, 3, 4
        case 'Q':
          return String(quarter);
        // 01, 02, 03, 04
        case 'QQ':
          return addLeadingZeros(quarter, 2);
        // 1st, 2nd, 3rd, 4th
        case 'Qo':
          return localize.ordinalNumber(quarter, {
            unit: 'quarter'
          });
        // Q1, Q2, Q3, Q4
        case 'QQQ':
          return localize.quarter(quarter, {
            width: 'abbreviated',
            context: 'formatting'
          });
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)
        case 'QQQQQ':
          return localize.quarter(quarter, {
            width: 'narrow',
            context: 'formatting'
          });
        // 1st quarter, 2nd quarter, ...
        case 'QQQQ':
        default:
          return localize.quarter(quarter, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // Stand-alone quarter
    q: function q(date, token, localize) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
      switch (token) {
        // 1, 2, 3, 4
        case 'q':
          return String(quarter);
        // 01, 02, 03, 04
        case 'qq':
          return addLeadingZeros(quarter, 2);
        // 1st, 2nd, 3rd, 4th
        case 'qo':
          return localize.ordinalNumber(quarter, {
            unit: 'quarter'
          });
        // Q1, Q2, Q3, Q4
        case 'qqq':
          return localize.quarter(quarter, {
            width: 'abbreviated',
            context: 'standalone'
          });
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)
        case 'qqqqq':
          return localize.quarter(quarter, {
            width: 'narrow',
            context: 'standalone'
          });
        // 1st quarter, 2nd quarter, ...
        case 'qqqq':
        default:
          return localize.quarter(quarter, {
            width: 'wide',
            context: 'standalone'
          });
      }
    },
    // Month
    M: function M(date, token, localize) {
      var month = date.getUTCMonth();
      switch (token) {
        case 'M':
        case 'MM':
          return formatters$1.M(date, token);
        // 1st, 2nd, ..., 12th
        case 'Mo':
          return localize.ordinalNumber(month + 1, {
            unit: 'month'
          });
        // Jan, Feb, ..., Dec
        case 'MMM':
          return localize.month(month, {
            width: 'abbreviated',
            context: 'formatting'
          });
        // J, F, ..., D
        case 'MMMMM':
          return localize.month(month, {
            width: 'narrow',
            context: 'formatting'
          });
        // January, February, ..., December
        case 'MMMM':
        default:
          return localize.month(month, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // Stand-alone month
    L: function L(date, token, localize) {
      var month = date.getUTCMonth();
      switch (token) {
        // 1, 2, ..., 12
        case 'L':
          return String(month + 1);
        // 01, 02, ..., 12
        case 'LL':
          return addLeadingZeros(month + 1, 2);
        // 1st, 2nd, ..., 12th
        case 'Lo':
          return localize.ordinalNumber(month + 1, {
            unit: 'month'
          });
        // Jan, Feb, ..., Dec
        case 'LLL':
          return localize.month(month, {
            width: 'abbreviated',
            context: 'standalone'
          });
        // J, F, ..., D
        case 'LLLLL':
          return localize.month(month, {
            width: 'narrow',
            context: 'standalone'
          });
        // January, February, ..., December
        case 'LLLL':
        default:
          return localize.month(month, {
            width: 'wide',
            context: 'standalone'
          });
      }
    },
    // Local week of year
    w: function w(date, token, localize, options) {
      var week = getUTCWeek(date, options);
      if (token === 'wo') {
        return localize.ordinalNumber(week, {
          unit: 'week'
        });
      }
      return addLeadingZeros(week, token.length);
    },
    // ISO week of year
    I: function I(date, token, localize) {
      var isoWeek = getUTCISOWeek(date);
      if (token === 'Io') {
        return localize.ordinalNumber(isoWeek, {
          unit: 'week'
        });
      }
      return addLeadingZeros(isoWeek, token.length);
    },
    // Day of the month
    d: function d(date, token, localize) {
      if (token === 'do') {
        return localize.ordinalNumber(date.getUTCDate(), {
          unit: 'date'
        });
      }
      return formatters$1.d(date, token);
    },
    // Day of year
    D: function D(date, token, localize) {
      var dayOfYear = getUTCDayOfYear(date);
      if (token === 'Do') {
        return localize.ordinalNumber(dayOfYear, {
          unit: 'dayOfYear'
        });
      }
      return addLeadingZeros(dayOfYear, token.length);
    },
    // Day of week
    E: function E(date, token, localize) {
      var dayOfWeek = date.getUTCDay();
      switch (token) {
        // Tue
        case 'E':
        case 'EE':
        case 'EEE':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting'
          });
        // T
        case 'EEEEE':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting'
          });
        // Tu
        case 'EEEEEE':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting'
          });
        // Tuesday
        case 'EEEE':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // Local day of week
    e: function e(date, token, localize, options) {
      var dayOfWeek = date.getUTCDay();
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        // Numerical value (Nth day of week with current locale or weekStartsOn)
        case 'e':
          return String(localDayOfWeek);
        // Padded numerical value
        case 'ee':
          return addLeadingZeros(localDayOfWeek, 2);
        // 1st, 2nd, ..., 7th
        case 'eo':
          return localize.ordinalNumber(localDayOfWeek, {
            unit: 'day'
          });
        case 'eee':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting'
          });
        // T
        case 'eeeee':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting'
          });
        // Tu
        case 'eeeeee':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting'
          });
        // Tuesday
        case 'eeee':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // Stand-alone local day of week
    c: function c(date, token, localize, options) {
      var dayOfWeek = date.getUTCDay();
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        // Numerical value (same as in `e`)
        case 'c':
          return String(localDayOfWeek);
        // Padded numerical value
        case 'cc':
          return addLeadingZeros(localDayOfWeek, token.length);
        // 1st, 2nd, ..., 7th
        case 'co':
          return localize.ordinalNumber(localDayOfWeek, {
            unit: 'day'
          });
        case 'ccc':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'standalone'
          });
        // T
        case 'ccccc':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'standalone'
          });
        // Tu
        case 'cccccc':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'standalone'
          });
        // Tuesday
        case 'cccc':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'standalone'
          });
      }
    },
    // ISO day of week
    i: function i(date, token, localize) {
      var dayOfWeek = date.getUTCDay();
      var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
        // 2
        case 'i':
          return String(isoDayOfWeek);
        // 02
        case 'ii':
          return addLeadingZeros(isoDayOfWeek, token.length);
        // 2nd
        case 'io':
          return localize.ordinalNumber(isoDayOfWeek, {
            unit: 'day'
          });
        // Tue
        case 'iii':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting'
          });
        // T
        case 'iiiii':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting'
          });
        // Tu
        case 'iiiiii':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting'
          });
        // Tuesday
        case 'iiii':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // AM or PM
    a: function a(date, token, localize) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
      switch (token) {
        case 'a':
        case 'aa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          });
        case 'aaa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          }).toLowerCase();
        case 'aaaaa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting'
          });
        case 'aaaa':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // AM, PM, midnight, noon
    b: function b(date, token, localize) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
      }
      switch (token) {
        case 'b':
        case 'bb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          });
        case 'bbb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          }).toLowerCase();
        case 'bbbbb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting'
          });
        case 'bbbb':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // in the morning, in the afternoon, in the evening, at night
    B: function B(date, token, localize) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }
      switch (token) {
        case 'B':
        case 'BB':
        case 'BBB':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          });
        case 'BBBBB':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting'
          });
        case 'BBBB':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting'
          });
      }
    },
    // Hour [1-12]
    h: function h(date, token, localize) {
      if (token === 'ho') {
        var hours = date.getUTCHours() % 12;
        if (hours === 0) hours = 12;
        return localize.ordinalNumber(hours, {
          unit: 'hour'
        });
      }
      return formatters$1.h(date, token);
    },
    // Hour [0-23]
    H: function H(date, token, localize) {
      if (token === 'Ho') {
        return localize.ordinalNumber(date.getUTCHours(), {
          unit: 'hour'
        });
      }
      return formatters$1.H(date, token);
    },
    // Hour [0-11]
    K: function K(date, token, localize) {
      var hours = date.getUTCHours() % 12;
      if (token === 'Ko') {
        return localize.ordinalNumber(hours, {
          unit: 'hour'
        });
      }
      return addLeadingZeros(hours, token.length);
    },
    // Hour [1-24]
    k: function k(date, token, localize) {
      var hours = date.getUTCHours();
      if (hours === 0) hours = 24;
      if (token === 'ko') {
        return localize.ordinalNumber(hours, {
          unit: 'hour'
        });
      }
      return addLeadingZeros(hours, token.length);
    },
    // Minute
    m: function m(date, token, localize) {
      if (token === 'mo') {
        return localize.ordinalNumber(date.getUTCMinutes(), {
          unit: 'minute'
        });
      }
      return formatters$1.m(date, token);
    },
    // Second
    s: function s(date, token, localize) {
      if (token === 'so') {
        return localize.ordinalNumber(date.getUTCSeconds(), {
          unit: 'second'
        });
      }
      return formatters$1.s(date, token);
    },
    // Fraction of second
    S: function S(date, token) {
      return formatters$1.S(date, token);
    },
    // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
    X: function X(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      if (timezoneOffset === 0) {
        return 'Z';
      }
      switch (token) {
        // Hours and optional minutes
        case 'X':
          return formatTimezoneWithOptionalMinutes(timezoneOffset);

        // Hours, minutes and optional seconds without `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `XX`
        case 'XXXX':
        case 'XX':
          // Hours and minutes without `:` delimiter
          return formatTimezone(timezoneOffset);

        // Hours, minutes and optional seconds with `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `XXX`
        case 'XXXXX':
        case 'XXX': // Hours and minutes with `:` delimiter
        default:
          return formatTimezone(timezoneOffset, ':');
      }
    },
    // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
    x: function x(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      switch (token) {
        // Hours and optional minutes
        case 'x':
          return formatTimezoneWithOptionalMinutes(timezoneOffset);

        // Hours, minutes and optional seconds without `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `xx`
        case 'xxxx':
        case 'xx':
          // Hours and minutes without `:` delimiter
          return formatTimezone(timezoneOffset);

        // Hours, minutes and optional seconds with `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `xxx`
        case 'xxxxx':
        case 'xxx': // Hours and minutes with `:` delimiter
        default:
          return formatTimezone(timezoneOffset, ':');
      }
    },
    // Timezone (GMT)
    O: function O(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      switch (token) {
        // Short
        case 'O':
        case 'OO':
        case 'OOO':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
        // Long
        case 'OOOO':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':');
      }
    },
    // Timezone (specific non-location)
    z: function z(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      switch (token) {
        // Short
        case 'z':
        case 'zz':
        case 'zzz':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
        // Long
        case 'zzzz':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':');
      }
    },
    // Seconds timestamp
    t: function t(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timestamp = Math.floor(originalDate.getTime() / 1000);
      return addLeadingZeros(timestamp, token.length);
    },
    // Milliseconds timestamp
    T: function T(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timestamp = originalDate.getTime();
      return addLeadingZeros(timestamp, token.length);
    }
  };
  function formatTimezoneShort(offset, dirtyDelimiter) {
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    if (minutes === 0) {
      return sign + String(hours);
    }
    var delimiter = dirtyDelimiter;
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
  }
  function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
    if (offset % 60 === 0) {
      var sign = offset > 0 ? '-' : '+';
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, dirtyDelimiter);
  }
  function formatTimezone(offset, dirtyDelimiter) {
    var delimiter = dirtyDelimiter || '';
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
    var minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes;
  }

  var dateLongFormatter = function dateLongFormatter(pattern, formatLong) {
    switch (pattern) {
      case 'P':
        return formatLong.date({
          width: 'short'
        });
      case 'PP':
        return formatLong.date({
          width: 'medium'
        });
      case 'PPP':
        return formatLong.date({
          width: 'long'
        });
      case 'PPPP':
      default:
        return formatLong.date({
          width: 'full'
        });
    }
  };
  var timeLongFormatter = function timeLongFormatter(pattern, formatLong) {
    switch (pattern) {
      case 'p':
        return formatLong.time({
          width: 'short'
        });
      case 'pp':
        return formatLong.time({
          width: 'medium'
        });
      case 'ppp':
        return formatLong.time({
          width: 'long'
        });
      case 'pppp':
      default:
        return formatLong.time({
          width: 'full'
        });
    }
  };
  var dateTimeLongFormatter = function dateTimeLongFormatter(pattern, formatLong) {
    var matchResult = pattern.match(/(P+)(p+)?/) || [];
    var datePattern = matchResult[1];
    var timePattern = matchResult[2];
    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong);
    }
    var dateTimeFormat;
    switch (datePattern) {
      case 'P':
        dateTimeFormat = formatLong.dateTime({
          width: 'short'
        });
        break;
      case 'PP':
        dateTimeFormat = formatLong.dateTime({
          width: 'medium'
        });
        break;
      case 'PPP':
        dateTimeFormat = formatLong.dateTime({
          width: 'long'
        });
        break;
      case 'PPPP':
      default:
        dateTimeFormat = formatLong.dateTime({
          width: 'full'
        });
        break;
    }
    return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
  };
  var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };

  /**
   * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
   * They usually appear for dates that denote time before the timezones were introduced
   * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
   * and GMT+01:00:00 after that date)
   *
   * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
   * which would lead to incorrect calculations.
   *
   * This function returns the timezone offset in milliseconds that takes seconds in account.
   */
  function getTimezoneOffsetInMilliseconds(date) {
    var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    utcDate.setUTCFullYear(date.getFullYear());
    return date.getTime() - utcDate.getTime();
  }

  var protectedDayOfYearTokens = ['D', 'DD'];
  var protectedWeekYearTokens = ['YY', 'YYYY'];
  function isProtectedDayOfYearToken(token) {
    return protectedDayOfYearTokens.indexOf(token) !== -1;
  }
  function isProtectedWeekYearToken(token) {
    return protectedWeekYearTokens.indexOf(token) !== -1;
  }
  function throwProtectedError(token, format, input) {
    if (token === 'YYYY') {
      throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    } else if (token === 'YY') {
      throw new RangeError("Use `yy` instead of `YY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    } else if (token === 'D') {
      throw new RangeError("Use `d` instead of `D` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    } else if (token === 'DD') {
      throw new RangeError("Use `dd` instead of `DD` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    }
  }

  var formatDistanceLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds'
    },
    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds'
    },
    halfAMinute: 'half a minute',
    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes'
    },
    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes'
    },
    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours'
    },
    xHours: {
      one: '1 hour',
      other: '{{count}} hours'
    },
    xDays: {
      one: '1 day',
      other: '{{count}} days'
    },
    aboutXWeeks: {
      one: 'about 1 week',
      other: 'about {{count}} weeks'
    },
    xWeeks: {
      one: '1 week',
      other: '{{count}} weeks'
    },
    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months'
    },
    xMonths: {
      one: '1 month',
      other: '{{count}} months'
    },
    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years'
    },
    xYears: {
      one: '1 year',
      other: '{{count}} years'
    },
    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years'
    },
    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years'
    }
  };
  var formatDistance = function formatDistance(token, count, options) {
    var result;
    var tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === 'string') {
      result = tokenValue;
    } else if (count === 1) {
      result = tokenValue.one;
    } else {
      result = tokenValue.other.replace('{{count}}', count.toString());
    }
    if (options !== null && options !== void 0 && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return 'in ' + result;
      } else {
        return result + ' ago';
      }
    }
    return result;
  };

  function buildFormatLongFn(args) {
    return function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // TODO: Remove String()
      var width = options.width ? String(options.width) : args.defaultWidth;
      var format = args.formats[width] || args.formats[args.defaultWidth];
      return format;
    };
  }

  var dateFormats = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy'
  };
  var timeFormats = {
    full: 'h:mm:ss a zzzz',
    long: 'h:mm:ss a z',
    medium: 'h:mm:ss a',
    short: 'h:mm a'
  };
  var dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}'
  };
  var formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: 'full'
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: 'full'
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: 'full'
    })
  };

  var formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P'
  };
  var formatRelative = function formatRelative(token, _date, _baseDate, _options) {
    return formatRelativeLocale[token];
  };

  function buildLocalizeFn(args) {
    return function (dirtyIndex, options) {
      var context = options !== null && options !== void 0 && options.context ? String(options.context) : 'standalone';
      var valuesArray;
      if (context === 'formatting' && args.formattingValues) {
        var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        var _defaultWidth = args.defaultWidth;
        var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[_width] || args.values[_defaultWidth];
      }
      var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
      // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
      return valuesArray[index];
    };
  }

  var eraValues = {
    narrow: ['B', 'A'],
    abbreviated: ['BC', 'AD'],
    wide: ['Before Christ', 'Anno Domini']
  };
  var quarterValues = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
  };

  // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.
  var monthValues = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  var dayValues = {
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };
  var dayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
    }
  };
  var formattingDayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night'
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night'
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night'
    }
  };
  var ordinalNumber = function ordinalNumber(dirtyNumber, _options) {
    var number = Number(dirtyNumber);

    // If ordinal numbers depend on context, for example,
    // if they are different for different grammatical genders,
    // use `options.unit`.
    //
    // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
    // 'day', 'hour', 'minute', 'second'.

    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + 'st';
        case 2:
          return number + 'nd';
        case 3:
          return number + 'rd';
      }
    }
    return number + 'th';
  };
  var localize = {
    ordinalNumber: ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: 'wide'
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: 'wide',
      argumentCallback: function argumentCallback(quarter) {
        return quarter - 1;
      }
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: 'wide'
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide'
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: 'wide'
    })
  };

  function buildMatchFn(args) {
    return function (string) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var width = options.width;
      var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      var matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      var matchedString = matchResult[0];
      var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function (pattern) {
        return pattern.test(matchedString);
      }) : findKey(parsePatterns, function (pattern) {
        return pattern.test(matchedString);
      });
      var value;
      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
      return {
        value: value,
        rest: rest
      };
    };
  }
  function findKey(object, predicate) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key;
      }
    }
    return undefined;
  }
  function findIndex(array, predicate) {
    for (var key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return undefined;
  }

  function buildMatchPatternFn(args) {
    return function (string) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var matchResult = string.match(args.matchPattern);
      if (!matchResult) return null;
      var matchedString = matchResult[0];
      var parseResult = string.match(args.parsePattern);
      if (!parseResult) return null;
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
      return {
        value: value,
        rest: rest
      };
    };
  }

  var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  var parseOrdinalNumberPattern = /\d+/i;
  var matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  var parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };
  var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  var parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };
  var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  var parseMonthPatterns = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
  };
  var matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  var parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };
  var matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  var parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  var match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function valueCallback(value) {
        return parseInt(value, 10);
      }
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseEraPatterns,
      defaultParseWidth: 'any'
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: 'any',
      valueCallback: function valueCallback(index) {
        return index + 1;
      }
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: 'any'
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPatterns,
      defaultParseWidth: 'any'
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: 'any',
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: 'any'
    })
  };

  /**
   * @type {Locale}
   * @category Locales
   * @summary English locale (United States).
   * @language English
   * @iso-639-2 eng
   * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
   * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
   */
  var locale = {
    code: 'en-US',
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
      weekStartsOn: 0 /* Sunday */,
      firstWeekContainsDate: 1
    }
  };

  // - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
  //   (one of the certain letters followed by `o`)
  // - (\w)\1* matches any sequences of the same letter
  // - '' matches two quote characters in a row
  // - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
  //   except a single quote symbol, which ends the sequence.
  //   Two quote characters do not end the sequence.
  //   If there is no matching single quote
  //   then the sequence will continue until the end of the string.
  // - . matches any single character unmatched by previous parts of the RegExps
  var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

  // This RegExp catches symbols escaped by quotes, and also
  // sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
  var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  var escapedStringRegExp = /^'([^]*?)'?$/;
  var doubleQuoteRegExp = /''/g;
  var unescapedLatinCharacterRegExp = /[a-zA-Z]/;

  /**
   * @name format
   * @category Common Helpers
   * @summary Format the date.
   *
   * @description
   * Return the formatted date string in the given format. The result may vary by locale.
   *
   * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
   * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   *
   * The characters wrapped between two single quotes characters (') are escaped.
   * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
   * (see the last example)
   *
   * Format of the string is based on Unicode Technical Standard #35:
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   * with a few additions (see note 7 below the table).
   *
   * Accepted patterns:
   * | Unit                            | Pattern | Result examples                   | Notes |
   * |---------------------------------|---------|-----------------------------------|-------|
   * | Era                             | G..GGG  | AD, BC                            |       |
   * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
   * |                                 | GGGGG   | A, B                              |       |
   * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
   * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
   * |                                 | yy      | 44, 01, 00, 17                    | 5     |
   * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
   * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
   * |                                 | yyyyy   | ...                               | 3,5   |
   * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
   * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
   * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
   * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
   * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
   * |                                 | YYYYY   | ...                               | 3,5   |
   * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
   * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
   * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
   * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
   * |                                 | RRRRR   | ...                               | 3,5,7 |
   * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
   * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
   * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
   * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
   * |                                 | uuuuu   | ...                               | 3,5   |
   * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
   * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
   * |                                 | QQ      | 01, 02, 03, 04                    |       |
   * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
   * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
   * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
   * |                                 | qq      | 01, 02, 03, 04                    |       |
   * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
   * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
   * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
   * |                                 | MM      | 01, 02, ..., 12                   |       |
   * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
   * |                                 | MMMM    | January, February, ..., December  | 2     |
   * |                                 | MMMMM   | J, F, ..., D                      |       |
   * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
   * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
   * |                                 | LL      | 01, 02, ..., 12                   |       |
   * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
   * |                                 | LLLL    | January, February, ..., December  | 2     |
   * |                                 | LLLLL   | J, F, ..., D                      |       |
   * | Local week of year              | w       | 1, 2, ..., 53                     |       |
   * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
   * |                                 | ww      | 01, 02, ..., 53                   |       |
   * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
   * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
   * |                                 | II      | 01, 02, ..., 53                   | 7     |
   * | Day of month                    | d       | 1, 2, ..., 31                     |       |
   * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
   * |                                 | dd      | 01, 02, ..., 31                   |       |
   * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
   * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
   * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
   * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
   * |                                 | DDDD    | ...                               | 3     |
   * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
   * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
   * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
   * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
   * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
   * |                                 | ii      | 01, 02, ..., 07                   | 7     |
   * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
   * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
   * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
   * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
   * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
   * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
   * |                                 | ee      | 02, 03, ..., 01                   |       |
   * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
   * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
   * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
   * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
   * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
   * |                                 | cc      | 02, 03, ..., 01                   |       |
   * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
   * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
   * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
   * | AM, PM                          | a..aa   | AM, PM                            |       |
   * |                                 | aaa     | am, pm                            |       |
   * |                                 | aaaa    | a.m., p.m.                        | 2     |
   * |                                 | aaaaa   | a, p                              |       |
   * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
   * |                                 | bbb     | am, pm, noon, midnight            |       |
   * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
   * |                                 | bbbbb   | a, p, n, mi                       |       |
   * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
   * |                                 | BBBB    | at night, in the morning, ...     | 2     |
   * |                                 | BBBBB   | at night, in the morning, ...     |       |
   * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
   * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
   * |                                 | hh      | 01, 02, ..., 11, 12               |       |
   * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
   * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
   * |                                 | HH      | 00, 01, 02, ..., 23               |       |
   * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
   * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
   * |                                 | KK      | 01, 02, ..., 11, 00               |       |
   * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
   * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
   * |                                 | kk      | 24, 01, 02, ..., 23               |       |
   * | Minute                          | m       | 0, 1, ..., 59                     |       |
   * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
   * |                                 | mm      | 00, 01, ..., 59                   |       |
   * | Second                          | s       | 0, 1, ..., 59                     |       |
   * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
   * |                                 | ss      | 00, 01, ..., 59                   |       |
   * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
   * |                                 | SS      | 00, 01, ..., 99                   |       |
   * |                                 | SSS     | 000, 001, ..., 999                |       |
   * |                                 | SSSS    | ...                               | 3     |
   * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
   * |                                 | XX      | -0800, +0530, Z                   |       |
   * |                                 | XXX     | -08:00, +05:30, Z                 |       |
   * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
   * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
   * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
   * |                                 | xx      | -0800, +0530, +0000               |       |
   * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
   * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
   * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
   * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
   * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
   * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
   * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
   * | Seconds timestamp               | t       | 512969520                         | 7     |
   * |                                 | tt      | ...                               | 3,7   |
   * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
   * |                                 | TT      | ...                               | 3,7   |
   * | Long localized date             | P       | 04/29/1453                        | 7     |
   * |                                 | PP      | Apr 29, 1453                      | 7     |
   * |                                 | PPP     | April 29th, 1453                  | 7     |
   * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
   * | Long localized time             | p       | 12:00 AM                          | 7     |
   * |                                 | pp      | 12:00:00 AM                       | 7     |
   * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
   * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
   * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
   * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
   * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
   * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
   * Notes:
   * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
   *    are the same as "stand-alone" units, but are different in some languages.
   *    "Formatting" units are declined according to the rules of the language
   *    in the context of a date. "Stand-alone" units are always nominative singular:
   *
   *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
   *
   *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
   *
   * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
   *    the single quote characters (see below).
   *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
   *    the output will be the same as default pattern for this unit, usually
   *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
   *    are marked with "2" in the last column of the table.
   *
   *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
   *
   * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
   *    The output will be padded with zeros to match the length of the pattern.
   *
   *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
   *
   * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
   *    These tokens represent the shortest form of the quarter.
   *
   * 5. The main difference between `y` and `u` patterns are B.C. years:
   *
   *    | Year | `y` | `u` |
   *    |------|-----|-----|
   *    | AC 1 |   1 |   1 |
   *    | BC 1 |   1 |   0 |
   *    | BC 2 |   2 |  -1 |
   *
   *    Also `yy` always returns the last two digits of a year,
   *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
   *
   *    | Year | `yy` | `uu` |
   *    |------|------|------|
   *    | 1    |   01 |   01 |
   *    | 14   |   14 |   14 |
   *    | 376  |   76 |  376 |
   *    | 1453 |   53 | 1453 |
   *
   *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
   *    except local week-numbering years are dependent on `options.weekStartsOn`
   *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
   *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
   *
   * 6. Specific non-location timezones are currently unavailable in `date-fns`,
   *    so right now these tokens fall back to GMT timezones.
   *
   * 7. These patterns are not in the Unicode Technical Standard #35:
   *    - `i`: ISO day of week
   *    - `I`: ISO week of year
   *    - `R`: ISO week-numbering year
   *    - `t`: seconds timestamp
   *    - `T`: milliseconds timestamp
   *    - `o`: ordinal number modifier
   *    - `P`: long localized date
   *    - `p`: long localized time
   *
   * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
   *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   *
   * 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
   *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   *
   * @param {Date|Number} date - the original date
   * @param {String} format - the string of tokens
   * @param {Object} [options] - an object with options.
   * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
   * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
   * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
   *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
   *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   * @returns {String} the formatted date string
   * @throws {TypeError} 2 arguments required
   * @throws {RangeError} `date` must not be Invalid Date
   * @throws {RangeError} `options.locale` must contain `localize` property
   * @throws {RangeError} `options.locale` must contain `formatLong` property
   * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
   * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
   * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   * @throws {RangeError} use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   * @throws {RangeError} use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   * @throws {RangeError} format string contains an unescaped latin alphabet character
   *
   * @example
   * // Represent 11 February 2014 in middle-endian format:
   * const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
   * //=> '02/11/2014'
   *
   * @example
   * // Represent 2 July 2014 in Esperanto:
   * import { eoLocale } from 'date-fns/locale/eo'
   * const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
   *   locale: eoLocale
   * })
   * //=> '2-a de julio 2014'
   *
   * @example
   * // Escape string by single quote characters:
   * const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
   * //=> "3 o'clock"
   */

  function format(dirtyDate, dirtyFormatStr, options) {
    var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _defaultOptions$local3, _defaultOptions$local4;
    requiredArgs(2, arguments);
    var formatStr = String(dirtyFormatStr);
    var defaultOptions = getDefaultOptions();
    var locale$1 = (_ref = (_options$locale = void 0 ) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions.locale) !== null && _ref !== void 0 ? _ref : locale;
    var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = void 0 ) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : void 0 ) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);

    // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
    }
    var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = void 0 ) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : void 0 ) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);

    // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
    }
    if (!locale$1.localize) {
      throw new RangeError('locale must contain localize property');
    }
    if (!locale$1.formatLong) {
      throw new RangeError('locale must contain formatLong property');
    }
    var originalDate = toDate(dirtyDate);
    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value');
    }

    // Convert the date in system timezone to the same date in UTC+00:00 timezone.
    // This ensures that when UTC functions will be implemented, locales will be compatible with them.
    // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376
    var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
    var utcDate = subMilliseconds(originalDate, timezoneOffset);
    var formatterOptions = {
      firstWeekContainsDate: firstWeekContainsDate,
      weekStartsOn: weekStartsOn,
      locale: locale$1,
      _originalDate: originalDate
    };
    var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
      var firstCharacter = substring[0];
      if (firstCharacter === 'p' || firstCharacter === 'P') {
        var longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale$1.formatLong);
      }
      return substring;
    }).join('').match(formattingTokensRegExp).map(function (substring) {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return "'";
      }
      var firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return cleanEscapedString(substring);
      }
      var formatter = formatters[firstCharacter];
      if (formatter) {
        if (isProtectedWeekYearToken(substring)) {
          throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
        }
        if (isProtectedDayOfYearToken(substring)) {
          throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
        }
        return formatter(utcDate, substring, locale$1.localize, formatterOptions);
      }
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
      }
      return substring;
    }).join('');
    return result;
  }
  function cleanEscapedString(input) {
    var matched = input.match(escapedStringRegExp);
    if (!matched) {
      return input;
    }
    return matched[1].replace(doubleQuoteRegExp, "'");
  }

  const Exporters = ['csv', 'json', 'xml'];

  const mimeTypes = {
    json: 'application/json',
    csv: 'text/csv',
    xml: 'text/xml'
  };
  const getExportedFileName = extension => `export-${format(Date.now(), 'yyyy-MM-dd_HH-mm')}.${extension}`;
  const ExportComponent = ({
    resource
  }) => {
    const [isFetching, setFetching] = React.useState();
    const sendNotice = adminjs.useNotice();
    const exportData = async type => {
      setFetching(true);
      try {
        const {
          data: {
            exportedData
          }
        } = await new adminjs.ApiClient().resourceAction({
          method: 'post',
          resourceId: resource.id,
          actionName: 'export',
          params: {
            type
          }
        });
        const blob = new Blob([exportedData], {
          type: mimeTypes[type]
        });
        FileSaver_minExports.saveAs(blob, getExportedFileName(type));
        sendNotice({
          message: 'Exported successfully',
          type: 'success'
        });
      } catch (e) {
        sendNotice({
          message: e.message,
          type: 'error'
        });
      }
      setFetching(false);
    };
    if (isFetching) {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null);
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      justifyContent: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      variant: "lg"
    }, "Choose export format:")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      justifyContent: "center"
    }, Exporters.map(parserType => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: parserType,
      m: 2
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      onClick: () => exportData(parserType),
      disabled: isFetching
    }, parserType.toUpperCase())))));
  };

  AdminJS.UserComponents = {};
  AdminJS.env.NODE_ENV = "development";
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.ListRecordLinkProperty = ListRecordLinkProperty;
  AdminJS.UserComponents.EditPasswordProperty = EditPasswordProperty;
  AdminJS.UserComponents.DifferenceRecordProperty = DifferenceRecordProperty;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.RecordDifference = RecordDifference;
  AdminJS.UserComponents.RecordLink = RecordLink;
  AdminJS.UserComponents.PasswordEditComponent = PasswordEdit;
  AdminJS.UserComponents.ImportComponent = ImportComponent;
  AdminJS.UserComponents.ExportComponent = ExportComponent;

})(AdminJSDesignSystem, React, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0Rhc2hib2FyZC9TdGF0Q2FyZC50c3giLCIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0Rhc2hib2FyZC9EYXNoYm9hcmQudHN4IiwiLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9MaXN0UHJvcGVydHkvTGlzdFJlY29yZExpbmtQcm9wZXJ0eS50c3giLCIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0VkaXRQcm9wZXJ0eS9FZGl0UGFzc3dvcmRQcm9wZXJ0eS50c3giLCIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0RpZmZlcmVuY2VQcm9wZXJ0eS9EaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkudHN4IiwiLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9Mb2dpbi9Mb2dpbi50c3giLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZERpZmZlcmVuY2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi91dGlscy9nZXQtbG9nLXByb3BlcnR5LW5hbWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZExpbmsuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvcGFzc3dvcmRzL2J1aWxkL2NvbXBvbmVudHMvUGFzc3dvcmRFZGl0Q29tcG9uZW50LmpzeCIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9pbXBvcnQtZXhwb3J0L2xpYi9jb21wb25lbnRzL0ltcG9ydENvbXBvbmVudC5qc3giLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3JlcXVpcmVkQXJncy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vaXNEYXRlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS90b0RhdGUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2lzVmFsaWQvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvdG9JbnRlZ2VyL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9hZGRNaWxsaXNlY29uZHMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL3N1Yk1pbGxpc2Vjb25kcy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRVVENEYXlPZlllYXIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvc3RhcnRPZlVUQ0lTT1dlZWsvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZ2V0VVRDSVNPV2Vla1llYXIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvc3RhcnRPZlVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ0lTT1dlZWsvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZGVmYXVsdE9wdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvc3RhcnRPZlVUQ1dlZWsvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZ2V0VVRDV2Vla1llYXIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvc3RhcnRPZlVUQ1dlZWtZZWFyL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ1dlZWsvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvYWRkTGVhZGluZ1plcm9zL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2Zvcm1hdC9saWdodEZvcm1hdHRlcnMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZm9ybWF0L2Zvcm1hdHRlcnMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZm9ybWF0L2xvbmdGb3JtYXR0ZXJzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFRpbWV6b25lT2Zmc2V0SW5NaWxsaXNlY29uZHMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvcHJvdGVjdGVkVG9rZW5zL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvX2xpYi9mb3JtYXREaXN0YW5jZS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vbG9jYWxlL19saWIvYnVpbGRGb3JtYXRMb25nRm4vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL2Zvcm1hdExvbmcvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL2Zvcm1hdFJlbGF0aXZlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvX2xpYi9idWlsZExvY2FsaXplRm4vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL2xvY2FsaXplL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvX2xpYi9idWlsZE1hdGNoRm4vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9fbGliL2J1aWxkTWF0Y2hQYXR0ZXJuRm4vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL21hdGNoL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2Zvcm1hdC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9pbXBvcnQtZXhwb3J0L2xpYi9leHBvcnRlci50eXBlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL2ltcG9ydC1leHBvcnQvbGliL2NvbXBvbmVudHMvRXhwb3J0Q29tcG9uZW50LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEJveCwgVGV4dCwgSWNvbiB9IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtXCI7XG5pbXBvcnQgeyBzdHlsZWQgfSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50c1wiO1xuaW1wb3J0IHsgU3RhdENhcmRQcm9wcyB9IGZyb20gXCIuLi8uLi90eXBlcy9kYXNoYm9hcmQvaW5kZXguanNcIjtcblxuY29uc3QgU3RhdENhcmQ6IFJlYWN0LkZDPFN0YXRDYXJkUHJvcHM+ID0gKHtcbiAgaWNvbixcbiAgbGFiZWwsXG4gIHZhbHVlLFxuICBpY29uQ29sb3IsXG59KSA9PiB7XG4gIGNvbnN0IGRpc3BsYXlWYWx1ZSA9XG4gICAgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCA/IFwiLVwiIDogdmFsdWU7XG4gIGNvbnN0IGljb25EaXNwbGF5Q29sb3IgPSBpY29uQ29sb3IgfHwgXCJwcmltYXJ5MTAwXCI7XG5cbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkU3RhdENhcmQ+XG4gICAgICA8SWNvbkNpcmNsZSAkY29sb3I9e2ljb25Db2xvcn0+XG4gICAgICAgIDxJY29uXG4gICAgICAgICAgaWNvbj17aWNvbn1cbiAgICAgICAgICBzaXplPXsyOH1cbiAgICAgICAgICBjb2xvcj17aWNvbkRpc3BsYXlDb2xvcn1cbiAgICAgICAgLz5cbiAgICAgIDwvSWNvbkNpcmNsZT5cbiAgICAgIDxTdGF0TGFiZWw+e2xhYmVsfTwvU3RhdExhYmVsPlxuICAgICAgPFN0YXRWYWx1ZT57ZGlzcGxheVZhbHVlfTwvU3RhdFZhbHVlPlxuICAgIDwvU3R5bGVkU3RhdENhcmQ+XG4gICk7XG59O1xuXG5jb25zdCBTdHlsZWRTdGF0Q2FyZCA9IHN0eWxlZChCb3gpYFxuICBiYWNrZ3JvdW5kOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy53aGl0ZX07XG4gIHBhZGRpbmc6IDEuNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4wMyk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDAuNzVyZW07XG4gIGJvcmRlcjogMXB4IHNvbGlkICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLmJvcmRlcn07XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGVhc2UtaW4tb3V0LCBib3gtc2hhZG93IDAuMnMgZWFzZS1pbi1vdXQ7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICY6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNHB4KTtcbiAgICBib3gtc2hhZG93OiAwIDRweCAxNnB4IHJnYmEoMCwgMCwgMCwgMC4wOCk7XG4gIH1cbmA7XG5cbmNvbnN0IFN0YXRMYWJlbCA9IHN0eWxlZChUZXh0KWBcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy50ZXh0TXV0ZWR9O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xuICBmb250LXdlaWdodDogNTAwO1xuYDtcblxuY29uc3QgU3RhdFZhbHVlID0gc3R5bGVkKFRleHQpYFxuICBmb250LXNpemU6IDJyZW07XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5wcmltYXJ5MTAwfTtcbmA7XG5cbmNvbnN0IEljb25DaXJjbGUgPSBzdHlsZWQoQm94KTx7ICRjb2xvcj86IHN0cmluZyB9PmBcbiAgd2lkdGg6IDQ4cHg7XG4gIGhlaWdodDogNDhweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiAkeyh7ICRjb2xvciwgdGhlbWUgfSkgPT5cbiAgICAkY29sb3IgPyBgJHskY29sb3J9MUFgIDogdGhlbWUuY29sb3JzLnByaW1hcnkxMH07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0Q2FyZDtcbiIsIi8vIGltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IEJveCwgVGV4dCwgSWNvbiwgQnV0dG9uIH0gZnJvbSBcIkBhZG1pbmpzL2Rlc2lnbi1zeXN0ZW1cIjtcbmltcG9ydCBTdGF0Q2FyZCBmcm9tIFwiLi9TdGF0Q2FyZC5qc1wiO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IERhc2hib2FyZERhdGEgfSBmcm9tIFwiLi4vLi4vdHlwZXMvZGFzaGJvYXJkL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZUN1cnJlbnRBZG1pbiwgdXNlTm90aWNlIH0gZnJvbSBcImFkbWluanNcIjtcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtL3N0eWxlZC1jb21wb25lbnRzXCI7XG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlPFBhcnRpYWw8RGFzaGJvYXJkRGF0YT4+KHt9KTtcblxuICAvLyBBcGlDbGllbnQgaXMgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBBZG1pbkpTIGJhY2tlbmQgcm91dGVzLFxuICAvLyBpbmNsdWRpbmcgdGhlIGN1c3RvbSBkYXNoYm9hcmQgaGFuZGxlclxuICBjb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KCk7XG4gIGNvbnN0IHNlbmROb3RpY2UgPSB1c2VOb3RpY2UoKTtcbiAgY29uc3QgW2N1cnJlbnRBZG1pbl0gPSB1c2VDdXJyZW50QWRtaW4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZldGNoRGFzaGJvYXJkRGF0YSgpO1xuICB9LCBbXSk7XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgZGFzaGJvYXJkIGRhdGEgZnJvbSB0aGUgY3VzdG9tIGRhc2hib2FyZCBoYW5kbGVyXG4gICAqL1xuICBjb25zdCBmZXRjaERhc2hib2FyZERhdGEgPSAoc2hvd0xvYWRpbmcgPSB0cnVlKSA9PiB7XG4gICAgaWYgKHNob3dMb2FkaW5nKSBzZXRMb2FkaW5nKHRydWUpO1xuICAgIHNldEVycm9yKG51bGwpO1xuXG4gICAgYXBpXG4gICAgICAuZ2V0RGFzaGJvYXJkKClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBmZXRjaGVkRGF0YSA9IHJlc3BvbnNlLmRhdGEgYXMgRGFzaGJvYXJkRGF0YTtcbiAgICAgICAgaWYgKGZldGNoZWREYXRhLmVycm9yKSB7XG4gICAgICAgICAgc2V0RXJyb3IoZmV0Y2hlZERhdGEuZXJyb3IpO1xuICAgICAgICAgIHNlbmROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogZmV0Y2hlZERhdGEuZXJyb3IsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0RGF0YShmZXRjaGVkRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGRhc2hib2FyZCBkYXRhOlwiLCBlcnIpO1xuICAgICAgICBzZXRFcnJvcihcbiAgICAgICAgICBcIkZhaWxlZCB0byBsb2FkIGRhc2hib2FyZCBkYXRhIGR1ZSB0byBhIG5ldHdvcmsgb3Igc2VydmVyIGlzc3VlLlwiXG4gICAgICAgICk7XG4gICAgICAgIHNlbmROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGxvYWQgZGFzaGJvYXJkIGRhdGEuXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KTtcbiAgfTtcblxuICAvLyBOb3RlIHRoYXQgeW91IGNhbiBhbHNvIHVzZSBheGlvcyBkaXJlY3RseVxuICAvLyBpZiB5b3UgbmVlZCB0byBmZXRjaCBkYXRhIG9yIHNlbmQgZGF0YSB0byBvdGhlciBlbmRwb2ludHNcbiAgLy8gYmFzZWQgb24gdXNlciBpbnRlcmFjdGlvbnMgd2l0aGluIHRoZSBkYXNoYm9hcmQuXG4gIC8vIGNvbnN0IGhhbmRsZXJGZXRjaERhdGEgPSBhc3luYyAoKSA9PiB7XG4gIC8vICAgdHJ5IHtcbiAgLy8gICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KCcveW91ci1jdXN0b20tYXBpLWVuZHBvaW50Jyk7XG4gIC8vICAgICBjb25zb2xlLmxvZygnRGF0YSBmcm9tIGN1c3RvbSBlbmRwb2ludDonLCByZXNwb25zZS5kYXRhKTtcbiAgLy8gICB9IGNhdGNoIChlcnJvcikge1xuICAvLyAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgZnJvbSBjdXN0b20gZW5kcG9pbnQ6JywgZXJyb3IpO1xuICAvLyAgIH1cbiAgLy8gfTtcblxuICBpZiAobG9hZGluZyAmJiBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIChcbiAgICAgIDxMb2FkaW5nQ29udGFpbmVyPlxuICAgICAgICA8TG9hZGluZ0NvbnRlbnQ+XG4gICAgICAgICAgPExvYWRpbmdJY29uXG4gICAgICAgICAgICBpY29uPVwiTG9hZGVyXCJcbiAgICAgICAgICAgIHNwaW5cbiAgICAgICAgICAgIHNpemU9ezMyfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPExvYWRpbmdUZXh0PkxvYWRpbmcgZGFzaGJvYXJkIGRhdGEuLi48L0xvYWRpbmdUZXh0PlxuICAgICAgICA8L0xvYWRpbmdDb250ZW50PlxuICAgICAgPC9Mb2FkaW5nQ29udGFpbmVyPlxuICAgICk7XG5cbiAgaWYgKGVycm9yKVxuICAgIHJldHVybiAoXG4gICAgICA8RXJyb3JDb250YWluZXI+XG4gICAgICAgIDxFcnJvckNvbnRlbnQ+XG4gICAgICAgICAgPEVycm9ySWNvblxuICAgICAgICAgICAgaWNvbj1cIkFsZXJ0Q2lyY2xlXCJcbiAgICAgICAgICAgIHNpemU9ezQwfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEVycm9yVGl0bGU+U29tZXRoaW5nIHdlbnQgd3Jvbmc8L0Vycm9yVGl0bGU+XG4gICAgICAgICAgPEVycm9yTWVzc2FnZT57ZXJyb3J9PC9FcnJvck1lc3NhZ2U+XG4gICAgICAgICAgPFJldHJ5QnV0dG9uIG9uQ2xpY2s9eygpID0+IGZldGNoRGFzaGJvYXJkRGF0YSgpfT5cbiAgICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICAgIGljb249XCJSZWZyZXNoQ3dcIlxuICAgICAgICAgICAgICBtcj1cInNtXCJcbiAgICAgICAgICAgIC8+e1wiIFwifVxuICAgICAgICAgICAgVHJ5IEFnYWluXG4gICAgICAgICAgPC9SZXRyeUJ1dHRvbj5cbiAgICAgICAgPC9FcnJvckNvbnRlbnQ+XG4gICAgICA8L0Vycm9yQ29udGFpbmVyPlxuICAgICk7XG5cbiAgcmV0dXJuIChcbiAgICA8RGFzaGJvYXJkQ29udGFpbmVyPlxuICAgICAgPEhlYWRlckJveD5cbiAgICAgICAgPEdyZWV0aW5nVGV4dD5cbiAgICAgICAgICB7ZGF0YS5tZXNzYWdlIHx8XG4gICAgICAgICAgICBgV2VsY29tZSwgJHtjdXJyZW50QWRtaW4/LmVtYWlsIHx8IFwiQWRtaW5cIn0hYH1cbiAgICAgICAgPC9HcmVldGluZ1RleHQ+XG4gICAgICAgIDxTdWJ0aXRsZVRleHQ+XG4gICAgICAgICAgT3ZlcnZpZXcgb2YgeW91ciBhcHBsaWNhdGlvbidzIGtleSBkdW1teSBtZXRyaWNzLlxuICAgICAgICA8L1N1YnRpdGxlVGV4dD5cbiAgICAgIDwvSGVhZGVyQm94PlxuXG4gICAgICA8U3RhdHNHcmlkPlxuICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICBsYWJlbD1cIkFjdGl2ZSBKb2JzXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5hY3RpdmVKb2JzfVxuICAgICAgICAgIGljb249XCJaYXBcIlxuICAgICAgICAgIGljb25Db2xvcj17XG4gICAgICAgICAgICBkYXRhLmFjdGl2ZUpvYnMgJiYgZGF0YS5hY3RpdmVKb2JzID4gMFxuICAgICAgICAgICAgICA/IFwiIzAwN2JmZlwiXG4gICAgICAgICAgICAgIDogXCIjNmM3NTdkXCJcbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgIGxhYmVsPVwiRmFpbGVkIEpvYnNcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLmZhaWxlZEpvYnN9XG4gICAgICAgICAgaWNvbj1cIkFsZXJ0VHJpYW5nbGVcIlxuICAgICAgICAgIGljb25Db2xvcj17XG4gICAgICAgICAgICBkYXRhLmZhaWxlZEpvYnMgJiYgZGF0YS5mYWlsZWRKb2JzID4gMFxuICAgICAgICAgICAgICA/IFwiI2RjMzU0NVwiXG4gICAgICAgICAgICAgIDogXCIjNmM3NTdkXCJcbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgIGxhYmVsPVwiQ29tcGxldGVkIEpvYnNcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLmNvbXBsZXRlZEpvYnN9XG4gICAgICAgICAgaWNvbj1cIkNoZWNrQ2lyY2xlXCJcbiAgICAgICAgICBpY29uQ29sb3I9XCIjMjhhNzQ1XCJcbiAgICAgICAgLz5cbiAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgbGFiZWw9XCJUb3RhbCBQREZzXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5wZGZzPy50b3RhbH1cbiAgICAgICAgICBpY29uPVwiRmlsZVRleHRcIlxuICAgICAgICAgIGljb25Db2xvcj1cIiMxN2EyYjhcIlxuICAgICAgICAvPlxuICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICBsYWJlbD1cIlBERnMgUHJvY2Vzc2VkXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5wZGZzPy5wcm9jZXNzZWR9XG4gICAgICAgICAgaWNvbj1cIkNoZWNrU3F1YXJlXCJcbiAgICAgICAgICBpY29uQ29sb3I9XCIjMjhhNzQ1XCJcbiAgICAgICAgLz5cbiAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgbGFiZWw9XCJQREZzIFBlbmRpbmdcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLnBkZnM/LnBlbmRpbmd9XG4gICAgICAgICAgaWNvbj1cIkNsb2NrXCJcbiAgICAgICAgICBpY29uQ29sb3I9e1xuICAgICAgICAgICAgZGF0YS5wZGZzPy5wZW5kaW5nICYmIGRhdGEucGRmcy5wZW5kaW5nID4gMFxuICAgICAgICAgICAgICA/IFwiI2ZmYzEwN1wiXG4gICAgICAgICAgICAgIDogXCIjNmM3NTdkXCJcbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgIGxhYmVsPVwiUXVldWUgU2l6ZVwiXG4gICAgICAgICAgdmFsdWU9e2RhdGEucXVldWU/Lml0ZW1zfVxuICAgICAgICAgIGljb249XCJMaXN0XCJcbiAgICAgICAgICBpY29uQ29sb3I9e1xuICAgICAgICAgICAgZGF0YS5xdWV1ZT8uaXRlbXMgJiYgZGF0YS5xdWV1ZS5pdGVtcyA+IDBcbiAgICAgICAgICAgICAgPyBcIiNmZDdlMTRcIlxuICAgICAgICAgICAgICA6IFwiIzZjNzU3ZFwiXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICBsYWJlbD1cIkV4dHJhIERhdGFcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLnF1ZXVlPy5pdGVtc31cbiAgICAgICAgICBpY29uPVwiTGlzdFwiXG4gICAgICAgICAgaWNvbkNvbG9yPXtcbiAgICAgICAgICAgIGRhdGEucXVldWU/Lml0ZW1zICYmIGRhdGEucXVldWUuaXRlbXMgPiAwXG4gICAgICAgICAgICAgID8gXCIjZmQ3ZTE0XCJcbiAgICAgICAgICAgICAgOiBcIiM2Yzc1N2RcIlxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgIDwvU3RhdHNHcmlkPlxuXG4gICAgICA8Rm9vdGVyQm94PlxuICAgICAgICA8VGV4dFxuICAgICAgICAgIHNtYWxsXG4gICAgICAgICAgY29sb3I9XCJ0ZXh0TXV0ZWRcIlxuICAgICAgICA+XG4gICAgICAgICAgTGFzdCB1cGRhdGVkOiB7ZGF0YS5sYXN0VXBkYXRlZCB8fCBcIk4vQVwifVxuICAgICAgICA8L1RleHQ+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwib3V0bGluZWRcIlxuICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gZmV0Y2hEYXNoYm9hcmREYXRhKCl9XG4gICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XG4gICAgICAgID5cbiAgICAgICAgICA8SWNvblxuICAgICAgICAgICAgaWNvbj1cIlJlZnJlc2hDd1wiXG4gICAgICAgICAgICBtcj1cInNtXCJcbiAgICAgICAgICAvPntcIiBcIn1cbiAgICAgICAgICBSZWZyZXNoIERhdGFcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0Zvb3RlckJveD5cbiAgICA8L0Rhc2hib2FyZENvbnRhaW5lcj5cbiAgKTtcbn07XG5cbmNvbnN0IERhc2hib2FyZENvbnRhaW5lciA9IHN0eWxlZChCb3gpYFxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAjZjhmYWZjIDAlLCAjZjFmNWY5IDEwMCUpO1xuICBwYWRkaW5nOiAycmVtO1xuICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICBib3gtc2hhZG93OiAwIDhweCAyNHB4IHJnYmEoMCwgMCwgMCwgMC4wNik7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMudGV4dH07XG4gIGZvbnQtZmFtaWx5OiBcIkludGVyXCIsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgbWFyZ2luOiAxcmVtO1xuYDtcblxuY29uc3QgSGVhZGVyQm94ID0gc3R5bGVkKEJveClgXG4gIG1hcmdpbi1ib3R0b206IDNyZW07XG4gIHBhZGRpbmctYm90dG9tOiAxLjVyZW07XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5ib3JkZXJ9O1xuYDtcblxuY29uc3QgR3JlZXRpbmdUZXh0ID0gc3R5bGVkKFRleHQpYFxuICBmb250LXNpemU6IDIuNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDQ4cHg7XG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5wcmltYXJ5MTAwfTtcbiAgbWFyZ2luLWJvdHRvbTogMC43NXJlbTtcbmA7XG5cbmNvbnN0IFN1YnRpdGxlVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgZm9udC1zaXplOiAxLjJyZW07XG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy50ZXh0TXV0ZWR9O1xuYDtcblxuY29uc3QgU3RhdHNHcmlkID0gc3R5bGVkKEJveClgXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjIwcHgsIDFmcikpO1xuICBnYXA6IDEuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogM3JlbTtcbmA7XG5cbmNvbnN0IEZvb3RlckJveCA9IHN0eWxlZChCb3gpYFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmctdG9wOiAxLjVyZW07XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5ib3JkZXJ9O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMXJlbTtcbmA7XG5cbmNvbnN0IEVycm9yTWVzc2FnZSA9IHN0eWxlZChUZXh0KTx7IHNtYWxsPzogYm9vbGVhbiB9PmBcbiAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLmVycm9yfTtcbiAgYmFja2dyb3VuZDogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMuZXJyb3JMaWdodH07XG4gIHBhZGRpbmc6ICR7KHsgc21hbGwgfSkgPT5cbiAgICBzbWFsbCA/IFwiMC41cmVtIDAuNzVyZW1cIiA6IFwiMC43NXJlbSAxcmVtXCJ9O1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xuICBtYXJnaW46IDAuNXJlbSAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDAuNXJlbTtcblxuICAmOjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6IFwiIVwiO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgbWluLXdpZHRoOiAxOHB4O1xuICAgIGhlaWdodDogMThweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYmFja2dyb3VuZDogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMuZXJyb3J9O1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cbmA7XG5cbmNvbnN0IExvYWRpbmdDb250YWluZXIgPSBzdHlsZWQoRGFzaGJvYXJkQ29udGFpbmVyKWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1pbi1oZWlnaHQ6IDQwMHB4O1xuICBtYXJnaW46IDFyZW07XG5gO1xuXG5jb25zdCBMb2FkaW5nQ29udGVudCA9IHN0eWxlZChCb3gpYFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDJyZW07XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIGJhY2tncm91bmQ6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLndoaXRlfTtcbiAgYm94LXNoYWRvdzogMCA4cHggMjRweCByZ2JhKDAsIDAsIDAsIDAuMDUpO1xuICB3aWR0aDogMTAwJTtcbiAgbWF4LXdpZHRoOiA0MDBweDtcbmA7XG5cbmNvbnN0IExvYWRpbmdJY29uID0gc3R5bGVkKEljb24pYFxuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMucHJpbWFyeTEwMH07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG5gO1xuXG5jb25zdCBMb2FkaW5nVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLnRleHRNdXRlZH07XG4gIGZvbnQtc2l6ZTogMXJlbTtcbmA7XG5cbmNvbnN0IEVycm9yQ29udGFpbmVyID0gc3R5bGVkKExvYWRpbmdDb250YWluZXIpYGA7XG5cbmNvbnN0IEVycm9yQ29udGVudCA9IHN0eWxlZChMb2FkaW5nQ29udGVudClgXG4gIHBhZGRpbmc6IDNyZW0gMnJlbTtcbmA7XG5cbmNvbnN0IEVycm9ySWNvbiA9IHN0eWxlZChJY29uKWBcbiAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLmVycm9yfTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbmA7XG5cbmNvbnN0IEVycm9yVGl0bGUgPSBzdHlsZWQoVGV4dClgXG4gIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLnRleHR9O1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG5gO1xuXG5jb25zdCBSZXRyeUJ1dHRvbiA9IHN0eWxlZChCdXR0b24pYFxuICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gIHBhZGRpbmc6IDAuNXJlbSAxcmVtO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExpbmsgfSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbVwiO1xuaW1wb3J0IHsgTG9nZ2VyUHJvcGVydGllc01hcHBpbmcgYXMgT3JpZ2luYWxMb2dnZXJQcm9wZXJ0aWVzTWFwcGluZyB9IGZyb20gXCJAYWRtaW5qcy9sb2dnZXJcIjtcblxuLy8gRXh0ZW5kIExvZ2dlclByb3BlcnRpZXNNYXBwaW5nIHRvIGFsbG93IHN0cmluZyBpbmRleGluZ1xudHlwZSBMb2dnZXJQcm9wZXJ0aWVzTWFwcGluZyA9IE9yaWdpbmFsTG9nZ2VyUHJvcGVydGllc01hcHBpbmcgJiB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZDtcbn07XG5pbXBvcnQgeyBCYXNlUHJvcGVydHlQcm9wcywgVmlld0hlbHBlcnMgfSBmcm9tIFwiYWRtaW5qc1wiO1xuaW1wb3J0IFJlYWN0LCB7IEZDIH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IGdldExvZ1Byb3BlcnR5TmFtZSA9IChcbiAgcHJvcGVydHk6IHN0cmluZyxcbiAgbWFwcGluZzogTG9nZ2VyUHJvcGVydGllc01hcHBpbmcgPSB7fVxuKSA9PiB7XG4gIGlmICghbWFwcGluZ1twcm9wZXJ0eV0pIHtcbiAgICByZXR1cm4gcHJvcGVydHk7XG4gIH1cblxuICByZXR1cm4gbWFwcGluZ1twcm9wZXJ0eV07XG59O1xuXG5jb25zdCB2aWV3SGVscGVycyA9IG5ldyBWaWV3SGVscGVycygpO1xuY29uc3QgTGlzdFJlY29yZExpbmtQcm9wZXJ0eTogRkM8QmFzZVByb3BlcnR5UHJvcHM+ID0gKHtcbiAgcmVjb3JkLFxuICBwcm9wZXJ0eSxcbn0pID0+IHtcbiAgaWYgKCFyZWNvcmQ/LnBhcmFtcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgeyBjdXN0b20gPSB7fSB9ID0gcHJvcGVydHk7XG4gIGNvbnN0IHsgcHJvcGVydGllc01hcHBpbmcgPSB7fSB9ID0gY3VzdG9tO1xuXG4gIGNvbnN0IHJlY29yZElkUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoXG4gICAgXCJyZWNvcmRJZFwiLFxuICAgIHByb3BlcnRpZXNNYXBwaW5nXG4gICk7XG4gIGNvbnN0IHJlc291cmNlSWRQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZShcbiAgICBcInJlc291cmNlXCIsXG4gICAgcHJvcGVydGllc01hcHBpbmdcbiAgKTtcbiAgY29uc3QgcmVjb3JkVGl0bGVQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZShcbiAgICBcInJlY29yZFRpdGxlXCIsXG4gICAgcHJvcGVydGllc01hcHBpbmdcbiAgKTtcblxuICBjb25zdCByZWNvcmRJZCA9IHJlY29yZC5wYXJhbXNbcmVjb3JkSWRQYXJhbV07XG4gIGNvbnN0IHJlc291cmNlID0gcmVjb3JkLnBhcmFtc1tyZXNvdXJjZUlkUGFyYW1dO1xuICBjb25zdCByZWNvcmRUaXRsZSA9IHJlY29yZC5wYXJhbXNbcmVjb3JkVGl0bGVQYXJhbV07XG5cbiAgaWYgKCFyZWNvcmRJZCB8fCAhcmVzb3VyY2UpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEZvcm1Hcm91cD5cbiAgICAgIDxMaW5rXG4gICAgICAgIGhyZWY9e3ZpZXdIZWxwZXJzLnJlY29yZEFjdGlvblVybCh7XG4gICAgICAgICAgYWN0aW9uTmFtZTogXCJzaG93XCIsXG4gICAgICAgICAgcmVjb3JkSWQsXG4gICAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UsXG4gICAgICAgIH0pfVxuICAgICAgPlxuICAgICAgICB7cmVjb3JkVGl0bGV9XG4gICAgICA8L0xpbms+XG4gICAgPC9Gb3JtR3JvdXA+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBMaXN0UmVjb3JkTGlua1Byb3BlcnR5O1xuIiwiaW1wb3J0IHsgQm94LCBCdXR0b24sIFRleHQgfSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbVwiO1xuaW1wb3J0IHtcbiAgQmFzZVByb3BlcnR5Q29tcG9uZW50LFxuICBFZGl0UHJvcGVydHlQcm9wcyxcbiAgdXNlVHJhbnNsYXRpb24sXG59IGZyb20gXCJhZG1pbmpzXCI7XG5pbXBvcnQgUmVhY3QsIHsgRkMsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgRWRpdFBhc3N3b3JkUHJvcGVydHk6IEZDPEVkaXRQcm9wZXJ0eVByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IG9uQ2hhbmdlLCBwcm9wZXJ0eSwgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHsgdHJhbnNsYXRlQnV0dG9uOiB0YiB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgW3Nob3dQYXNzd29yZCwgdG9nZ2xlUGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFzaG93UGFzc3dvcmQpIHtcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5Lm5hbWUsIFwiXCIpO1xuICAgIH1cbiAgfSwgW29uQ2hhbmdlLCBzaG93UGFzc3dvcmRdKTtcblxuICAvLyBGb3IgbmV3IHJlY29yZHMgYWx3YXlzIHNob3cgdGhlIHByb3BlcnR5XG4gIGlmICghcmVjb3JkLmlkKSB7XG4gICAgcmV0dXJuIDxCYXNlUHJvcGVydHlDb21wb25lbnQuUGFzc3dvcmQuRWRpdCB7Li4ucHJvcHN9IC8+O1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94PlxuICAgICAge3Nob3dQYXNzd29yZCAmJiAoXG4gICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnQuUGFzc3dvcmQuRWRpdCB7Li4ucHJvcHN9IC8+XG4gICAgICApfVxuICAgICAgPEJveCBtYj1cInhsXCI+XG4gICAgICAgIDxUZXh0IHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVBhc3N3b3JkKCFzaG93UGFzc3dvcmQpfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3Nob3dQYXNzd29yZFxuICAgICAgICAgICAgICA/IHRiKFwiY2FuY2VsXCIsIHJlc291cmNlLmlkKVxuICAgICAgICAgICAgICA6IHRiKFwiY2hhbmdlUGFzc3dvcmRcIiwgcmVzb3VyY2UuaWQpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRQYXNzd29yZFByb3BlcnR5O1xuIiwiaW1wb3J0IHtcbiAgTGFiZWwsXG4gIFRhYmxlUm93LFxuICBGb3JtR3JvdXAsXG4gIFRhYmxlQm9keSxcbiAgVGFibGVIZWFkLFxuICBUYWJsZUNlbGwsXG4gIFRhYmxlIGFzIEFkbWluVGFibGUsXG59IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtXCI7XG5pbXBvcnQgeyBCYXNlUHJvcGVydHlQcm9wcywgZmxhdCB9IGZyb20gXCJhZG1pbmpzXCI7XG5pbXBvcnQgUmVhY3QsIHsgRkMgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtL3N0eWxlZC1jb21wb25lbnRzXCI7XG5cbmNvbnN0IENlbGwgPSBzdHlsZWQoVGFibGVDZWxsKWBcbiAgd2lkdGg6IDEwMCU7XG4gIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG5gO1xuY29uc3QgUm93ID0gc3R5bGVkKFRhYmxlUm93KWBcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHVuc2V0O1xuYDtcbmNvbnN0IEhlYWQgPSBzdHlsZWQoVGFibGVIZWFkKWBcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHVuc2V0O1xuYDtcbmNvbnN0IFRhYmxlID0gc3R5bGVkKEFkbWluVGFibGUpYFxuICB3aWR0aDogMTAwJTtcbiAgcG9zaXRpb246IHVuc2V0O1xuICBkaXNwbGF5OiBibG9jaztcbmA7XG5cbmNvbnN0IERpZmZlcmVuY2VSZWNvcmRQcm9wZXJ0eTogRkM8QmFzZVByb3BlcnR5UHJvcHM+ID0gKHtcbiAgcmVjb3JkLFxuICBwcm9wZXJ0eSxcbn0pID0+IHtcbiAgLy8gR2V0IHRoZSB1bmZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoZSBlbnRpcmUgcmVjb3JkXG4gIGNvbnN0IHVuZmxhdHRlbmVkUGFyYW1zID0gZmxhdC51bmZsYXR0ZW4ocmVjb3JkPy5wYXJhbXMgPz8ge30pO1xuICBjb25zdCBkaWZmZXJlbmNlcyA9IHVuZmxhdHRlbmVkUGFyYW1zPy5bcHJvcGVydHkubmFtZV07XG5cbiAgaWYgKCFkaWZmZXJlbmNlcyB8fCB0eXBlb2YgZGlmZmVyZW5jZXMgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPEZvcm1Hcm91cD5cbiAgICAgIDxMYWJlbD57cHJvcGVydHkubGFiZWx9PC9MYWJlbD5cbiAgICAgIDxUYWJsZT5cbiAgICAgICAgPEhlYWQ+XG4gICAgICAgICAgPFJvdz5cbiAgICAgICAgICAgIDxDZWxsPlByb3BlcnR5IG5hbWU8L0NlbGw+XG4gICAgICAgICAgICA8Q2VsbD5CZWZvcmU8L0NlbGw+XG4gICAgICAgICAgICA8Q2VsbD5BZnRlcjwvQ2VsbD5cbiAgICAgICAgICA8L1Jvdz5cbiAgICAgICAgPC9IZWFkPlxuICAgICAgICA8VGFibGVCb2R5PlxuICAgICAgICAgIHtPYmplY3QuZW50cmllcyhcbiAgICAgICAgICAgIGRpZmZlcmVuY2VzIGFzIFJlY29yZDxcbiAgICAgICAgICAgICAgc3RyaW5nLFxuICAgICAgICAgICAgICB7IGJlZm9yZTogc3RyaW5nOyBhZnRlcjogc3RyaW5nIH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICApLm1hcCgoW3Byb3BlcnR5TmFtZSwgeyBiZWZvcmUsIGFmdGVyIH1dKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Um93IGtleT17cHJvcGVydHlOYW1lfT5cbiAgICAgICAgICAgICAgICA8Q2VsbCB3aWR0aD17MSAvIDN9Pntwcm9wZXJ0eU5hbWV9PC9DZWxsPlxuICAgICAgICAgICAgICAgIDxDZWxsXG4gICAgICAgICAgICAgICAgICBjb2xvcj1cInJlZFwiXG4gICAgICAgICAgICAgICAgICB3aWR0aD17MSAvIDN9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge0pTT04uc3RyaW5naWZ5KGJlZm9yZSkgfHwgXCJ1bmRlZmluZWRcIn1cbiAgICAgICAgICAgICAgICA8L0NlbGw+XG4gICAgICAgICAgICAgICAgPENlbGxcbiAgICAgICAgICAgICAgICAgIGNvbG9yPVwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgICAgd2lkdGg9ezEgLyAzfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtKU09OLnN0cmluZ2lmeShhZnRlcikgfHwgXCJ1bmRlZmluZWRcIn1cbiAgICAgICAgICAgICAgICA8L0NlbGw+XG4gICAgICAgICAgICAgIDwvUm93PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9UYWJsZUJvZHk+XG4gICAgICA8L1RhYmxlPlxuICAgIDwvRm9ybUdyb3VwPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRGlmZmVyZW5jZVJlY29yZFByb3BlcnR5O1xuIiwiaW1wb3J0IHtcbiAgSDIsXG4gIEJveCxcbiAgSWNvbixcbiAgTGFiZWwsXG4gIElucHV0LFxuICBCdXR0b24sXG59IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtXCI7XG5pbXBvcnQgeyBMb2dpblByb3BzIH0gZnJvbSBcImFkbWluanNcIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgc3R5bGVkLFxuICBrZXlmcmFtZXMsXG59IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtL3N0eWxlZC1jb21wb25lbnRzXCI7XG5cbmNvbnN0IExvZ2luOiBSZWFjdC5GQzxMb2dpblByb3BzPiA9ICh7IGFjdGlvbiB9KSA9PiB7XG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtpc0VtYWlsRm9jdXNlZCwgc2V0SXNFbWFpbEZvY3VzZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNQYXNzd29yZEZvY3VzZWQsIHNldElzUGFzc3dvcmRGb2N1c2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgZm9ybUFjdGlvbiA9IGFjdGlvbiB8fCBcIi9hZG1pbi9sb2dpblwiO1xuXG4gIHJldHVybiAoXG4gICAgPExvZ2luQ29udGFpbmVyPlxuICAgICAgPEJhY2tncm91bmRQYXR0ZXJuIC8+XG4gICAgICA8V3JhcHBlckJveD5cbiAgICAgICAgPExvZ2luQ2FyZD5cbiAgICAgICAgICA8TG9nb0NvbnRhaW5lcj5cbiAgICAgICAgICAgIDxMb2dvSWNvbj5cbiAgICAgICAgICAgICAgPEljb25cbiAgICAgICAgICAgICAgICBzaXplPXszMn1cbiAgICAgICAgICAgICAgICBpY29uPVwiQ29weVwiXG4gICAgICAgICAgICAgICAgY29sb3I9XCIjNEY0NkU1XCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvTG9nb0ljb24+XG4gICAgICAgICAgICA8U3R5bGVkSDI+VGVtcGxhdGU8L1N0eWxlZEgyPlxuICAgICAgICAgIDwvTG9nb0NvbnRhaW5lcj5cbiAgICAgICAgICA8Zm9ybVxuICAgICAgICAgICAgYWN0aW9uPXtmb3JtQWN0aW9ufVxuICAgICAgICAgICAgbWV0aG9kPVwiUE9TVFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgICAgPFN0eWxlZExhYmVsXG4gICAgICAgICAgICAgICAgaHRtbEZvcj1cImVtYWlsXCJcbiAgICAgICAgICAgICAgICBhY3RpdmU9e2lzRW1haWxGb2N1c2VkIHx8IGVtYWlsLmxlbmd0aCA+IDB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cIkVudmVsb3BlT3BlblwiXG4gICAgICAgICAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIEVtYWlsIEFkZHJlc3NcbiAgICAgICAgICAgICAgPC9TdHlsZWRMYWJlbD5cbiAgICAgICAgICAgICAgPFN0eWxlZElucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgICAgICAgIGlkPVwiZW1haWxcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PlxuICAgICAgICAgICAgICAgICAgc2V0RW1haWwoZS50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNldElzRW1haWxGb2N1c2VkKHRydWUpfVxuICAgICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gc2V0SXNFbWFpbEZvY3VzZWQoZmFsc2UpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgYWN0aXZlPXtpc0VtYWlsRm9jdXNlZH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgICA8U3R5bGVkTGFiZWxcbiAgICAgICAgICAgICAgICBodG1sRm9yPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIGFjdGl2ZT17aXNQYXNzd29yZEZvY3VzZWQgfHwgcGFzc3dvcmQubGVuZ3RoID4gMH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICAgICAgICBpY29uPVwiS2V5XCJcbiAgICAgICAgICAgICAgICAgIHNpemU9ezE2fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgUGFzc3dvcmRcbiAgICAgICAgICAgICAgPC9TdHlsZWRMYWJlbD5cbiAgICAgICAgICAgICAgPFN0eWxlZElucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIGlkPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PlxuICAgICAgICAgICAgICAgICAgc2V0UGFzc3dvcmQoZS50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNldElzUGFzc3dvcmRGb2N1c2VkKHRydWUpfVxuICAgICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gc2V0SXNQYXNzd29yZEZvY3VzZWQoZmFsc2UpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgYWN0aXZlPXtpc1Bhc3N3b3JkRm9jdXNlZH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgICA8QnV0dG9uc0NvbnRhaW5lcj5cbiAgICAgICAgICAgICAgPExvZ2luQnV0dG9uXG4gICAgICAgICAgICAgICAgYXM9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEljb25cbiAgICAgICAgICAgICAgICAgIGljb249XCJMb2dJblwiXG4gICAgICAgICAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlNpZ24gSW48L3NwYW4+XG4gICAgICAgICAgICAgIDwvTG9naW5CdXR0b24+XG5cbiAgICAgICAgICAgICAgPEZvcmdvdFBhc3N3b3JkTGluayBocmVmPVwiI1wiPlxuICAgICAgICAgICAgICAgIEZvcmdvdCBwYXNzd29yZD9cbiAgICAgICAgICAgICAgPC9Gb3Jnb3RQYXNzd29yZExpbms+XG4gICAgICAgICAgICA8L0J1dHRvbnNDb250YWluZXI+XG4gICAgICAgICAgPC9mb3JtPlxuXG4gICAgICAgICAgPEZvb3Rlcj5cbiAgICAgICAgICAgIDxTZWN1cml0eVRleHQ+XG4gICAgICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICAgICAgaWNvbj1cIlNoaWVsZFwiXG4gICAgICAgICAgICAgICAgc2l6ZT17MTR9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjNkI3MjgwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPHNwYW4+U2VjdXJlIEF1dGhlbnRpY2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgPC9TZWN1cml0eVRleHQ+XG4gICAgICAgICAgPC9Gb290ZXI+XG4gICAgICAgIDwvTG9naW5DYXJkPlxuICAgICAgPC9XcmFwcGVyQm94PlxuICAgIDwvTG9naW5Db250YWluZXI+XG4gICk7XG59O1xuXG5jb25zdCBwdWxzZSA9IGtleWZyYW1lc2BcbiAgMCUgeyBvcGFjaXR5OiAwLjg7IHRyYW5zZm9ybTogc2NhbGUoMSk7IH1cbiAgNTAlIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTsgfVxuICAxMDAlIHsgb3BhY2l0eTogMC44OyB0cmFuc2Zvcm06IHNjYWxlKDEpOyB9XG5gO1xuXG5jb25zdCBMb2dpbkNvbnRhaW5lciA9IHN0eWxlZChCb3gpYFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kOiAjZjhmYWY5O1xuYDtcblxuY29uc3QgQmFja2dyb3VuZFBhdHRlcm4gPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgb3BhY2l0eTogMC40O1xuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4O1xuICB6LWluZGV4OiAxO1xuYDtcblxuY29uc3QgV3JhcHBlckJveCA9IHN0eWxlZChCb3gpYFxuICB6LWluZGV4OiAyO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nOiA2cmVtIDFyZW0gMTByZW07XG5gO1xuXG5pbnRlcmZhY2UgTG9naW5DYXJkUHJvcHMge1xuICBpc0hvdmVyaW5nOiBib29sZWFuO1xufVxuXG5jb25zdCBMb2dpbkNhcmQgPSBzdHlsZWQoQm94KTxMb2dpbkNhcmRQcm9wcz5gXG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDQyMHB4O1xuICBwYWRkaW5nOiAyLjVyZW07XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45NSk7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJveC1zaGFkb3c6IDAgMjBweCAyNXB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjEpLFxuICAgIDAgMTBweCAxMHB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjA0KSxcbiAgICAwIDAgMCAxcHggcmdiYSg3OSwgNzAsIDIyOSwgMC4xKSBpbnNldDtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwcHgpO1xuICB0cmFuc2l0aW9uOiBhbGwgMC44cyBlYXNlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgJjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogLTJweDtcbiAgICBsZWZ0OiAtMnB4O1xuICAgIHJpZ2h0OiAtMnB4O1xuICAgIGJvdHRvbTogLTJweDtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDQwMCUgNDAwJTtcbiAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgIHotaW5kZXg6IC0xO1xuICAgIG9wYWNpdHk6ICR7KHByb3BzKSA9PiAocHJvcHMuaXNIb3ZlcmluZyA/IDEgOiAwLjcpfTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZTtcbiAgfVxuXG4gICY6aG92ZXIge1xuICAgIGJveC1zaGFkb3c6IDAgMjVweCA1MHB4IC0xMnB4IHJnYmEoMCwgMCwgMCwgMC4yNSksXG4gICAgICAwIDAgMCAxcHggcmdiYSg3OSwgNzAsIDIyOSwgMC4yKSBpbnNldDtcblxuICAgICY6YmVmb3JlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBMb2dvQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbmA7XG5cbmNvbnN0IExvZ29JY29uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHdpZHRoOiA2NHB4O1xuICBoZWlnaHQ6IDY0cHg7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNlZWYyZmYgMCUsICNjN2QyZmUgMTAwJSk7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgYW5pbWF0aW9uOiAke3B1bHNlfSAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcbmA7XG5cbmNvbnN0IFN0eWxlZEgyID0gc3R5bGVkKEgyKWBcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1zaXplOiAxLjc1cmVtO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICM0ZjQ2ZTUsICM4MThjZjgpO1xuICAtd2Via2l0LWJhY2tncm91bmQtY2xpcDogdGV4dDtcbiAgYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xuICAtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGxldHRlci1zcGFjaW5nOiAtMC4wMjVlbTtcbiAgbWFyZ2luOiAwO1xuYDtcblxuY29uc3QgRm9ybUdyb3VwID0gc3R5bGVkKEJveClgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMC41cmVtO1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbmA7XG5cbmludGVyZmFjZSBMYWJlbFByb3BzIHtcbiAgYWN0aXZlOiBib29sZWFuO1xufVxuXG5jb25zdCBTdHlsZWRMYWJlbCA9IHN0eWxlZChMYWJlbCk8TGFiZWxQcm9wcz5gXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogJHsocHJvcHMpID0+IChwcm9wcy5hY3RpdmUgPyBcIiM0RjQ2RTVcIiA6IFwiIzZCNzI4MFwiKX07XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgZWFzZTtcblxuICBzdmcge1xuICAgIGNvbG9yOiAkeyhwcm9wcykgPT4gKHByb3BzLmFjdGl2ZSA/IFwiIzRGNDZFNVwiIDogXCIjOUNBM0FGXCIpfTtcbiAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG4gIH1cbmA7XG5cbmludGVyZmFjZSBJbnB1dFByb3BzIHtcbiAgYWN0aXZlOiBib29sZWFuO1xufVxuXG5jb25zdCBTdHlsZWRJbnB1dCA9IHN0eWxlZChJbnB1dCk8SW5wdXRQcm9wcz5gXG4gIGJhY2tncm91bmQ6ICR7KHByb3BzKSA9PiAocHJvcHMuYWN0aXZlID8gXCIjRjlGQUZCXCIgOiBcIiNGM0Y0RjZcIil9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7KHByb3BzKSA9PiAocHJvcHMuYWN0aXZlID8gXCIjODE4Q0Y4XCIgOiBcIiNFNUU3RUJcIil9O1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBwYWRkaW5nOiAwLjc1cmVtIDFyZW07XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgYm94LXNoYWRvdzogJHsocHJvcHMpID0+XG4gICAgcHJvcHMuYWN0aXZlID8gXCIwIDAgMCA0cHggcmdiYSgxMjksIDE0MCwgMjQ4LCAwLjEpXCIgOiBcIm5vbmVcIn07XG5cbiAgJjpob3ZlciB7XG4gICAgYm9yZGVyLWNvbG9yOiAkeyhwcm9wcykgPT5cbiAgICAgIHByb3BzLmFjdGl2ZSA/IFwiIzgxOENGOFwiIDogXCIjRDFENURCXCJ9O1xuICB9XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItY29sb3I6ICM2MzY2ZjE7XG4gICAgYmFja2dyb3VuZDogI2Y5ZmFmYjtcbiAgICBib3gtc2hhZG93OiAwIDAgMCA0cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMSk7XG4gIH1cbmA7XG5cbmNvbnN0IEJ1dHRvbnNDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDFyZW07XG4gIG1hcmdpbi10b3A6IDJyZW07XG5gO1xuXG5jb25zdCBMb2dpbkJ1dHRvbiA9IHN0eWxlZChCdXR0b24pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZ2FwOiAwLjVyZW07XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM0ZjQ2ZTUsICM2MzY2ZjEpO1xuICBjb2xvcjogd2hpdGU7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHBhZGRpbmc6IDAuODc1cmVtIDEuNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgYm9yZGVyOiBub25lO1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggLTFweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC41KTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICY6aG92ZXIge1xuICAgIGJveC1zaGFkb3c6IDAgMTBweCAxNXB4IC0zcHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNCk7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzQzMzhjYSwgIzRmNDZlNSk7XG4gIH1cblxuICAmOmFjdGl2ZSB7XG4gICAgYm94LXNoYWRvdzogMCAycHggNHB4IC0xcHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNSk7XG4gIH1cblxuICAmOmJlZm9yZSB7XG4gICAgY29udGVudDogXCJcIjtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IC0xMDAlO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoXG4gICAgICB0byByaWdodCxcbiAgICAgIHRyYW5zcGFyZW50LFxuICAgICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpLFxuICAgICAgdHJhbnNwYXJlbnRcbiAgICApO1xuICAgIHRyYW5zaXRpb246IGxlZnQgMC43cyBlYXNlO1xuICB9XG5cbiAgJjpob3ZlcjpiZWZvcmUge1xuICAgIGxlZnQ6IDEwMCU7XG4gIH1cbmA7XG5cbmNvbnN0IEZvcmdvdFBhc3N3b3JkTGluayA9IHN0eWxlZC5hYFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjNmI3MjgwO1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgZWFzZTtcblxuICAmOmhvdmVyIHtcbiAgICBjb2xvcjogIzRmNDZlNTtcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgfVxuYDtcblxuY29uc3QgRm9vdGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbi10b3A6IDJyZW07XG4gIHBhZGRpbmctdG9wOiAxLjVyZW07XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTVlN2ViO1xuYDtcblxuY29uc3QgU2VjdXJpdHlUZXh0ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjVyZW07XG4gIGNvbG9yOiAjNmI3MjgwO1xuICBmb250LXNpemU6IDAuNzVyZW07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBMb2dpbjtcbiIsImltcG9ydCB7IEZvcm1Hcm91cCwgTGFiZWwsIFRhYmxlIGFzIEFkbWluVGFibGUsIFRhYmxlQm9keSwgVGFibGVDZWxsLCBUYWJsZUhlYWQsIFRhYmxlUm93LCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHMnO1xuY29uc3QgQ2VsbCA9IHN0eWxlZChUYWJsZUNlbGwpIGBcbiAgd2lkdGg6IDEwMCU7XG4gIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG5gO1xuY29uc3QgUm93ID0gc3R5bGVkKFRhYmxlUm93KSBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiB1bnNldDtcbmA7XG5jb25zdCBIZWFkID0gc3R5bGVkKFRhYmxlSGVhZCkgYFxuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogdW5zZXQ7XG5gO1xuY29uc3QgVGFibGUgPSBzdHlsZWQoQWRtaW5UYWJsZSkgYFxuICB3aWR0aDogMTAwJTtcbiAgcG9zaXRpb246IHVuc2V0O1xuICBkaXNwbGF5OiBibG9jaztcbmA7XG5jb25zdCBSZWNvcmREaWZmZXJlbmNlID0gKHsgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgY29uc3QgZGlmZmVyZW5jZXMgPSBKU09OLnBhcnNlKFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgZmxhdC51bmZsYXR0ZW4ocmVjb3JkPy5wYXJhbXMgPz8ge30pPy5bcHJvcGVydHkubmFtZV0gPz8ge30pO1xuICAgIGlmICghZGlmZmVyZW5jZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHByb3BlcnR5LmxhYmVsKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJsZSwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGVhZCwgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCBudWxsLCBcIlByb3BlcnR5IG5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgbnVsbCwgXCJCZWZvcmVcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgbnVsbCwgXCJBZnRlclwiKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJsZUJvZHksIG51bGwsIE9iamVjdC5lbnRyaWVzKGRpZmZlcmVuY2VzKS5tYXAoKFtwcm9wZXJ0eU5hbWUsIHsgYmVmb3JlLCBhZnRlciB9XSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsga2V5OiBwcm9wZXJ0eU5hbWUgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCB7IHdpZHRoOiAxIC8gMyB9LCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIHsgY29sb3I6IFwicmVkXCIsIHdpZHRoOiAxIC8gMyB9LCBKU09OLnN0cmluZ2lmeShiZWZvcmUpIHx8ICd1bmRlZmluZWQnKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCB7IGNvbG9yOiBcImdyZWVuXCIsIHdpZHRoOiAxIC8gMyB9LCBKU09OLnN0cmluZ2lmeShhZnRlcikgfHwgJ3VuZGVmaW5lZCcpKSk7XG4gICAgICAgICAgICB9KSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgUmVjb3JkRGlmZmVyZW5jZTtcbiIsImV4cG9ydCBjb25zdCBnZXRMb2dQcm9wZXJ0eU5hbWUgPSAocHJvcGVydHksIG1hcHBpbmcgPSB7fSkgPT4ge1xuICAgIGlmICghbWFwcGluZ1twcm9wZXJ0eV0pIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xuICAgIH1cbiAgICByZXR1cm4gbWFwcGluZ1twcm9wZXJ0eV07XG59O1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMaW5rIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBWaWV3SGVscGVycyB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldExvZ1Byb3BlcnR5TmFtZSB9IGZyb20gJy4uL3V0aWxzL2dldC1sb2ctcHJvcGVydHktbmFtZS5qcyc7XG5jb25zdCB2aWV3SGVscGVycyA9IG5ldyBWaWV3SGVscGVycygpO1xuY29uc3QgUmVjb3JkTGluayA9ICh7IHJlY29yZCwgcHJvcGVydHkgfSkgPT4ge1xuICAgIGlmICghcmVjb3JkPy5wYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgY3VzdG9tID0ge30gfSA9IHByb3BlcnR5O1xuICAgIGNvbnN0IHsgcHJvcGVydGllc01hcHBpbmcgPSB7fSB9ID0gY3VzdG9tO1xuICAgIGNvbnN0IHJlY29yZElkUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoJ3JlY29yZElkJywgcHJvcGVydGllc01hcHBpbmcpO1xuICAgIGNvbnN0IHJlc291cmNlSWRQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZSgncmVzb3VyY2UnLCBwcm9wZXJ0aWVzTWFwcGluZyk7XG4gICAgY29uc3QgcmVjb3JkVGl0bGVQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZSgncmVjb3JkVGl0bGUnLCBwcm9wZXJ0aWVzTWFwcGluZyk7XG4gICAgY29uc3QgcmVjb3JkSWQgPSByZWNvcmQucGFyYW1zW3JlY29yZElkUGFyYW1dO1xuICAgIGNvbnN0IHJlc291cmNlID0gcmVjb3JkLnBhcmFtc1tyZXNvdXJjZUlkUGFyYW1dO1xuICAgIGNvbnN0IHJlY29yZFRpdGxlID0gcmVjb3JkLnBhcmFtc1tyZWNvcmRUaXRsZVBhcmFtXTtcbiAgICBpZiAoIXJlY29yZElkIHx8ICFyZXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IGhyZWY6IHZpZXdIZWxwZXJzLnJlY29yZEFjdGlvblVybCh7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3Nob3cnLFxuICAgICAgICAgICAgICAgIHJlY29yZElkLFxuICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLFxuICAgICAgICAgICAgfSkgfSwgcmVjb3JkVGl0bGUpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgUmVjb3JkTGluaztcbiIsImltcG9ydCB7IEJveCwgQnV0dG9uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IFBhc3N3b3JkRWRpdCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgb25DaGFuZ2UsIHByb3BlcnR5LCByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zbGF0ZUJ1dHRvbjogdGIgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgW3Nob3dQYXNzd29yZCwgdG9nZ2xlUGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc2hvd1Bhc3N3b3JkKSB7XG4gICAgICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCAnJyk7XG4gICAgICAgIH1cbiAgICB9LCBbb25DaGFuZ2UsIHNob3dQYXNzd29yZF0pO1xuICAgIC8vIEZvciBuZXcgcmVjb3JkcyBhbHdheXMgc2hvdyB0aGUgcHJvcGVydHlcbiAgICBpZiAoIXJlY29yZC5pZCkge1xuICAgICAgICByZXR1cm4gPEJhc2VQcm9wZXJ0eUNvbXBvbmVudC5QYXNzd29yZC5FZGl0IHsuLi5wcm9wc30vPjtcbiAgICB9XG4gICAgcmV0dXJuICg8Qm94PlxuICAgICAge3Nob3dQYXNzd29yZCAmJiA8QmFzZVByb3BlcnR5Q29tcG9uZW50LlBhc3N3b3JkLkVkaXQgey4uLnByb3BzfS8+fVxuICAgICAgPEJveCBtYj1cInhsXCI+XG4gICAgICAgIDxUZXh0IHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxCdXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlUGFzc3dvcmQoIXNob3dQYXNzd29yZCl9IHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICAgIHtzaG93UGFzc3dvcmQgPyB0YignY2FuY2VsJywgcmVzb3VyY2UuaWQpIDogdGIoJ2NoYW5nZVBhc3N3b3JkJywgcmVzb3VyY2UuaWQpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD4pO1xufTtcbmV4cG9ydCBkZWZhdWx0IFBhc3N3b3JkRWRpdDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgeyBEcm9wWm9uZUl0ZW0sIExvYWRlciwgQm94LCBCdXR0b24sIERyb3Bab25lLCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuY29uc3QgSW1wb3J0Q29tcG9uZW50ID0gKHsgcmVzb3VyY2UgfSkgPT4ge1xuICAgIGNvbnN0IFtmaWxlLCBzZXRGaWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHNlbmROb3RpY2UgPSB1c2VOb3RpY2UoKTtcbiAgICBjb25zdCBbaXNGZXRjaGluZywgc2V0RmV0Y2hpbmddID0gdXNlU3RhdGUoKTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICh1cGxvYWRlZEZpbGUpID0+IHtcbiAgICAgICAgc2V0RmlsZSh1cGxvYWRlZEZpbGU/LlswXSA/PyBudWxsKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uU3VibWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRGZXRjaGluZyh0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIGltcG9ydERhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSwgZmlsZT8ubmFtZSk7XG4gICAgICAgICAgICBhd2FpdCBuZXcgQXBpQ2xpZW50KCkucmVzb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLmlkLFxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdpbXBvcnQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGltcG9ydERhdGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbmROb3RpY2UoeyBtZXNzYWdlOiAnSW1wb3J0ZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzZW5kTm90aWNlKHsgbWVzc2FnZTogZS5tZXNzYWdlLCB0eXBlOiAnZXJyb3InIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNldEZldGNoaW5nKGZhbHNlKTtcbiAgICB9O1xuICAgIGlmIChpc0ZldGNoaW5nKSB7XG4gICAgICAgIHJldHVybiA8TG9hZGVyIC8+O1xuICAgIH1cbiAgICByZXR1cm4gKDxCb3ggbWFyZ2luPVwiYXV0b1wiIG1heFdpZHRoPXs2MDB9IGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIiBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCI+XG4gICAgICA8RHJvcFpvbmUgZmlsZXM9e1tdfSBvbkNoYW5nZT17b25VcGxvYWR9IG11bHRpcGxlPXtmYWxzZX0vPlxuICAgICAge2ZpbGUgJiYgKDxEcm9wWm9uZUl0ZW0gZmlsZT17ZmlsZX0gZmlsZW5hbWU9e2ZpbGUubmFtZX0gb25SZW1vdmU9eygpID0+IHNldEZpbGUobnVsbCl9Lz4pfVxuICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCIgbT17MTB9PlxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uU3VibWl0fSBkaXNhYmxlZD17IWZpbGUgfHwgaXNGZXRjaGluZ30+XG4gICAgICAgICAgVXBsb2FkXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+KTtcbn07XG5leHBvcnQgZGVmYXVsdCBJbXBvcnRDb21wb25lbnQ7XG4iLCJmdW5jdGlvbiBfdHlwZW9mKG8pIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG87XG4gIH0gOiBmdW5jdGlvbiAobykge1xuICAgIHJldHVybiBvICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG8uY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvO1xuICB9LCBfdHlwZW9mKG8pO1xufVxuZXhwb3J0IHsgX3R5cGVvZiBhcyBkZWZhdWx0IH07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVxdWlyZWRBcmdzKHJlcXVpcmVkLCBhcmdzKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA8IHJlcXVpcmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihyZXF1aXJlZCArICcgYXJndW1lbnQnICsgKHJlcXVpcmVkID4gMSA/ICdzJyA6ICcnKSArICcgcmVxdWlyZWQsIGJ1dCBvbmx5ICcgKyBhcmdzLmxlbmd0aCArICcgcHJlc2VudCcpO1xuICB9XG59IiwiaW1wb3J0IF90eXBlb2YgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3R5cGVvZlwiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbi8qKlxuICogQG5hbWUgaXNEYXRlXG4gKiBAY2F0ZWdvcnkgQ29tbW9uIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IElzIHRoZSBnaXZlbiB2YWx1ZSBhIGRhdGU/XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIERhdGUuIFRoZSBmdW5jdGlvbiB3b3JrcyBmb3IgZGF0ZXMgdHJhbnNmZXJyZWQgYWNyb3NzIGlmcmFtZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIHRoZSB2YWx1ZSB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgZGF0ZVxuICogQHRocm93cyB7VHlwZUVycm9yfSAxIGFyZ3VtZW50cyByZXF1aXJlZFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBGb3IgYSB2YWxpZCBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNEYXRlKG5ldyBEYXRlKCkpXG4gKiAvLz0+IHRydWVcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIGFuIGludmFsaWQgZGF0ZTpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzRGF0ZShuZXcgRGF0ZShOYU4pKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciBzb21lIHZhbHVlOlxuICogY29uc3QgcmVzdWx0ID0gaXNEYXRlKCcyMDE0LTAyLTMxJylcbiAqIC8vPT4gZmFsc2VcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIGFuIG9iamVjdDpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzRGF0ZSh7fSlcbiAqIC8vPT4gZmFsc2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlIHx8IF90eXBlb2YodmFsdWUpID09PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBEYXRlXSc7XG59IiwiaW1wb3J0IF90eXBlb2YgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3R5cGVvZlwiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbi8qKlxuICogQG5hbWUgdG9EYXRlXG4gKiBAY2F0ZWdvcnkgQ29tbW9uIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IENvbnZlcnQgdGhlIGdpdmVuIGFyZ3VtZW50IHRvIGFuIGluc3RhbmNlIG9mIERhdGUuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb252ZXJ0IHRoZSBnaXZlbiBhcmd1bWVudCB0byBhbiBpbnN0YW5jZSBvZiBEYXRlLlxuICpcbiAqIElmIHRoZSBhcmd1bWVudCBpcyBhbiBpbnN0YW5jZSBvZiBEYXRlLCB0aGUgZnVuY3Rpb24gcmV0dXJucyBpdHMgY2xvbmUuXG4gKlxuICogSWYgdGhlIGFyZ3VtZW50IGlzIGEgbnVtYmVyLCBpdCBpcyB0cmVhdGVkIGFzIGEgdGltZXN0YW1wLlxuICpcbiAqIElmIHRoZSBhcmd1bWVudCBpcyBub25lIG9mIHRoZSBhYm92ZSwgdGhlIGZ1bmN0aW9uIHJldHVybnMgSW52YWxpZCBEYXRlLlxuICpcbiAqICoqTm90ZSoqOiAqYWxsKiBEYXRlIGFyZ3VtZW50cyBwYXNzZWQgdG8gYW55ICpkYXRlLWZucyogZnVuY3Rpb24gaXMgcHJvY2Vzc2VkIGJ5IGB0b0RhdGVgLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGFyZ3VtZW50IC0gdGhlIHZhbHVlIHRvIGNvbnZlcnRcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGUgaW4gdGhlIGxvY2FsIHRpbWUgem9uZVxuICogQHRocm93cyB7VHlwZUVycm9yfSAxIGFyZ3VtZW50IHJlcXVpcmVkXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENsb25lIHRoZSBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gdG9EYXRlKG5ldyBEYXRlKDIwMTQsIDEsIDExLCAxMSwgMzAsIDMwKSlcbiAqIC8vPT4gVHVlIEZlYiAxMSAyMDE0IDExOjMwOjMwXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENvbnZlcnQgdGhlIHRpbWVzdGFtcCB0byBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gdG9EYXRlKDEzOTIwOTg0MzAwMDApXG4gKiAvLz0+IFR1ZSBGZWIgMTEgMjAxNCAxMTozMDozMFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b0RhdGUoYXJndW1lbnQpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBhcmdTdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnQpO1xuXG4gIC8vIENsb25lIHRoZSBkYXRlXG4gIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIERhdGUgfHwgX3R5cGVvZihhcmd1bWVudCkgPT09ICdvYmplY3QnICYmIGFyZ1N0ciA9PT0gJ1tvYmplY3QgRGF0ZV0nKSB7XG4gICAgLy8gUHJldmVudCB0aGUgZGF0ZSB0byBsb3NlIHRoZSBtaWxsaXNlY29uZHMgd2hlbiBwYXNzZWQgdG8gbmV3IERhdGUoKSBpbiBJRTEwXG4gICAgcmV0dXJuIG5ldyBEYXRlKGFyZ3VtZW50LmdldFRpbWUoKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50ID09PSAnbnVtYmVyJyB8fCBhcmdTdHIgPT09ICdbb2JqZWN0IE51bWJlcl0nKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGFyZ3VtZW50KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoKHR5cGVvZiBhcmd1bWVudCA9PT0gJ3N0cmluZycgfHwgYXJnU3RyID09PSAnW29iamVjdCBTdHJpbmddJykgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFwiU3RhcnRpbmcgd2l0aCB2Mi4wLjAtYmV0YS4xIGRhdGUtZm5zIGRvZXNuJ3QgYWNjZXB0IHN0cmluZ3MgYXMgZGF0ZSBhcmd1bWVudHMuIFBsZWFzZSB1c2UgYHBhcnNlSVNPYCB0byBwYXJzZSBzdHJpbmdzLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VwZ3JhZGVHdWlkZS5tZCNzdHJpbmctYXJndW1lbnRzXCIpO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihuZXcgRXJyb3IoKS5zdGFjayk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRGF0ZShOYU4pO1xuICB9XG59IiwiaW1wb3J0IGlzRGF0ZSBmcm9tIFwiLi4vaXNEYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9EYXRlIGZyb20gXCIuLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG4vKipcbiAqIEBuYW1lIGlzVmFsaWRcbiAqIEBjYXRlZ29yeSBDb21tb24gSGVscGVyc1xuICogQHN1bW1hcnkgSXMgdGhlIGdpdmVuIGRhdGUgdmFsaWQ/XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIGZhbHNlIGlmIGFyZ3VtZW50IGlzIEludmFsaWQgRGF0ZSBhbmQgdHJ1ZSBvdGhlcndpc2UuXG4gKiBBcmd1bWVudCBpcyBjb252ZXJ0ZWQgdG8gRGF0ZSB1c2luZyBgdG9EYXRlYC4gU2VlIFt0b0RhdGVde0BsaW5rIGh0dHBzOi8vZGF0ZS1mbnMub3JnL2RvY3MvdG9EYXRlfVxuICogSW52YWxpZCBEYXRlIGlzIGEgRGF0ZSwgd2hvc2UgdGltZSB2YWx1ZSBpcyBOYU4uXG4gKlxuICogVGltZSB2YWx1ZSBvZiBEYXRlOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjkuMS4xXG4gKlxuICogQHBhcmFtIHsqfSBkYXRlIC0gdGhlIGRhdGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtCb29sZWFufSB0aGUgZGF0ZSBpcyB2YWxpZFxuICogQHRocm93cyB7VHlwZUVycm9yfSAxIGFyZ3VtZW50IHJlcXVpcmVkXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciB0aGUgdmFsaWQgZGF0ZTpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzVmFsaWQobmV3IERhdGUoMjAxNCwgMSwgMzEpKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciB0aGUgdmFsdWUsIGNvbnZlcnRhYmxlIGludG8gYSBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNWYWxpZCgxMzkzODA0ODAwMDAwKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciB0aGUgaW52YWxpZCBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNWYWxpZChuZXcgRGF0ZSgnJykpXG4gKiAvLz0+IGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVmFsaWQoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICBpZiAoIWlzRGF0ZShkaXJ0eURhdGUpICYmIHR5cGVvZiBkaXJ0eURhdGUgIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHJldHVybiAhaXNOYU4oTnVtYmVyKGRhdGUpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b0ludGVnZXIoZGlydHlOdW1iZXIpIHtcbiAgaWYgKGRpcnR5TnVtYmVyID09PSBudWxsIHx8IGRpcnR5TnVtYmVyID09PSB0cnVlIHx8IGRpcnR5TnVtYmVyID09PSBmYWxzZSkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgdmFyIG51bWJlciA9IE51bWJlcihkaXJ0eU51bWJlcik7XG4gIGlmIChpc05hTihudW1iZXIpKSB7XG4gICAgcmV0dXJuIG51bWJlcjtcbiAgfVxuICByZXR1cm4gbnVtYmVyIDwgMCA/IE1hdGguY2VpbChudW1iZXIpIDogTWF0aC5mbG9vcihudW1iZXIpO1xufSIsImltcG9ydCB0b0ludGVnZXIgZnJvbSBcIi4uL19saWIvdG9JbnRlZ2VyL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9EYXRlIGZyb20gXCIuLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG4vKipcbiAqIEBuYW1lIGFkZE1pbGxpc2Vjb25kc1xuICogQGNhdGVnb3J5IE1pbGxpc2Vjb25kIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IEFkZCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhlIGdpdmVuIGRhdGUuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBZGQgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGRhdGUgLSB0aGUgZGF0ZSB0byBiZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge051bWJlcn0gYW1vdW50IC0gdGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gYmUgYWRkZWQuIFBvc2l0aXZlIGRlY2ltYWxzIHdpbGwgYmUgcm91bmRlZCB1c2luZyBgTWF0aC5mbG9vcmAsIGRlY2ltYWxzIGxlc3MgdGhhbiB6ZXJvIHdpbGwgYmUgcm91bmRlZCB1c2luZyBgTWF0aC5jZWlsYC5cbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbmV3IGRhdGUgd2l0aCB0aGUgbWlsbGlzZWNvbmRzIGFkZGVkXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDIgYXJndW1lbnRzIHJlcXVpcmVkXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEFkZCA3NTAgbWlsbGlzZWNvbmRzIHRvIDEwIEp1bHkgMjAxNCAxMjo0NTozMC4wMDA6XG4gKiBjb25zdCByZXN1bHQgPSBhZGRNaWxsaXNlY29uZHMobmV3IERhdGUoMjAxNCwgNiwgMTAsIDEyLCA0NSwgMzAsIDApLCA3NTApXG4gKiAvLz0+IFRodSBKdWwgMTAgMjAxNCAxMjo0NTozMC43NTBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkTWlsbGlzZWNvbmRzKGRpcnR5RGF0ZSwgZGlydHlBbW91bnQpIHtcbiAgcmVxdWlyZWRBcmdzKDIsIGFyZ3VtZW50cyk7XG4gIHZhciB0aW1lc3RhbXAgPSB0b0RhdGUoZGlydHlEYXRlKS5nZXRUaW1lKCk7XG4gIHZhciBhbW91bnQgPSB0b0ludGVnZXIoZGlydHlBbW91bnQpO1xuICByZXR1cm4gbmV3IERhdGUodGltZXN0YW1wICsgYW1vdW50KTtcbn0iLCJpbXBvcnQgYWRkTWlsbGlzZWNvbmRzIGZyb20gXCIuLi9hZGRNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi9fbGliL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSBzdWJNaWxsaXNlY29uZHNcbiAqIEBjYXRlZ29yeSBNaWxsaXNlY29uZCBIZWxwZXJzXG4gKiBAc3VtbWFyeSBTdWJ0cmFjdCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMgZnJvbSB0aGUgZ2l2ZW4gZGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN1YnRyYWN0IHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBmcm9tIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGRhdGUgLSB0aGUgZGF0ZSB0byBiZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge051bWJlcn0gYW1vdW50IC0gdGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gYmUgc3VidHJhY3RlZC4gUG9zaXRpdmUgZGVjaW1hbHMgd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmZsb29yYCwgZGVjaW1hbHMgbGVzcyB0aGFuIHplcm8gd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmNlaWxgLlxuICogQHJldHVybnMge0RhdGV9IHRoZSBuZXcgZGF0ZSB3aXRoIHRoZSBtaWxsaXNlY29uZHMgc3VidHJhY3RlZFxuICogQHRocm93cyB7VHlwZUVycm9yfSAyIGFyZ3VtZW50cyByZXF1aXJlZFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBTdWJ0cmFjdCA3NTAgbWlsbGlzZWNvbmRzIGZyb20gMTAgSnVseSAyMDE0IDEyOjQ1OjMwLjAwMDpcbiAqIGNvbnN0IHJlc3VsdCA9IHN1Yk1pbGxpc2Vjb25kcyhuZXcgRGF0ZSgyMDE0LCA2LCAxMCwgMTIsIDQ1LCAzMCwgMCksIDc1MClcbiAqIC8vPT4gVGh1IEp1bCAxMCAyMDE0IDEyOjQ1OjI5LjI1MFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdWJNaWxsaXNlY29uZHMoZGlydHlEYXRlLCBkaXJ0eUFtb3VudCkge1xuICByZXF1aXJlZEFyZ3MoMiwgYXJndW1lbnRzKTtcbiAgdmFyIGFtb3VudCA9IHRvSW50ZWdlcihkaXJ0eUFtb3VudCk7XG4gIHJldHVybiBhZGRNaWxsaXNlY29uZHMoZGlydHlEYXRlLCAtYW1vdW50KTtcbn0iLCJpbXBvcnQgdG9EYXRlIGZyb20gXCIuLi8uLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xudmFyIE1JTExJU0VDT05EU19JTl9EQVkgPSA4NjQwMDAwMDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVUQ0RheU9mWWVhcihkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciB0aW1lc3RhbXAgPSBkYXRlLmdldFRpbWUoKTtcbiAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIHN0YXJ0T2ZZZWFyVGltZXN0YW1wID0gZGF0ZS5nZXRUaW1lKCk7XG4gIHZhciBkaWZmZXJlbmNlID0gdGltZXN0YW1wIC0gc3RhcnRPZlllYXJUaW1lc3RhbXA7XG4gIHJldHVybiBNYXRoLmZsb29yKGRpZmZlcmVuY2UgLyBNSUxMSVNFQ09ORFNfSU5fREFZKSArIDE7XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXJ0T2ZVVENJU09XZWVrKGRpcnR5RGF0ZSkge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIHdlZWtTdGFydHNPbiA9IDE7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciBkYXkgPSBkYXRlLmdldFVUQ0RheSgpO1xuICB2YXIgZGlmZiA9IChkYXkgPCB3ZWVrU3RhcnRzT24gPyA3IDogMCkgKyBkYXkgLSB3ZWVrU3RhcnRzT247XG4gIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIGRpZmYpO1xuICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZGF0ZTtcbn0iLCJpbXBvcnQgdG9EYXRlIGZyb20gXCIuLi8uLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENJU09XZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDSVNPV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VVRDSVNPV2Vla1llYXIoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgZGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuICB2YXIgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgdmFyIGZvdXJ0aE9mSmFudWFyeU9mTmV4dFllYXIgPSBuZXcgRGF0ZSgwKTtcbiAgZm91cnRoT2ZKYW51YXJ5T2ZOZXh0WWVhci5zZXRVVENGdWxsWWVhcih5ZWFyICsgMSwgMCwgNCk7XG4gIGZvdXJ0aE9mSmFudWFyeU9mTmV4dFllYXIuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBzdGFydE9mTmV4dFllYXIgPSBzdGFydE9mVVRDSVNPV2Vlayhmb3VydGhPZkphbnVhcnlPZk5leHRZZWFyKTtcbiAgdmFyIGZvdXJ0aE9mSmFudWFyeU9mVGhpc1llYXIgPSBuZXcgRGF0ZSgwKTtcbiAgZm91cnRoT2ZKYW51YXJ5T2ZUaGlzWWVhci5zZXRVVENGdWxsWWVhcih5ZWFyLCAwLCA0KTtcbiAgZm91cnRoT2ZKYW51YXJ5T2ZUaGlzWWVhci5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIHN0YXJ0T2ZUaGlzWWVhciA9IHN0YXJ0T2ZVVENJU09XZWVrKGZvdXJ0aE9mSmFudWFyeU9mVGhpc1llYXIpO1xuICBpZiAoZGF0ZS5nZXRUaW1lKCkgPj0gc3RhcnRPZk5leHRZZWFyLmdldFRpbWUoKSkge1xuICAgIHJldHVybiB5ZWFyICsgMTtcbiAgfSBlbHNlIGlmIChkYXRlLmdldFRpbWUoKSA+PSBzdGFydE9mVGhpc1llYXIuZ2V0VGltZSgpKSB7XG4gICAgcmV0dXJuIHllYXI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHllYXIgLSAxO1xuICB9XG59IiwiaW1wb3J0IGdldFVUQ0lTT1dlZWtZZWFyIGZyb20gXCIuLi9nZXRVVENJU09XZWVrWWVhci9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENJU09XZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDSVNPV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGFydE9mVVRDSVNPV2Vla1llYXIoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgeWVhciA9IGdldFVUQ0lTT1dlZWtZZWFyKGRpcnR5RGF0ZSk7XG4gIHZhciBmb3VydGhPZkphbnVhcnkgPSBuZXcgRGF0ZSgwKTtcbiAgZm91cnRoT2ZKYW51YXJ5LnNldFVUQ0Z1bGxZZWFyKHllYXIsIDAsIDQpO1xuICBmb3VydGhPZkphbnVhcnkuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBkYXRlID0gc3RhcnRPZlVUQ0lTT1dlZWsoZm91cnRoT2ZKYW51YXJ5KTtcbiAgcmV0dXJuIGRhdGU7XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ0lTT1dlZWsgZnJvbSBcIi4uL3N0YXJ0T2ZVVENJU09XZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ0lTT1dlZWtZZWFyIGZyb20gXCIuLi9zdGFydE9mVVRDSVNPV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xudmFyIE1JTExJU0VDT05EU19JTl9XRUVLID0gNjA0ODAwMDAwO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VVRDSVNPV2VlayhkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciBkaWZmID0gc3RhcnRPZlVUQ0lTT1dlZWsoZGF0ZSkuZ2V0VGltZSgpIC0gc3RhcnRPZlVUQ0lTT1dlZWtZZWFyKGRhdGUpLmdldFRpbWUoKTtcblxuICAvLyBSb3VuZCB0aGUgbnVtYmVyIG9mIGRheXMgdG8gdGhlIG5lYXJlc3QgaW50ZWdlclxuICAvLyBiZWNhdXNlIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGluIGEgd2VlayBpcyBub3QgY29uc3RhbnRcbiAgLy8gKGUuZy4gaXQncyBkaWZmZXJlbnQgaW4gdGhlIHdlZWsgb2YgdGhlIGRheWxpZ2h0IHNhdmluZyB0aW1lIGNsb2NrIHNoaWZ0KVxuICByZXR1cm4gTWF0aC5yb3VuZChkaWZmIC8gTUlMTElTRUNPTkRTX0lOX1dFRUspICsgMTtcbn0iLCJ2YXIgZGVmYXVsdE9wdGlvbnMgPSB7fTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIGRlZmF1bHRPcHRpb25zO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldERlZmF1bHRPcHRpb25zKG5ld09wdGlvbnMpIHtcbiAgZGVmYXVsdE9wdGlvbnMgPSBuZXdPcHRpb25zO1xufSIsImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi90b0ludGVnZXIvaW5kZXguanNcIjtcbmltcG9ydCB7IGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSBcIi4uL2RlZmF1bHRPcHRpb25zL2luZGV4LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGFydE9mVVRDV2VlayhkaXJ0eURhdGUsIG9wdGlvbnMpIHtcbiAgdmFyIF9yZWYsIF9yZWYyLCBfcmVmMywgX29wdGlvbnMkd2Vla1N0YXJ0c09uLCBfb3B0aW9ucyRsb2NhbGUsIF9vcHRpb25zJGxvY2FsZSRvcHRpbywgX2RlZmF1bHRPcHRpb25zJGxvY2FsLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyO1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0gZ2V0RGVmYXVsdE9wdGlvbnMoKTtcbiAgdmFyIHdlZWtTdGFydHNPbiA9IHRvSW50ZWdlcigoX3JlZiA9IChfcmVmMiA9IChfcmVmMyA9IChfb3B0aW9ucyR3ZWVrU3RhcnRzT24gPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyR3ZWVrU3RhcnRzT24gIT09IHZvaWQgMCA/IF9vcHRpb25zJHdlZWtTdGFydHNPbiA6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZSA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUkb3B0aW8gPSBfb3B0aW9ucyRsb2NhbGUub3B0aW9ucykgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlJG9wdGlvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb3B0aW9ucyRsb2NhbGUkb3B0aW8ud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmMyAhPT0gdm9pZCAwID8gX3JlZjMgOiBkZWZhdWx0T3B0aW9ucy53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWYyICE9PSB2b2lkIDAgPyBfcmVmMiA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPSBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPSBfZGVmYXVsdE9wdGlvbnMkbG9jYWwub3B0aW9ucykgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RlZmF1bHRPcHRpb25zJGxvY2FsMi53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWYgIT09IHZvaWQgMCA/IF9yZWYgOiAwKTtcblxuICAvLyBUZXN0IGlmIHdlZWtTdGFydHNPbiBpcyBiZXR3ZWVuIDAgYW5kIDYgX2FuZF8gaXMgbm90IE5hTlxuICBpZiAoISh3ZWVrU3RhcnRzT24gPj0gMCAmJiB3ZWVrU3RhcnRzT24gPD0gNikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignd2Vla1N0YXJ0c09uIG11c3QgYmUgYmV0d2VlbiAwIGFuZCA2IGluY2x1c2l2ZWx5Jyk7XG4gIH1cbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIGRheSA9IGRhdGUuZ2V0VVRDRGF5KCk7XG4gIHZhciBkaWZmID0gKGRheSA8IHdlZWtTdGFydHNPbiA/IDcgOiAwKSArIGRheSAtIHdlZWtTdGFydHNPbjtcbiAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gZGlmZik7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkYXRlO1xufSIsImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ1dlZWsgZnJvbSBcIi4uL3N0YXJ0T2ZVVENXZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi90b0ludGVnZXIvaW5kZXguanNcIjtcbmltcG9ydCB7IGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSBcIi4uL2RlZmF1bHRPcHRpb25zL2luZGV4LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVVENXZWVrWWVhcihkaXJ0eURhdGUsIG9wdGlvbnMpIHtcbiAgdmFyIF9yZWYsIF9yZWYyLCBfcmVmMywgX29wdGlvbnMkZmlyc3RXZWVrQ29uLCBfb3B0aW9ucyRsb2NhbGUsIF9vcHRpb25zJGxvY2FsZSRvcHRpbywgX2RlZmF1bHRPcHRpb25zJGxvY2FsLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyO1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGdldERlZmF1bHRPcHRpb25zKCk7XG4gIHZhciBmaXJzdFdlZWtDb250YWluc0RhdGUgPSB0b0ludGVnZXIoKF9yZWYgPSAoX3JlZjIgPSAoX3JlZjMgPSAoX29wdGlvbnMkZmlyc3RXZWVrQ29uID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX29wdGlvbnMkZmlyc3RXZWVrQ29uICE9PSB2b2lkIDAgPyBfb3B0aW9ucyRmaXJzdFdlZWtDb24gOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlJG9wdGlvID0gX29wdGlvbnMkbG9jYWxlLm9wdGlvbnMpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZSRvcHRpbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX29wdGlvbnMkbG9jYWxlJG9wdGlvLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjMgIT09IHZvaWQgMCA/IF9yZWYzIDogZGVmYXVsdE9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmMiAhPT0gdm9pZCAwID8gX3JlZjIgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsID0gZGVmYXVsdE9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID0gX2RlZmF1bHRPcHRpb25zJGxvY2FsLm9wdGlvbnMpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmICE9PSB2b2lkIDAgPyBfcmVmIDogMSk7XG5cbiAgLy8gVGVzdCBpZiB3ZWVrU3RhcnRzT24gaXMgYmV0d2VlbiAxIGFuZCA3IF9hbmRfIGlzIG5vdCBOYU5cbiAgaWYgKCEoZmlyc3RXZWVrQ29udGFpbnNEYXRlID49IDEgJiYgZmlyc3RXZWVrQ29udGFpbnNEYXRlIDw9IDcpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2ZpcnN0V2Vla0NvbnRhaW5zRGF0ZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNyBpbmNsdXNpdmVseScpO1xuICB9XG4gIHZhciBmaXJzdFdlZWtPZk5leHRZZWFyID0gbmV3IERhdGUoMCk7XG4gIGZpcnN0V2Vla09mTmV4dFllYXIuc2V0VVRDRnVsbFllYXIoeWVhciArIDEsIDAsIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSk7XG4gIGZpcnN0V2Vla09mTmV4dFllYXIuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBzdGFydE9mTmV4dFllYXIgPSBzdGFydE9mVVRDV2VlayhmaXJzdFdlZWtPZk5leHRZZWFyLCBvcHRpb25zKTtcbiAgdmFyIGZpcnN0V2Vla09mVGhpc1llYXIgPSBuZXcgRGF0ZSgwKTtcbiAgZmlyc3RXZWVrT2ZUaGlzWWVhci5zZXRVVENGdWxsWWVhcih5ZWFyLCAwLCBmaXJzdFdlZWtDb250YWluc0RhdGUpO1xuICBmaXJzdFdlZWtPZlRoaXNZZWFyLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB2YXIgc3RhcnRPZlRoaXNZZWFyID0gc3RhcnRPZlVUQ1dlZWsoZmlyc3RXZWVrT2ZUaGlzWWVhciwgb3B0aW9ucyk7XG4gIGlmIChkYXRlLmdldFRpbWUoKSA+PSBzdGFydE9mTmV4dFllYXIuZ2V0VGltZSgpKSB7XG4gICAgcmV0dXJuIHllYXIgKyAxO1xuICB9IGVsc2UgaWYgKGRhdGUuZ2V0VGltZSgpID49IHN0YXJ0T2ZUaGlzWWVhci5nZXRUaW1lKCkpIHtcbiAgICByZXR1cm4geWVhcjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geWVhciAtIDE7XG4gIH1cbn0iLCJpbXBvcnQgZ2V0VVRDV2Vla1llYXIgZnJvbSBcIi4uL2dldFVUQ1dlZWtZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmltcG9ydCBzdGFydE9mVVRDV2VlayBmcm9tIFwiLi4vc3RhcnRPZlVUQ1dlZWsvaW5kZXguanNcIjtcbmltcG9ydCB0b0ludGVnZXIgZnJvbSBcIi4uL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tIFwiLi4vZGVmYXVsdE9wdGlvbnMvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXJ0T2ZVVENXZWVrWWVhcihkaXJ0eURhdGUsIG9wdGlvbnMpIHtcbiAgdmFyIF9yZWYsIF9yZWYyLCBfcmVmMywgX29wdGlvbnMkZmlyc3RXZWVrQ29uLCBfb3B0aW9ucyRsb2NhbGUsIF9vcHRpb25zJGxvY2FsZSRvcHRpbywgX2RlZmF1bHRPcHRpb25zJGxvY2FsLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyO1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0gZ2V0RGVmYXVsdE9wdGlvbnMoKTtcbiAgdmFyIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSA9IHRvSW50ZWdlcigoX3JlZiA9IChfcmVmMiA9IChfcmVmMyA9IChfb3B0aW9ucyRmaXJzdFdlZWtDb24gPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyRmaXJzdFdlZWtDb24gIT09IHZvaWQgMCA/IF9vcHRpb25zJGZpcnN0V2Vla0NvbiA6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZSA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUkb3B0aW8gPSBfb3B0aW9ucyRsb2NhbGUub3B0aW9ucykgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlJG9wdGlvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb3B0aW9ucyRsb2NhbGUkb3B0aW8uZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmMyAhPT0gdm9pZCAwID8gX3JlZjMgOiBkZWZhdWx0T3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYyICE9PSB2b2lkIDAgPyBfcmVmMiA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPSBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPSBfZGVmYXVsdE9wdGlvbnMkbG9jYWwub3B0aW9ucykgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RlZmF1bHRPcHRpb25zJGxvY2FsMi5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYgIT09IHZvaWQgMCA/IF9yZWYgOiAxKTtcbiAgdmFyIHllYXIgPSBnZXRVVENXZWVrWWVhcihkaXJ0eURhdGUsIG9wdGlvbnMpO1xuICB2YXIgZmlyc3RXZWVrID0gbmV3IERhdGUoMCk7XG4gIGZpcnN0V2Vlay5zZXRVVENGdWxsWWVhcih5ZWFyLCAwLCBmaXJzdFdlZWtDb250YWluc0RhdGUpO1xuICBmaXJzdFdlZWsuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBkYXRlID0gc3RhcnRPZlVUQ1dlZWsoZmlyc3RXZWVrLCBvcHRpb25zKTtcbiAgcmV0dXJuIGRhdGU7XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ1dlZWsgZnJvbSBcIi4uL3N0YXJ0T2ZVVENXZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ1dlZWtZZWFyIGZyb20gXCIuLi9zdGFydE9mVVRDV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xudmFyIE1JTExJU0VDT05EU19JTl9XRUVLID0gNjA0ODAwMDAwO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VVRDV2VlayhkaXJ0eURhdGUsIG9wdGlvbnMpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciBkaWZmID0gc3RhcnRPZlVUQ1dlZWsoZGF0ZSwgb3B0aW9ucykuZ2V0VGltZSgpIC0gc3RhcnRPZlVUQ1dlZWtZZWFyKGRhdGUsIG9wdGlvbnMpLmdldFRpbWUoKTtcblxuICAvLyBSb3VuZCB0aGUgbnVtYmVyIG9mIGRheXMgdG8gdGhlIG5lYXJlc3QgaW50ZWdlclxuICAvLyBiZWNhdXNlIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGluIGEgd2VlayBpcyBub3QgY29uc3RhbnRcbiAgLy8gKGUuZy4gaXQncyBkaWZmZXJlbnQgaW4gdGhlIHdlZWsgb2YgdGhlIGRheWxpZ2h0IHNhdmluZyB0aW1lIGNsb2NrIHNoaWZ0KVxuICByZXR1cm4gTWF0aC5yb3VuZChkaWZmIC8gTUlMTElTRUNPTkRTX0lOX1dFRUspICsgMTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRMZWFkaW5nWmVyb3MobnVtYmVyLCB0YXJnZXRMZW5ndGgpIHtcbiAgdmFyIHNpZ24gPSBudW1iZXIgPCAwID8gJy0nIDogJyc7XG4gIHZhciBvdXRwdXQgPSBNYXRoLmFicyhudW1iZXIpLnRvU3RyaW5nKCk7XG4gIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgb3V0cHV0ID0gJzAnICsgb3V0cHV0O1xuICB9XG4gIHJldHVybiBzaWduICsgb3V0cHV0O1xufSIsImltcG9ydCBhZGRMZWFkaW5nWmVyb3MgZnJvbSBcIi4uLy4uL2FkZExlYWRpbmdaZXJvcy9pbmRleC5qc1wiO1xuLypcbiAqIHwgICAgIHwgVW5pdCAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgIHwgVW5pdCAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwtLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAqIHwgIGEgIHwgQU0sIFBNICAgICAgICAgICAgICAgICAgICAgICAgIHwgIEEqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGQgIHwgRGF5IG9mIG1vbnRoICAgICAgICAgICAgICAgICAgIHwgIEQgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGggIHwgSG91ciBbMS0xMl0gICAgICAgICAgICAgICAgICAgIHwgIEggIHwgSG91ciBbMC0yM10gICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIG0gIHwgTWludXRlICAgICAgICAgICAgICAgICAgICAgICAgIHwgIE0gIHwgTW9udGggICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIHMgIHwgU2Vjb25kICAgICAgICAgICAgICAgICAgICAgICAgIHwgIFMgIHwgRnJhY3Rpb24gb2Ygc2Vjb25kICAgICAgICAgICAgIHxcbiAqIHwgIHkgIHwgWWVhciAoYWJzKSAgICAgICAgICAgICAgICAgICAgIHwgIFkgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqXG4gKiBMZXR0ZXJzIG1hcmtlZCBieSAqIGFyZSBub3QgaW1wbGVtZW50ZWQgYnV0IHJlc2VydmVkIGJ5IFVuaWNvZGUgc3RhbmRhcmQuXG4gKi9cbnZhciBmb3JtYXR0ZXJzID0ge1xuICAvLyBZZWFyXG4gIHk6IGZ1bmN0aW9uIHkoZGF0ZSwgdG9rZW4pIHtcbiAgICAvLyBGcm9tIGh0dHA6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtMzEvdHIzNS1kYXRlcy5odG1sI0RhdGVfRm9ybWF0X3Rva2Vuc1xuICAgIC8vIHwgWWVhciAgICAgfCAgICAgeSB8IHl5IHwgICB5eXkgfCAgeXl5eSB8IHl5eXl5IHxcbiAgICAvLyB8LS0tLS0tLS0tLXwtLS0tLS0tfC0tLS18LS0tLS0tLXwtLS0tLS0tfC0tLS0tLS18XG4gICAgLy8gfCBBRCAxICAgICB8ICAgICAxIHwgMDEgfCAgIDAwMSB8ICAwMDAxIHwgMDAwMDEgfFxuICAgIC8vIHwgQUQgMTIgICAgfCAgICAxMiB8IDEyIHwgICAwMTIgfCAgMDAxMiB8IDAwMDEyIHxcbiAgICAvLyB8IEFEIDEyMyAgIHwgICAxMjMgfCAyMyB8ICAgMTIzIHwgIDAxMjMgfCAwMDEyMyB8XG4gICAgLy8gfCBBRCAxMjM0ICB8ICAxMjM0IHwgMzQgfCAgMTIzNCB8ICAxMjM0IHwgMDEyMzQgfFxuICAgIC8vIHwgQUQgMTIzNDUgfCAxMjM0NSB8IDQ1IHwgMTIzNDUgfCAxMjM0NSB8IDEyMzQ1IHxcblxuICAgIHZhciBzaWduZWRZZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgIC8vIFJldHVybnMgMSBmb3IgMSBCQyAod2hpY2ggaXMgeWVhciAwIGluIEphdmFTY3JpcHQpXG4gICAgdmFyIHllYXIgPSBzaWduZWRZZWFyID4gMCA/IHNpZ25lZFllYXIgOiAxIC0gc2lnbmVkWWVhcjtcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHRva2VuID09PSAneXknID8geWVhciAlIDEwMCA6IHllYXIsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIE1vbnRoXG4gIE06IGZ1bmN0aW9uIE0oZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgbW9udGggPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgcmV0dXJuIHRva2VuID09PSAnTScgPyBTdHJpbmcobW9udGggKyAxKSA6IGFkZExlYWRpbmdaZXJvcyhtb250aCArIDEsIDIpO1xuICB9LFxuICAvLyBEYXkgb2YgdGhlIG1vbnRoXG4gIGQ6IGZ1bmN0aW9uIGQoZGF0ZSwgdG9rZW4pIHtcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGRhdGUuZ2V0VVRDRGF0ZSgpLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBBTSBvciBQTVxuICBhOiBmdW5jdGlvbiBhKGRhdGUsIHRva2VuKSB7XG4gICAgdmFyIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRhdGUuZ2V0VVRDSG91cnMoKSAvIDEyID49IDEgPyAncG0nIDogJ2FtJztcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdhJzpcbiAgICAgIGNhc2UgJ2FhJzpcbiAgICAgICAgcmV0dXJuIGRheVBlcmlvZEVudW1WYWx1ZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgY2FzZSAnYWFhJzpcbiAgICAgICAgcmV0dXJuIGRheVBlcmlvZEVudW1WYWx1ZTtcbiAgICAgIGNhc2UgJ2FhYWFhJzpcbiAgICAgICAgcmV0dXJuIGRheVBlcmlvZEVudW1WYWx1ZVswXTtcbiAgICAgIGNhc2UgJ2FhYWEnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRheVBlcmlvZEVudW1WYWx1ZSA9PT0gJ2FtJyA/ICdhLm0uJyA6ICdwLm0uJztcbiAgICB9XG4gIH0sXG4gIC8vIEhvdXIgWzEtMTJdXG4gIGg6IGZ1bmN0aW9uIGgoZGF0ZSwgdG9rZW4pIHtcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGRhdGUuZ2V0VVRDSG91cnMoKSAlIDEyIHx8IDEyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBIb3VyIFswLTIzXVxuICBIOiBmdW5jdGlvbiBIKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFVUQ0hvdXJzKCksIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIE1pbnV0ZVxuICBtOiBmdW5jdGlvbiBtKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFVUQ01pbnV0ZXMoKSwgdG9rZW4ubGVuZ3RoKTtcbiAgfSxcbiAgLy8gU2Vjb25kXG4gIHM6IGZ1bmN0aW9uIHMoZGF0ZSwgdG9rZW4pIHtcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGRhdGUuZ2V0VVRDU2Vjb25kcygpLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBGcmFjdGlvbiBvZiBzZWNvbmRcbiAgUzogZnVuY3Rpb24gUyhkYXRlLCB0b2tlbikge1xuICAgIHZhciBudW1iZXJPZkRpZ2l0cyA9IHRva2VuLmxlbmd0aDtcbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gZGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgICB2YXIgZnJhY3Rpb25hbFNlY29uZHMgPSBNYXRoLmZsb29yKG1pbGxpc2Vjb25kcyAqIE1hdGgucG93KDEwLCBudW1iZXJPZkRpZ2l0cyAtIDMpKTtcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGZyYWN0aW9uYWxTZWNvbmRzLCB0b2tlbi5sZW5ndGgpO1xuICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgZm9ybWF0dGVyczsiLCJpbXBvcnQgZ2V0VVRDRGF5T2ZZZWFyIGZyb20gXCIuLi8uLi8uLi9fbGliL2dldFVUQ0RheU9mWWVhci9pbmRleC5qc1wiO1xuaW1wb3J0IGdldFVUQ0lTT1dlZWsgZnJvbSBcIi4uLy4uLy4uL19saWIvZ2V0VVRDSVNPV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IGdldFVUQ0lTT1dlZWtZZWFyIGZyb20gXCIuLi8uLi8uLi9fbGliL2dldFVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VVRDV2VlayBmcm9tIFwiLi4vLi4vLi4vX2xpYi9nZXRVVENXZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VVRDV2Vla1llYXIgZnJvbSBcIi4uLy4uLy4uL19saWIvZ2V0VVRDV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCBhZGRMZWFkaW5nWmVyb3MgZnJvbSBcIi4uLy4uL2FkZExlYWRpbmdaZXJvcy9pbmRleC5qc1wiO1xuaW1wb3J0IGxpZ2h0Rm9ybWF0dGVycyBmcm9tIFwiLi4vbGlnaHRGb3JtYXR0ZXJzL2luZGV4LmpzXCI7XG52YXIgZGF5UGVyaW9kRW51bSA9IHtcbiAgYW06ICdhbScsXG4gIHBtOiAncG0nLFxuICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgbm9vbjogJ25vb24nLFxuICBtb3JuaW5nOiAnbW9ybmluZycsXG4gIGFmdGVybm9vbjogJ2FmdGVybm9vbicsXG4gIGV2ZW5pbmc6ICdldmVuaW5nJyxcbiAgbmlnaHQ6ICduaWdodCdcbn07XG4vKlxuICogfCAgICAgfCBVbml0ICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgfCBVbml0ICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfC0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICogfCAgYSAgfCBBTSwgUE0gICAgICAgICAgICAgICAgICAgICAgICAgfCAgQSogfCBNaWxsaXNlY29uZHMgaW4gZGF5ICAgICAgICAgICAgfFxuICogfCAgYiAgfCBBTSwgUE0sIG5vb24sIG1pZG5pZ2h0ICAgICAgICAgfCAgQiAgfCBGbGV4aWJsZSBkYXkgcGVyaW9kICAgICAgICAgICAgfFxuICogfCAgYyAgfCBTdGFuZC1hbG9uZSBsb2NhbCBkYXkgb2Ygd2VlayAgfCAgQyogfCBMb2NhbGl6ZWQgaG91ciB3LyBkYXkgcGVyaW9kICAgfFxuICogfCAgZCAgfCBEYXkgb2YgbW9udGggICAgICAgICAgICAgICAgICAgfCAgRCAgfCBEYXkgb2YgeWVhciAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgZSAgfCBMb2NhbCBkYXkgb2Ygd2VlayAgICAgICAgICAgICAgfCAgRSAgfCBEYXkgb2Ygd2VlayAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgZiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgRiogfCBEYXkgb2Ygd2VlayBpbiBtb250aCAgICAgICAgICAgfFxuICogfCAgZyogfCBNb2RpZmllZCBKdWxpYW4gZGF5ICAgICAgICAgICAgfCAgRyAgfCBFcmEgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgaCAgfCBIb3VyIFsxLTEyXSAgICAgICAgICAgICAgICAgICAgfCAgSCAgfCBIb3VyIFswLTIzXSAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgaSEgfCBJU08gZGF5IG9mIHdlZWsgICAgICAgICAgICAgICAgfCAgSSEgfCBJU08gd2VlayBvZiB5ZWFyICAgICAgICAgICAgICAgfFxuICogfCAgaiogfCBMb2NhbGl6ZWQgaG91ciB3LyBkYXkgcGVyaW9kICAgfCAgSiogfCBMb2NhbGl6ZWQgaG91ciB3L28gZGF5IHBlcmlvZCAgfFxuICogfCAgayAgfCBIb3VyIFsxLTI0XSAgICAgICAgICAgICAgICAgICAgfCAgSyAgfCBIb3VyIFswLTExXSAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbCogfCAoZGVwcmVjYXRlZCkgICAgICAgICAgICAgICAgICAgfCAgTCAgfCBTdGFuZC1hbG9uZSBtb250aCAgICAgICAgICAgICAgfFxuICogfCAgbSAgfCBNaW51dGUgICAgICAgICAgICAgICAgICAgICAgICAgfCAgTSAgfCBNb250aCAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgTiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbyEgfCBPcmRpbmFsIG51bWJlciBtb2RpZmllciAgICAgICAgfCAgTyAgfCBUaW1lem9uZSAoR01UKSAgICAgICAgICAgICAgICAgfFxuICogfCAgcCEgfCBMb25nIGxvY2FsaXplZCB0aW1lICAgICAgICAgICAgfCAgUCEgfCBMb25nIGxvY2FsaXplZCBkYXRlICAgICAgICAgICAgfFxuICogfCAgcSAgfCBTdGFuZC1hbG9uZSBxdWFydGVyICAgICAgICAgICAgfCAgUSAgfCBRdWFydGVyICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgciogfCBSZWxhdGVkIEdyZWdvcmlhbiB5ZWFyICAgICAgICAgfCAgUiEgfCBJU08gd2Vlay1udW1iZXJpbmcgeWVhciAgICAgICAgfFxuICogfCAgcyAgfCBTZWNvbmQgICAgICAgICAgICAgICAgICAgICAgICAgfCAgUyAgfCBGcmFjdGlvbiBvZiBzZWNvbmQgICAgICAgICAgICAgfFxuICogfCAgdCEgfCBTZWNvbmRzIHRpbWVzdGFtcCAgICAgICAgICAgICAgfCAgVCEgfCBNaWxsaXNlY29uZHMgdGltZXN0YW1wICAgICAgICAgfFxuICogfCAgdSAgfCBFeHRlbmRlZCB5ZWFyICAgICAgICAgICAgICAgICAgfCAgVSogfCBDeWNsaWMgeWVhciAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgdiogfCBUaW1lem9uZSAoZ2VuZXJpYyBub24tbG9jYXQuKSAgfCAgViogfCBUaW1lem9uZSAobG9jYXRpb24pICAgICAgICAgICAgfFxuICogfCAgdyAgfCBMb2NhbCB3ZWVrIG9mIHllYXIgICAgICAgICAgICAgfCAgVyogfCBXZWVrIG9mIG1vbnRoICAgICAgICAgICAgICAgICAgfFxuICogfCAgeCAgfCBUaW1lem9uZSAoSVNPLTg2MDEgdy9vIFopICAgICAgfCAgWCAgfCBUaW1lem9uZSAoSVNPLTg2MDEpICAgICAgICAgICAgfFxuICogfCAgeSAgfCBZZWFyIChhYnMpICAgICAgICAgICAgICAgICAgICAgfCAgWSAgfCBMb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyICAgICAgfFxuICogfCAgeiAgfCBUaW1lem9uZSAoc3BlY2lmaWMgbm9uLWxvY2F0LikgfCAgWiogfCBUaW1lem9uZSAoYWxpYXNlcykgICAgICAgICAgICAgfFxuICpcbiAqIExldHRlcnMgbWFya2VkIGJ5ICogYXJlIG5vdCBpbXBsZW1lbnRlZCBidXQgcmVzZXJ2ZWQgYnkgVW5pY29kZSBzdGFuZGFyZC5cbiAqXG4gKiBMZXR0ZXJzIG1hcmtlZCBieSAhIGFyZSBub24tc3RhbmRhcmQsIGJ1dCBpbXBsZW1lbnRlZCBieSBkYXRlLWZuczpcbiAqIC0gYG9gIG1vZGlmaWVzIHRoZSBwcmV2aW91cyB0b2tlbiB0byB0dXJuIGl0IGludG8gYW4gb3JkaW5hbCAoc2VlIGBmb3JtYXRgIGRvY3MpXG4gKiAtIGBpYCBpcyBJU08gZGF5IG9mIHdlZWsuIEZvciBgaWAgYW5kIGBpaWAgaXMgcmV0dXJucyBudW1lcmljIElTTyB3ZWVrIGRheXMsXG4gKiAgIGkuZS4gNyBmb3IgU3VuZGF5LCAxIGZvciBNb25kYXksIGV0Yy5cbiAqIC0gYElgIGlzIElTTyB3ZWVrIG9mIHllYXIsIGFzIG9wcG9zZWQgdG8gYHdgIHdoaWNoIGlzIGxvY2FsIHdlZWsgb2YgeWVhci5cbiAqIC0gYFJgIGlzIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyLCBhcyBvcHBvc2VkIHRvIGBZYCB3aGljaCBpcyBsb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyLlxuICogICBgUmAgaXMgc3VwcG9zZWQgdG8gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGBJYCBhbmQgYGlgXG4gKiAgIGZvciB1bml2ZXJzYWwgSVNPIHdlZWstbnVtYmVyaW5nIGRhdGUsIHdoZXJlYXNcbiAqICAgYFlgIGlzIHN1cHBvc2VkIHRvIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBgd2AgYW5kIGBlYFxuICogICBmb3Igd2Vlay1udW1iZXJpbmcgZGF0ZSBzcGVjaWZpYyB0byB0aGUgbG9jYWxlLlxuICogLSBgUGAgaXMgbG9uZyBsb2NhbGl6ZWQgZGF0ZSBmb3JtYXRcbiAqIC0gYHBgIGlzIGxvbmcgbG9jYWxpemVkIHRpbWUgZm9ybWF0XG4gKi9cblxudmFyIGZvcm1hdHRlcnMgPSB7XG4gIC8vIEVyYVxuICBHOiBmdW5jdGlvbiBHKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBlcmEgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPiAwID8gMSA6IDA7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gQUQsIEJDXG4gICAgICBjYXNlICdHJzpcbiAgICAgIGNhc2UgJ0dHJzpcbiAgICAgIGNhc2UgJ0dHRyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5lcmEoZXJhLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCdcbiAgICAgICAgfSk7XG4gICAgICAvLyBBLCBCXG4gICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5lcmEoZXJhLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnXG4gICAgICAgIH0pO1xuICAgICAgLy8gQW5ubyBEb21pbmksIEJlZm9yZSBDaHJpc3RcbiAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmVyYShlcmEsIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gWWVhclxuICB5OiBmdW5jdGlvbiB5KGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIC8vIE9yZGluYWwgbnVtYmVyXG4gICAgaWYgKHRva2VuID09PSAneW8nKSB7XG4gICAgICB2YXIgc2lnbmVkWWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgIC8vIFJldHVybnMgMSBmb3IgMSBCQyAod2hpY2ggaXMgeWVhciAwIGluIEphdmFTY3JpcHQpXG4gICAgICB2YXIgeWVhciA9IHNpZ25lZFllYXIgPiAwID8gc2lnbmVkWWVhciA6IDEgLSBzaWduZWRZZWFyO1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoeWVhciwge1xuICAgICAgICB1bml0OiAneWVhcidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLnkoZGF0ZSwgdG9rZW4pO1xuICB9LFxuICAvLyBMb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gIFk6IGZ1bmN0aW9uIFkoZGF0ZSwgdG9rZW4sIGxvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIHNpZ25lZFdlZWtZZWFyID0gZ2V0VVRDV2Vla1llYXIoZGF0ZSwgb3B0aW9ucyk7XG4gICAgLy8gUmV0dXJucyAxIGZvciAxIEJDICh3aGljaCBpcyB5ZWFyIDAgaW4gSmF2YVNjcmlwdClcbiAgICB2YXIgd2Vla1llYXIgPSBzaWduZWRXZWVrWWVhciA+IDAgPyBzaWduZWRXZWVrWWVhciA6IDEgLSBzaWduZWRXZWVrWWVhcjtcblxuICAgIC8vIFR3byBkaWdpdCB5ZWFyXG4gICAgaWYgKHRva2VuID09PSAnWVknKSB7XG4gICAgICB2YXIgdHdvRGlnaXRZZWFyID0gd2Vla1llYXIgJSAxMDA7XG4gICAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHR3b0RpZ2l0WWVhciwgMik7XG4gICAgfVxuXG4gICAgLy8gT3JkaW5hbCBudW1iZXJcbiAgICBpZiAodG9rZW4gPT09ICdZbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHdlZWtZZWFyLCB7XG4gICAgICAgIHVuaXQ6ICd5ZWFyJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUGFkZGluZ1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3Mod2Vla1llYXIsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gIFI6IGZ1bmN0aW9uIFIoZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgaXNvV2Vla1llYXIgPSBnZXRVVENJU09XZWVrWWVhcihkYXRlKTtcblxuICAgIC8vIFBhZGRpbmdcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGlzb1dlZWtZZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBFeHRlbmRlZCB5ZWFyLiBUaGlzIGlzIGEgc2luZ2xlIG51bWJlciBkZXNpZ25hdGluZyB0aGUgeWVhciBvZiB0aGlzIGNhbGVuZGFyIHN5c3RlbS5cbiAgLy8gVGhlIG1haW4gZGlmZmVyZW5jZSBiZXR3ZWVuIGB5YCBhbmQgYHVgIGxvY2FsaXplcnMgYXJlIEIuQy4geWVhcnM6XG4gIC8vIHwgWWVhciB8IGB5YCB8IGB1YCB8XG4gIC8vIHwtLS0tLS18LS0tLS18LS0tLS18XG4gIC8vIHwgQUMgMSB8ICAgMSB8ICAgMSB8XG4gIC8vIHwgQkMgMSB8ICAgMSB8ICAgMCB8XG4gIC8vIHwgQkMgMiB8ICAgMiB8ICAtMSB8XG4gIC8vIEFsc28gYHl5YCBhbHdheXMgcmV0dXJucyB0aGUgbGFzdCB0d28gZGlnaXRzIG9mIGEgeWVhcixcbiAgLy8gd2hpbGUgYHV1YCBwYWRzIHNpbmdsZSBkaWdpdCB5ZWFycyB0byAyIGNoYXJhY3RlcnMgYW5kIHJldHVybnMgb3RoZXIgeWVhcnMgdW5jaGFuZ2VkLlxuICB1OiBmdW5jdGlvbiB1KGRhdGUsIHRva2VuKSB7XG4gICAgdmFyIHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh5ZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBRdWFydGVyXG4gIFE6IGZ1bmN0aW9uIFEoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIHF1YXJ0ZXIgPSBNYXRoLmNlaWwoKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEpIC8gMyk7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gMSwgMiwgMywgNFxuICAgICAgY2FzZSAnUSc6XG4gICAgICAgIHJldHVybiBTdHJpbmcocXVhcnRlcik7XG4gICAgICAvLyAwMSwgMDIsIDAzLCAwNFxuICAgICAgY2FzZSAnUVEnOlxuICAgICAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHF1YXJ0ZXIsIDIpO1xuICAgICAgLy8gMXN0LCAybmQsIDNyZCwgNHRoXG4gICAgICBjYXNlICdRbyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB1bml0OiAncXVhcnRlcidcbiAgICAgICAgfSk7XG4gICAgICAvLyBRMSwgUTIsIFEzLCBRNFxuICAgICAgY2FzZSAnUVFRJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLnF1YXJ0ZXIocXVhcnRlciwge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIDEsIDIsIDMsIDQgKG5hcnJvdyBxdWFydGVyOyBjb3VsZCBiZSBub3QgbnVtZXJpY2FsKVxuICAgICAgY2FzZSAnUVFRUVEnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUucXVhcnRlcihxdWFydGVyLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uXG4gICAgICBjYXNlICdRUVFRJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5xdWFydGVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIFN0YW5kLWFsb25lIHF1YXJ0ZXJcbiAgcTogZnVuY3Rpb24gcShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgcXVhcnRlciA9IE1hdGguY2VpbCgoZGF0ZS5nZXRVVENNb250aCgpICsgMSkgLyAzKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyAxLCAyLCAzLCA0XG4gICAgICBjYXNlICdxJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhxdWFydGVyKTtcbiAgICAgIC8vIDAxLCAwMiwgMDMsIDA0XG4gICAgICBjYXNlICdxcSc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MocXVhcnRlciwgMik7XG4gICAgICAvLyAxc3QsIDJuZCwgM3JkLCA0dGhcbiAgICAgIGNhc2UgJ3FvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIocXVhcnRlciwge1xuICAgICAgICAgIHVuaXQ6ICdxdWFydGVyJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFExLCBRMiwgUTMsIFE0XG4gICAgICBjYXNlICdxcXEnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUucXVhcnRlcihxdWFydGVyLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gMSwgMiwgMywgNCAobmFycm93IHF1YXJ0ZXI7IGNvdWxkIGJlIG5vdCBudW1lcmljYWwpXG4gICAgICBjYXNlICdxcXFxcSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5xdWFydGVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gMXN0IHF1YXJ0ZXIsIDJuZCBxdWFydGVyLCAuLi5cbiAgICAgIGNhc2UgJ3FxcXEnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLnF1YXJ0ZXIocXVhcnRlciwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gTW9udGhcbiAgTTogZnVuY3Rpb24gTShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgbW9udGggPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnTSc6XG4gICAgICBjYXNlICdNTSc6XG4gICAgICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuTShkYXRlLCB0b2tlbik7XG4gICAgICAvLyAxc3QsIDJuZCwgLi4uLCAxMnRoXG4gICAgICBjYXNlICdNbyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKG1vbnRoICsgMSwge1xuICAgICAgICAgIHVuaXQ6ICdtb250aCdcbiAgICAgICAgfSk7XG4gICAgICAvLyBKYW4sIEZlYiwgLi4uLCBEZWNcbiAgICAgIGNhc2UgJ01NTSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIEosIEYsIC4uLiwgRFxuICAgICAgY2FzZSAnTU1NTU0nOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUubW9udGgobW9udGgsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gSmFudWFyeSwgRmVicnVhcnksIC4uLiwgRGVjZW1iZXJcbiAgICAgIGNhc2UgJ01NTU0nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBTdGFuZC1hbG9uZSBtb250aFxuICBMOiBmdW5jdGlvbiBMKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyAxLCAyLCAuLi4sIDEyXG4gICAgICBjYXNlICdMJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhtb250aCArIDEpO1xuICAgICAgLy8gMDEsIDAyLCAuLi4sIDEyXG4gICAgICBjYXNlICdMTCc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MobW9udGggKyAxLCAyKTtcbiAgICAgIC8vIDFzdCwgMm5kLCAuLi4sIDEydGhcbiAgICAgIGNhc2UgJ0xvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobW9udGggKyAxLCB7XG4gICAgICAgICAgdW5pdDogJ21vbnRoJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIEphbiwgRmViLCAuLi4sIERlY1xuICAgICAgY2FzZSAnTExMJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gSiwgRiwgLi4uLCBEXG4gICAgICBjYXNlICdMTExMTCc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBKYW51YXJ5LCBGZWJydWFyeSwgLi4uLCBEZWNlbWJlclxuICAgICAgY2FzZSAnTExMTCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUubW9udGgobW9udGgsIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnLFxuICAgICAgICAgIGNvbnRleHQ6ICdzdGFuZGFsb25lJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIExvY2FsIHdlZWsgb2YgeWVhclxuICB3OiBmdW5jdGlvbiB3KGRhdGUsIHRva2VuLCBsb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciB3ZWVrID0gZ2V0VVRDV2VlayhkYXRlLCBvcHRpb25zKTtcbiAgICBpZiAodG9rZW4gPT09ICd3bycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHdlZWssIHtcbiAgICAgICAgdW5pdDogJ3dlZWsnXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh3ZWVrLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBJU08gd2VlayBvZiB5ZWFyXG4gIEk6IGZ1bmN0aW9uIEkoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGlzb1dlZWsgPSBnZXRVVENJU09XZWVrKGRhdGUpO1xuICAgIGlmICh0b2tlbiA9PT0gJ0lvJykge1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoaXNvV2Vlaywge1xuICAgICAgICB1bml0OiAnd2VlaydcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGlzb1dlZWssIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIERheSBvZiB0aGUgbW9udGhcbiAgZDogZnVuY3Rpb24gZChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICBpZiAodG9rZW4gPT09ICdkbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRhdGUuZ2V0VVRDRGF0ZSgpLCB7XG4gICAgICAgIHVuaXQ6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuZChkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIERheSBvZiB5ZWFyXG4gIEQ6IGZ1bmN0aW9uIEQoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGRheU9mWWVhciA9IGdldFVUQ0RheU9mWWVhcihkYXRlKTtcbiAgICBpZiAodG9rZW4gPT09ICdEbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRheU9mWWVhciwge1xuICAgICAgICB1bml0OiAnZGF5T2ZZZWFyJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF5T2ZZZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBEYXkgb2Ygd2Vla1xuICBFOiBmdW5jdGlvbiBFKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBkYXlPZldlZWsgPSBkYXRlLmdldFVUQ0RheSgpO1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIFR1ZVxuICAgICAgY2FzZSAnRSc6XG4gICAgICBjYXNlICdFRSc6XG4gICAgICBjYXNlICdFRUUnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFRcbiAgICAgIGNhc2UgJ0VFRUVFJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVcbiAgICAgIGNhc2UgJ0VFRUVFRSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdzaG9ydCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVlc2RheVxuICAgICAgY2FzZSAnRUVFRSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gTG9jYWwgZGF5IG9mIHdlZWtcbiAgZTogZnVuY3Rpb24gZShkYXRlLCB0b2tlbiwgbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGF5T2ZXZWVrID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgICB2YXIgbG9jYWxEYXlPZldlZWsgPSAoZGF5T2ZXZWVrIC0gb3B0aW9ucy53ZWVrU3RhcnRzT24gKyA4KSAlIDcgfHwgNztcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBOdW1lcmljYWwgdmFsdWUgKE50aCBkYXkgb2Ygd2VlayB3aXRoIGN1cnJlbnQgbG9jYWxlIG9yIHdlZWtTdGFydHNPbilcbiAgICAgIGNhc2UgJ2UnOlxuICAgICAgICByZXR1cm4gU3RyaW5nKGxvY2FsRGF5T2ZXZWVrKTtcbiAgICAgIC8vIFBhZGRlZCBudW1lcmljYWwgdmFsdWVcbiAgICAgIGNhc2UgJ2VlJzpcbiAgICAgICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhsb2NhbERheU9mV2VlaywgMik7XG4gICAgICAvLyAxc3QsIDJuZCwgLi4uLCA3dGhcbiAgICAgIGNhc2UgJ2VvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobG9jYWxEYXlPZldlZWssIHtcbiAgICAgICAgICB1bml0OiAnZGF5J1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2VlZSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuICAgICAgY2FzZSAnZWVlZWUnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuICAgICAgY2FzZSAnZWVlZWVlJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG4gICAgICBjYXNlICdlZWVlJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBTdGFuZC1hbG9uZSBsb2NhbCBkYXkgb2Ygd2Vla1xuICBjOiBmdW5jdGlvbiBjKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBkYXlPZldlZWsgPSBkYXRlLmdldFVUQ0RheSgpO1xuICAgIHZhciBsb2NhbERheU9mV2VlayA9IChkYXlPZldlZWsgLSBvcHRpb25zLndlZWtTdGFydHNPbiArIDgpICUgNyB8fCA3O1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIE51bWVyaWNhbCB2YWx1ZSAoc2FtZSBhcyBpbiBgZWApXG4gICAgICBjYXNlICdjJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhsb2NhbERheU9mV2Vlayk7XG4gICAgICAvLyBQYWRkZWQgbnVtZXJpY2FsIHZhbHVlXG4gICAgICBjYXNlICdjYyc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MobG9jYWxEYXlPZldlZWssIHRva2VuLmxlbmd0aCk7XG4gICAgICAvLyAxc3QsIDJuZCwgLi4uLCA3dGhcbiAgICAgIGNhc2UgJ2NvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobG9jYWxEYXlPZldlZWssIHtcbiAgICAgICAgICB1bml0OiAnZGF5J1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2NjYyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuICAgICAgY2FzZSAnY2NjY2MnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuICAgICAgY2FzZSAnY2NjY2NjJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG4gICAgICBjYXNlICdjY2NjJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBJU08gZGF5IG9mIHdlZWtcbiAgaTogZnVuY3Rpb24gaShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgZGF5T2ZXZWVrID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgICB2YXIgaXNvRGF5T2ZXZWVrID0gZGF5T2ZXZWVrID09PSAwID8gNyA6IGRheU9mV2VlaztcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyAyXG4gICAgICBjYXNlICdpJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhpc29EYXlPZldlZWspO1xuICAgICAgLy8gMDJcbiAgICAgIGNhc2UgJ2lpJzpcbiAgICAgICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhpc29EYXlPZldlZWssIHRva2VuLmxlbmd0aCk7XG4gICAgICAvLyAybmRcbiAgICAgIGNhc2UgJ2lvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoaXNvRGF5T2ZXZWVrLCB7XG4gICAgICAgICAgdW5pdDogJ2RheSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVcbiAgICAgIGNhc2UgJ2lpaSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuICAgICAgY2FzZSAnaWlpaWknOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuICAgICAgY2FzZSAnaWlpaWlpJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG4gICAgICBjYXNlICdpaWlpJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBBTSBvciBQTVxuICBhOiBmdW5jdGlvbiBhKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlID0gaG91cnMgLyAxMiA+PSAxID8gJ3BtJyA6ICdhbSc7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnYSc6XG4gICAgICBjYXNlICdhYSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYWFhJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNhc2UgJ2FhYWFhJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYWFhYSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5UGVyaW9kKGRheVBlcmlvZEVudW1WYWx1ZSwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gQU0sIFBNLCBtaWRuaWdodCwgbm9vblxuICBiOiBmdW5jdGlvbiBiKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlO1xuICAgIGlmIChob3VycyA9PT0gMTIpIHtcbiAgICAgIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRheVBlcmlvZEVudW0ubm9vbjtcbiAgICB9IGVsc2UgaWYgKGhvdXJzID09PSAwKSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXlQZXJpb2RFbnVtLm1pZG5pZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBob3VycyAvIDEyID49IDEgPyAncG0nIDogJ2FtJztcbiAgICB9XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnYic6XG4gICAgICBjYXNlICdiYic6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYmJiJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNhc2UgJ2JiYmJiJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYmJiYic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5UGVyaW9kKGRheVBlcmlvZEVudW1WYWx1ZSwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gaW4gdGhlIG1vcm5pbmcsIGluIHRoZSBhZnRlcm5vb24sIGluIHRoZSBldmVuaW5nLCBhdCBuaWdodFxuICBCOiBmdW5jdGlvbiBCKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlO1xuICAgIGlmIChob3VycyA+PSAxNykge1xuICAgICAgZGF5UGVyaW9kRW51bVZhbHVlID0gZGF5UGVyaW9kRW51bS5ldmVuaW5nO1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPj0gMTIpIHtcbiAgICAgIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRheVBlcmlvZEVudW0uYWZ0ZXJub29uO1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPj0gNCkge1xuICAgICAgZGF5UGVyaW9kRW51bVZhbHVlID0gZGF5UGVyaW9kRW51bS5tb3JuaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXlQZXJpb2RFbnVtLm5pZ2h0O1xuICAgIH1cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdCJzpcbiAgICAgIGNhc2UgJ0JCJzpcbiAgICAgIGNhc2UgJ0JCQic6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnQkJCQkInOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5UGVyaW9kKGRheVBlcmlvZEVudW1WYWx1ZSwge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICBjYXNlICdCQkJCJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBIb3VyIFsxLTEyXVxuICBoOiBmdW5jdGlvbiBoKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIGlmICh0b2tlbiA9PT0gJ2hvJykge1xuICAgICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRVVENIb3VycygpICUgMTI7XG4gICAgICBpZiAoaG91cnMgPT09IDApIGhvdXJzID0gMTI7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLmgoZGF0ZSwgdG9rZW4pO1xuICB9LFxuICAvLyBIb3VyIFswLTIzXVxuICBIOiBmdW5jdGlvbiBIKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIGlmICh0b2tlbiA9PT0gJ0hvJykge1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoZGF0ZS5nZXRVVENIb3VycygpLCB7XG4gICAgICAgIHVuaXQ6ICdob3VyJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuSChkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIEhvdXIgWzAtMTFdXG4gIEs6IGZ1bmN0aW9uIEsoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRVVENIb3VycygpICUgMTI7XG4gICAgaWYgKHRva2VuID09PSAnS28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGhvdXJzLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBIb3VyIFsxLTI0XVxuICBrOiBmdW5jdGlvbiBrKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICBpZiAoaG91cnMgPT09IDApIGhvdXJzID0gMjQ7XG4gICAgaWYgKHRva2VuID09PSAna28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGhvdXJzLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNaW51dGVcbiAgbTogZnVuY3Rpb24gbShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICBpZiAodG9rZW4gPT09ICdtbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRhdGUuZ2V0VVRDTWludXRlcygpLCB7XG4gICAgICAgIHVuaXQ6ICdtaW51dGUnXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5tKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gU2Vjb25kXG4gIHM6IGZ1bmN0aW9uIHMoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgaWYgKHRva2VuID09PSAnc28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihkYXRlLmdldFVUQ1NlY29uZHMoKSwge1xuICAgICAgICB1bml0OiAnc2Vjb25kJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMucyhkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIEZyYWN0aW9uIG9mIHNlY29uZFxuICBTOiBmdW5jdGlvbiBTKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5TKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gVGltZXpvbmUgKElTTy04NjAxLiBJZiBvZmZzZXQgaXMgMCwgb3V0cHV0IGlzIGFsd2F5cyBgJ1onYClcbiAgWDogZnVuY3Rpb24gWChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lem9uZU9mZnNldCA9IG9yaWdpbmFsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIGlmICh0aW1lem9uZU9mZnNldCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdaJztcbiAgICB9XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gSG91cnMgYW5kIG9wdGlvbmFsIG1pbnV0ZXNcbiAgICAgIGNhc2UgJ1gnOlxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmVXaXRoT3B0aW9uYWxNaW51dGVzKHRpbWV6b25lT2Zmc2V0KTtcblxuICAgICAgLy8gSG91cnMsIG1pbnV0ZXMgYW5kIG9wdGlvbmFsIHNlY29uZHMgd2l0aG91dCBgOmAgZGVsaW1pdGVyXG4gICAgICAvLyBOb3RlOiBuZWl0aGVyIElTTy04NjAxIG5vciBKYXZhU2NyaXB0IHN1cHBvcnRzIHNlY29uZHMgaW4gdGltZXpvbmUgb2Zmc2V0c1xuICAgICAgLy8gc28gdGhpcyB0b2tlbiBhbHdheXMgaGFzIHRoZSBzYW1lIG91dHB1dCBhcyBgWFhgXG4gICAgICBjYXNlICdYWFhYJzpcbiAgICAgIGNhc2UgJ1hYJzpcbiAgICAgICAgLy8gSG91cnMgYW5kIG1pbnV0ZXMgd2l0aG91dCBgOmAgZGVsaW1pdGVyXG4gICAgICAgIHJldHVybiBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCk7XG5cbiAgICAgIC8vIEhvdXJzLCBtaW51dGVzIGFuZCBvcHRpb25hbCBzZWNvbmRzIHdpdGggYDpgIGRlbGltaXRlclxuICAgICAgLy8gTm90ZTogbmVpdGhlciBJU08tODYwMSBub3IgSmF2YVNjcmlwdCBzdXBwb3J0cyBzZWNvbmRzIGluIHRpbWV6b25lIG9mZnNldHNcbiAgICAgIC8vIHNvIHRoaXMgdG9rZW4gYWx3YXlzIGhhcyB0aGUgc2FtZSBvdXRwdXQgYXMgYFhYWGBcbiAgICAgIGNhc2UgJ1hYWFhYJzpcbiAgICAgIGNhc2UgJ1hYWCc6IC8vIEhvdXJzIGFuZCBtaW51dGVzIHdpdGggYDpgIGRlbGltaXRlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWV6b25lKHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgIH1cbiAgfSxcbiAgLy8gVGltZXpvbmUgKElTTy04NjAxLiBJZiBvZmZzZXQgaXMgMCwgb3V0cHV0IGlzIGAnKzAwOjAwJ2Agb3IgZXF1aXZhbGVudClcbiAgeDogZnVuY3Rpb24geChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lem9uZU9mZnNldCA9IG9yaWdpbmFsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIEhvdXJzIGFuZCBvcHRpb25hbCBtaW51dGVzXG4gICAgICBjYXNlICd4JzpcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWV6b25lV2l0aE9wdGlvbmFsTWludXRlcyh0aW1lem9uZU9mZnNldCk7XG5cbiAgICAgIC8vIEhvdXJzLCBtaW51dGVzIGFuZCBvcHRpb25hbCBzZWNvbmRzIHdpdGhvdXQgYDpgIGRlbGltaXRlclxuICAgICAgLy8gTm90ZTogbmVpdGhlciBJU08tODYwMSBub3IgSmF2YVNjcmlwdCBzdXBwb3J0cyBzZWNvbmRzIGluIHRpbWV6b25lIG9mZnNldHNcbiAgICAgIC8vIHNvIHRoaXMgdG9rZW4gYWx3YXlzIGhhcyB0aGUgc2FtZSBvdXRwdXQgYXMgYHh4YFxuICAgICAgY2FzZSAneHh4eCc6XG4gICAgICBjYXNlICd4eCc6XG4gICAgICAgIC8vIEhvdXJzIGFuZCBtaW51dGVzIHdpdGhvdXQgYDpgIGRlbGltaXRlclxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmUodGltZXpvbmVPZmZzZXQpO1xuXG4gICAgICAvLyBIb3VycywgbWludXRlcyBhbmQgb3B0aW9uYWwgc2Vjb25kcyB3aXRoIGA6YCBkZWxpbWl0ZXJcbiAgICAgIC8vIE5vdGU6IG5laXRoZXIgSVNPLTg2MDEgbm9yIEphdmFTY3JpcHQgc3VwcG9ydHMgc2Vjb25kcyBpbiB0aW1lem9uZSBvZmZzZXRzXG4gICAgICAvLyBzbyB0aGlzIHRva2VuIGFsd2F5cyBoYXMgdGhlIHNhbWUgb3V0cHV0IGFzIGB4eHhgXG4gICAgICBjYXNlICd4eHh4eCc6XG4gICAgICBjYXNlICd4eHgnOiAvLyBIb3VycyBhbmQgbWludXRlcyB3aXRoIGA6YCBkZWxpbWl0ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCwgJzonKTtcbiAgICB9XG4gIH0sXG4gIC8vIFRpbWV6b25lIChHTVQpXG4gIE86IGZ1bmN0aW9uIE8oZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSBvcmlnaW5hbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBTaG9ydFxuICAgICAgY2FzZSAnTyc6XG4gICAgICBjYXNlICdPTyc6XG4gICAgICBjYXNlICdPT08nOlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZVNob3J0KHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgICAgLy8gTG9uZ1xuICAgICAgY2FzZSAnT09PTyc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCwgJzonKTtcbiAgICB9XG4gIH0sXG4gIC8vIFRpbWV6b25lIChzcGVjaWZpYyBub24tbG9jYXRpb24pXG4gIHo6IGZ1bmN0aW9uIHooZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSBvcmlnaW5hbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBTaG9ydFxuICAgICAgY2FzZSAneic6XG4gICAgICBjYXNlICd6eic6XG4gICAgICBjYXNlICd6enonOlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZVNob3J0KHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgICAgLy8gTG9uZ1xuICAgICAgY2FzZSAnenp6eic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCwgJzonKTtcbiAgICB9XG4gIH0sXG4gIC8vIFNlY29uZHMgdGltZXN0YW1wXG4gIHQ6IGZ1bmN0aW9uIHQoZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXN0YW1wID0gTWF0aC5mbG9vcihvcmlnaW5hbERhdGUuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh0aW1lc3RhbXAsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIE1pbGxpc2Vjb25kcyB0aW1lc3RhbXBcbiAgVDogZnVuY3Rpb24gVChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lc3RhbXAgPSBvcmlnaW5hbERhdGUuZ2V0VGltZSgpO1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3ModGltZXN0YW1wLCB0b2tlbi5sZW5ndGgpO1xuICB9XG59O1xuZnVuY3Rpb24gZm9ybWF0VGltZXpvbmVTaG9ydChvZmZzZXQsIGRpcnR5RGVsaW1pdGVyKSB7XG4gIHZhciBzaWduID0gb2Zmc2V0ID4gMCA/ICctJyA6ICcrJztcbiAgdmFyIGFic09mZnNldCA9IE1hdGguYWJzKG9mZnNldCk7XG4gIHZhciBob3VycyA9IE1hdGguZmxvb3IoYWJzT2Zmc2V0IC8gNjApO1xuICB2YXIgbWludXRlcyA9IGFic09mZnNldCAlIDYwO1xuICBpZiAobWludXRlcyA9PT0gMCkge1xuICAgIHJldHVybiBzaWduICsgU3RyaW5nKGhvdXJzKTtcbiAgfVxuICB2YXIgZGVsaW1pdGVyID0gZGlydHlEZWxpbWl0ZXIgfHwgJyc7XG4gIHJldHVybiBzaWduICsgU3RyaW5nKGhvdXJzKSArIGRlbGltaXRlciArIGFkZExlYWRpbmdaZXJvcyhtaW51dGVzLCAyKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFRpbWV6b25lV2l0aE9wdGlvbmFsTWludXRlcyhvZmZzZXQsIGRpcnR5RGVsaW1pdGVyKSB7XG4gIGlmIChvZmZzZXQgJSA2MCA9PT0gMCkge1xuICAgIHZhciBzaWduID0gb2Zmc2V0ID4gMCA/ICctJyA6ICcrJztcbiAgICByZXR1cm4gc2lnbiArIGFkZExlYWRpbmdaZXJvcyhNYXRoLmFicyhvZmZzZXQpIC8gNjAsIDIpO1xuICB9XG4gIHJldHVybiBmb3JtYXRUaW1lem9uZShvZmZzZXQsIGRpcnR5RGVsaW1pdGVyKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFRpbWV6b25lKG9mZnNldCwgZGlydHlEZWxpbWl0ZXIpIHtcbiAgdmFyIGRlbGltaXRlciA9IGRpcnR5RGVsaW1pdGVyIHx8ICcnO1xuICB2YXIgc2lnbiA9IG9mZnNldCA+IDAgPyAnLScgOiAnKyc7XG4gIHZhciBhYnNPZmZzZXQgPSBNYXRoLmFicyhvZmZzZXQpO1xuICB2YXIgaG91cnMgPSBhZGRMZWFkaW5nWmVyb3MoTWF0aC5mbG9vcihhYnNPZmZzZXQgLyA2MCksIDIpO1xuICB2YXIgbWludXRlcyA9IGFkZExlYWRpbmdaZXJvcyhhYnNPZmZzZXQgJSA2MCwgMik7XG4gIHJldHVybiBzaWduICsgaG91cnMgKyBkZWxpbWl0ZXIgKyBtaW51dGVzO1xufVxuZXhwb3J0IGRlZmF1bHQgZm9ybWF0dGVyczsiLCJ2YXIgZGF0ZUxvbmdGb3JtYXR0ZXIgPSBmdW5jdGlvbiBkYXRlTG9uZ0Zvcm1hdHRlcihwYXR0ZXJuLCBmb3JtYXRMb25nKSB7XG4gIHN3aXRjaCAocGF0dGVybikge1xuICAgIGNhc2UgJ1AnOlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcuZGF0ZSh7XG4gICAgICAgIHdpZHRoOiAnc2hvcnQnXG4gICAgICB9KTtcbiAgICBjYXNlICdQUCc6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy5kYXRlKHtcbiAgICAgICAgd2lkdGg6ICdtZWRpdW0nXG4gICAgICB9KTtcbiAgICBjYXNlICdQUFAnOlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcuZGF0ZSh7XG4gICAgICAgIHdpZHRoOiAnbG9uZydcbiAgICAgIH0pO1xuICAgIGNhc2UgJ1BQUFAnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy5kYXRlKHtcbiAgICAgICAgd2lkdGg6ICdmdWxsJ1xuICAgICAgfSk7XG4gIH1cbn07XG52YXIgdGltZUxvbmdGb3JtYXR0ZXIgPSBmdW5jdGlvbiB0aW1lTG9uZ0Zvcm1hdHRlcihwYXR0ZXJuLCBmb3JtYXRMb25nKSB7XG4gIHN3aXRjaCAocGF0dGVybikge1xuICAgIGNhc2UgJ3AnOlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcudGltZSh7XG4gICAgICAgIHdpZHRoOiAnc2hvcnQnXG4gICAgICB9KTtcbiAgICBjYXNlICdwcCc6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy50aW1lKHtcbiAgICAgICAgd2lkdGg6ICdtZWRpdW0nXG4gICAgICB9KTtcbiAgICBjYXNlICdwcHAnOlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcudGltZSh7XG4gICAgICAgIHdpZHRoOiAnbG9uZydcbiAgICAgIH0pO1xuICAgIGNhc2UgJ3BwcHAnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy50aW1lKHtcbiAgICAgICAgd2lkdGg6ICdmdWxsJ1xuICAgICAgfSk7XG4gIH1cbn07XG52YXIgZGF0ZVRpbWVMb25nRm9ybWF0dGVyID0gZnVuY3Rpb24gZGF0ZVRpbWVMb25nRm9ybWF0dGVyKHBhdHRlcm4sIGZvcm1hdExvbmcpIHtcbiAgdmFyIG1hdGNoUmVzdWx0ID0gcGF0dGVybi5tYXRjaCgvKFArKShwKyk/LykgfHwgW107XG4gIHZhciBkYXRlUGF0dGVybiA9IG1hdGNoUmVzdWx0WzFdO1xuICB2YXIgdGltZVBhdHRlcm4gPSBtYXRjaFJlc3VsdFsyXTtcbiAgaWYgKCF0aW1lUGF0dGVybikge1xuICAgIHJldHVybiBkYXRlTG9uZ0Zvcm1hdHRlcihwYXR0ZXJuLCBmb3JtYXRMb25nKTtcbiAgfVxuICB2YXIgZGF0ZVRpbWVGb3JtYXQ7XG4gIHN3aXRjaCAoZGF0ZVBhdHRlcm4pIHtcbiAgICBjYXNlICdQJzpcbiAgICAgIGRhdGVUaW1lRm9ybWF0ID0gZm9ybWF0TG9uZy5kYXRlVGltZSh7XG4gICAgICAgIHdpZHRoOiAnc2hvcnQnXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1BQJzpcbiAgICAgIGRhdGVUaW1lRm9ybWF0ID0gZm9ybWF0TG9uZy5kYXRlVGltZSh7XG4gICAgICAgIHdpZHRoOiAnbWVkaXVtJ1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdQUFAnOlxuICAgICAgZGF0ZVRpbWVGb3JtYXQgPSBmb3JtYXRMb25nLmRhdGVUaW1lKHtcbiAgICAgICAgd2lkdGg6ICdsb25nJ1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdQUFBQJzpcbiAgICBkZWZhdWx0OlxuICAgICAgZGF0ZVRpbWVGb3JtYXQgPSBmb3JtYXRMb25nLmRhdGVUaW1lKHtcbiAgICAgICAgd2lkdGg6ICdmdWxsJ1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZGF0ZVRpbWVGb3JtYXQucmVwbGFjZSgne3tkYXRlfX0nLCBkYXRlTG9uZ0Zvcm1hdHRlcihkYXRlUGF0dGVybiwgZm9ybWF0TG9uZykpLnJlcGxhY2UoJ3t7dGltZX19JywgdGltZUxvbmdGb3JtYXR0ZXIodGltZVBhdHRlcm4sIGZvcm1hdExvbmcpKTtcbn07XG52YXIgbG9uZ0Zvcm1hdHRlcnMgPSB7XG4gIHA6IHRpbWVMb25nRm9ybWF0dGVyLFxuICBQOiBkYXRlVGltZUxvbmdGb3JtYXR0ZXJcbn07XG5leHBvcnQgZGVmYXVsdCBsb25nRm9ybWF0dGVyczsiLCIvKipcbiAqIEdvb2dsZSBDaHJvbWUgYXMgb2YgNjcuMC4zMzk2Ljg3IGludHJvZHVjZWQgdGltZXpvbmVzIHdpdGggb2Zmc2V0IHRoYXQgaW5jbHVkZXMgc2Vjb25kcy5cbiAqIFRoZXkgdXN1YWxseSBhcHBlYXIgZm9yIGRhdGVzIHRoYXQgZGVub3RlIHRpbWUgYmVmb3JlIHRoZSB0aW1lem9uZXMgd2VyZSBpbnRyb2R1Y2VkXG4gKiAoZS5nLiBmb3IgJ0V1cm9wZS9QcmFndWUnIHRpbWV6b25lIHRoZSBvZmZzZXQgaXMgR01UKzAwOjU3OjQ0IGJlZm9yZSAxIE9jdG9iZXIgMTg5MVxuICogYW5kIEdNVCswMTowMDowMCBhZnRlciB0aGF0IGRhdGUpXG4gKlxuICogRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIHRoZSBvZmZzZXQgaW4gbWludXRlcyBhbmQgd291bGQgcmV0dXJuIDU3IGZvciB0aGUgZXhhbXBsZSBhYm92ZSxcbiAqIHdoaWNoIHdvdWxkIGxlYWQgdG8gaW5jb3JyZWN0IGNhbGN1bGF0aW9ucy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHRpbWV6b25lIG9mZnNldCBpbiBtaWxsaXNlY29uZHMgdGhhdCB0YWtlcyBzZWNvbmRzIGluIGFjY291bnQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFRpbWV6b25lT2Zmc2V0SW5NaWxsaXNlY29uZHMoZGF0ZSkge1xuICB2YXIgdXRjRGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSwgZGF0ZS5nZXRIb3VycygpLCBkYXRlLmdldE1pbnV0ZXMoKSwgZGF0ZS5nZXRTZWNvbmRzKCksIGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkpKTtcbiAgdXRjRGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkpO1xuICByZXR1cm4gZGF0ZS5nZXRUaW1lKCkgLSB1dGNEYXRlLmdldFRpbWUoKTtcbn0iLCJ2YXIgcHJvdGVjdGVkRGF5T2ZZZWFyVG9rZW5zID0gWydEJywgJ0REJ107XG52YXIgcHJvdGVjdGVkV2Vla1llYXJUb2tlbnMgPSBbJ1lZJywgJ1lZWVknXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3RlY3RlZERheU9mWWVhclRva2VuKHRva2VuKSB7XG4gIHJldHVybiBwcm90ZWN0ZWREYXlPZlllYXJUb2tlbnMuaW5kZXhPZih0b2tlbikgIT09IC0xO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvdGVjdGVkV2Vla1llYXJUb2tlbih0b2tlbikge1xuICByZXR1cm4gcHJvdGVjdGVkV2Vla1llYXJUb2tlbnMuaW5kZXhPZih0b2tlbikgIT09IC0xO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRocm93UHJvdGVjdGVkRXJyb3IodG9rZW4sIGZvcm1hdCwgaW5wdXQpIHtcbiAgaWYgKHRva2VuID09PSAnWVlZWScpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlVzZSBgeXl5eWAgaW5zdGVhZCBvZiBgWVlZWWAgKGluIGBcIi5jb25jYXQoZm9ybWF0LCBcImApIGZvciBmb3JtYXR0aW5nIHllYXJzIHRvIHRoZSBpbnB1dCBgXCIpLmNvbmNhdChpbnB1dCwgXCJgOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcIikpO1xuICB9IGVsc2UgaWYgKHRva2VuID09PSAnWVknKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJVc2UgYHl5YCBpbnN0ZWFkIG9mIGBZWWAgKGluIGBcIi5jb25jYXQoZm9ybWF0LCBcImApIGZvciBmb3JtYXR0aW5nIHllYXJzIHRvIHRoZSBpbnB1dCBgXCIpLmNvbmNhdChpbnB1dCwgXCJgOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcIikpO1xuICB9IGVsc2UgaWYgKHRva2VuID09PSAnRCcpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlVzZSBgZGAgaW5zdGVhZCBvZiBgRGAgKGluIGBcIi5jb25jYXQoZm9ybWF0LCBcImApIGZvciBmb3JtYXR0aW5nIGRheXMgb2YgdGhlIG1vbnRoIHRvIHRoZSBpbnB1dCBgXCIpLmNvbmNhdChpbnB1dCwgXCJgOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcIikpO1xuICB9IGVsc2UgaWYgKHRva2VuID09PSAnREQnKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJVc2UgYGRkYCBpbnN0ZWFkIG9mIGBERGAgKGluIGBcIi5jb25jYXQoZm9ybWF0LCBcImApIGZvciBmb3JtYXR0aW5nIGRheXMgb2YgdGhlIG1vbnRoIHRvIHRoZSBpbnB1dCBgXCIpLmNvbmNhdChpbnB1dCwgXCJgOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcIikpO1xuICB9XG59IiwidmFyIGZvcm1hdERpc3RhbmNlTG9jYWxlID0ge1xuICBsZXNzVGhhblhTZWNvbmRzOiB7XG4gICAgb25lOiAnbGVzcyB0aGFuIGEgc2Vjb25kJyxcbiAgICBvdGhlcjogJ2xlc3MgdGhhbiB7e2NvdW50fX0gc2Vjb25kcydcbiAgfSxcbiAgeFNlY29uZHM6IHtcbiAgICBvbmU6ICcxIHNlY29uZCcsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0gc2Vjb25kcydcbiAgfSxcbiAgaGFsZkFNaW51dGU6ICdoYWxmIGEgbWludXRlJyxcbiAgbGVzc1RoYW5YTWludXRlczoge1xuICAgIG9uZTogJ2xlc3MgdGhhbiBhIG1pbnV0ZScsXG4gICAgb3RoZXI6ICdsZXNzIHRoYW4ge3tjb3VudH19IG1pbnV0ZXMnXG4gIH0sXG4gIHhNaW51dGVzOiB7XG4gICAgb25lOiAnMSBtaW51dGUnLFxuICAgIG90aGVyOiAne3tjb3VudH19IG1pbnV0ZXMnXG4gIH0sXG4gIGFib3V0WEhvdXJzOiB7XG4gICAgb25lOiAnYWJvdXQgMSBob3VyJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSBob3VycydcbiAgfSxcbiAgeEhvdXJzOiB7XG4gICAgb25lOiAnMSBob3VyJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSBob3VycydcbiAgfSxcbiAgeERheXM6IHtcbiAgICBvbmU6ICcxIGRheScsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0gZGF5cydcbiAgfSxcbiAgYWJvdXRYV2Vla3M6IHtcbiAgICBvbmU6ICdhYm91dCAxIHdlZWsnLFxuICAgIG90aGVyOiAnYWJvdXQge3tjb3VudH19IHdlZWtzJ1xuICB9LFxuICB4V2Vla3M6IHtcbiAgICBvbmU6ICcxIHdlZWsnLFxuICAgIG90aGVyOiAne3tjb3VudH19IHdlZWtzJ1xuICB9LFxuICBhYm91dFhNb250aHM6IHtcbiAgICBvbmU6ICdhYm91dCAxIG1vbnRoJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSBtb250aHMnXG4gIH0sXG4gIHhNb250aHM6IHtcbiAgICBvbmU6ICcxIG1vbnRoJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSBtb250aHMnXG4gIH0sXG4gIGFib3V0WFllYXJzOiB7XG4gICAgb25lOiAnYWJvdXQgMSB5ZWFyJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSB5ZWFycydcbiAgfSxcbiAgeFllYXJzOiB7XG4gICAgb25lOiAnMSB5ZWFyJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSB5ZWFycydcbiAgfSxcbiAgb3ZlclhZZWFyczoge1xuICAgIG9uZTogJ292ZXIgMSB5ZWFyJyxcbiAgICBvdGhlcjogJ292ZXIge3tjb3VudH19IHllYXJzJ1xuICB9LFxuICBhbG1vc3RYWWVhcnM6IHtcbiAgICBvbmU6ICdhbG1vc3QgMSB5ZWFyJyxcbiAgICBvdGhlcjogJ2FsbW9zdCB7e2NvdW50fX0geWVhcnMnXG4gIH1cbn07XG52YXIgZm9ybWF0RGlzdGFuY2UgPSBmdW5jdGlvbiBmb3JtYXREaXN0YW5jZSh0b2tlbiwgY291bnQsIG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgdmFyIHRva2VuVmFsdWUgPSBmb3JtYXREaXN0YW5jZUxvY2FsZVt0b2tlbl07XG4gIGlmICh0eXBlb2YgdG9rZW5WYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXN1bHQgPSB0b2tlblZhbHVlO1xuICB9IGVsc2UgaWYgKGNvdW50ID09PSAxKSB7XG4gICAgcmVzdWx0ID0gdG9rZW5WYWx1ZS5vbmU7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gdG9rZW5WYWx1ZS5vdGhlci5yZXBsYWNlKCd7e2NvdW50fX0nLCBjb3VudC50b1N0cmluZygpKTtcbiAgfVxuICBpZiAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgJiYgb3B0aW9ucy5hZGRTdWZmaXgpIHtcbiAgICBpZiAob3B0aW9ucy5jb21wYXJpc29uICYmIG9wdGlvbnMuY29tcGFyaXNvbiA+IDApIHtcbiAgICAgIHJldHVybiAnaW4gJyArIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdCArICcgYWdvJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnQgZGVmYXVsdCBmb3JtYXREaXN0YW5jZTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZEZvcm1hdExvbmdGbihhcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIC8vIFRPRE86IFJlbW92ZSBTdHJpbmcoKVxuICAgIHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGggPyBTdHJpbmcob3B0aW9ucy53aWR0aCkgOiBhcmdzLmRlZmF1bHRXaWR0aDtcbiAgICB2YXIgZm9ybWF0ID0gYXJncy5mb3JtYXRzW3dpZHRoXSB8fCBhcmdzLmZvcm1hdHNbYXJncy5kZWZhdWx0V2lkdGhdO1xuICAgIHJldHVybiBmb3JtYXQ7XG4gIH07XG59IiwiaW1wb3J0IGJ1aWxkRm9ybWF0TG9uZ0ZuIGZyb20gXCIuLi8uLi8uLi9fbGliL2J1aWxkRm9ybWF0TG9uZ0ZuL2luZGV4LmpzXCI7XG52YXIgZGF0ZUZvcm1hdHMgPSB7XG4gIGZ1bGw6ICdFRUVFLCBNTU1NIGRvLCB5JyxcbiAgbG9uZzogJ01NTU0gZG8sIHknLFxuICBtZWRpdW06ICdNTU0gZCwgeScsXG4gIHNob3J0OiAnTU0vZGQveXl5eSdcbn07XG52YXIgdGltZUZvcm1hdHMgPSB7XG4gIGZ1bGw6ICdoOm1tOnNzIGEgenp6eicsXG4gIGxvbmc6ICdoOm1tOnNzIGEgeicsXG4gIG1lZGl1bTogJ2g6bW06c3MgYScsXG4gIHNob3J0OiAnaDptbSBhJ1xufTtcbnZhciBkYXRlVGltZUZvcm1hdHMgPSB7XG4gIGZ1bGw6IFwie3tkYXRlfX0gJ2F0JyB7e3RpbWV9fVwiLFxuICBsb25nOiBcInt7ZGF0ZX19ICdhdCcge3t0aW1lfX1cIixcbiAgbWVkaXVtOiAne3tkYXRlfX0sIHt7dGltZX19JyxcbiAgc2hvcnQ6ICd7e2RhdGV9fSwge3t0aW1lfX0nXG59O1xudmFyIGZvcm1hdExvbmcgPSB7XG4gIGRhdGU6IGJ1aWxkRm9ybWF0TG9uZ0ZuKHtcbiAgICBmb3JtYXRzOiBkYXRlRm9ybWF0cyxcbiAgICBkZWZhdWx0V2lkdGg6ICdmdWxsJ1xuICB9KSxcbiAgdGltZTogYnVpbGRGb3JtYXRMb25nRm4oe1xuICAgIGZvcm1hdHM6IHRpbWVGb3JtYXRzLFxuICAgIGRlZmF1bHRXaWR0aDogJ2Z1bGwnXG4gIH0pLFxuICBkYXRlVGltZTogYnVpbGRGb3JtYXRMb25nRm4oe1xuICAgIGZvcm1hdHM6IGRhdGVUaW1lRm9ybWF0cyxcbiAgICBkZWZhdWx0V2lkdGg6ICdmdWxsJ1xuICB9KVxufTtcbmV4cG9ydCBkZWZhdWx0IGZvcm1hdExvbmc7IiwidmFyIGZvcm1hdFJlbGF0aXZlTG9jYWxlID0ge1xuICBsYXN0V2VlazogXCInbGFzdCcgZWVlZSAnYXQnIHBcIixcbiAgeWVzdGVyZGF5OiBcIid5ZXN0ZXJkYXkgYXQnIHBcIixcbiAgdG9kYXk6IFwiJ3RvZGF5IGF0JyBwXCIsXG4gIHRvbW9ycm93OiBcIid0b21vcnJvdyBhdCcgcFwiLFxuICBuZXh0V2VlazogXCJlZWVlICdhdCcgcFwiLFxuICBvdGhlcjogJ1AnXG59O1xudmFyIGZvcm1hdFJlbGF0aXZlID0gZnVuY3Rpb24gZm9ybWF0UmVsYXRpdmUodG9rZW4sIF9kYXRlLCBfYmFzZURhdGUsIF9vcHRpb25zKSB7XG4gIHJldHVybiBmb3JtYXRSZWxhdGl2ZUxvY2FsZVt0b2tlbl07XG59O1xuZXhwb3J0IGRlZmF1bHQgZm9ybWF0UmVsYXRpdmU7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRMb2NhbGl6ZUZuKGFyZ3MpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkaXJ0eUluZGV4LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQgPSBvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLmNvbnRleHQgPyBTdHJpbmcob3B0aW9ucy5jb250ZXh0KSA6ICdzdGFuZGFsb25lJztcbiAgICB2YXIgdmFsdWVzQXJyYXk7XG4gICAgaWYgKGNvbnRleHQgPT09ICdmb3JtYXR0aW5nJyAmJiBhcmdzLmZvcm1hdHRpbmdWYWx1ZXMpIHtcbiAgICAgIHZhciBkZWZhdWx0V2lkdGggPSBhcmdzLmRlZmF1bHRGb3JtYXR0aW5nV2lkdGggfHwgYXJncy5kZWZhdWx0V2lkdGg7XG4gICAgICB2YXIgd2lkdGggPSBvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLndpZHRoID8gU3RyaW5nKG9wdGlvbnMud2lkdGgpIDogZGVmYXVsdFdpZHRoO1xuICAgICAgdmFsdWVzQXJyYXkgPSBhcmdzLmZvcm1hdHRpbmdWYWx1ZXNbd2lkdGhdIHx8IGFyZ3MuZm9ybWF0dGluZ1ZhbHVlc1tkZWZhdWx0V2lkdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2RlZmF1bHRXaWR0aCA9IGFyZ3MuZGVmYXVsdFdpZHRoO1xuICAgICAgdmFyIF93aWR0aCA9IG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMud2lkdGggPyBTdHJpbmcob3B0aW9ucy53aWR0aCkgOiBhcmdzLmRlZmF1bHRXaWR0aDtcbiAgICAgIHZhbHVlc0FycmF5ID0gYXJncy52YWx1ZXNbX3dpZHRoXSB8fCBhcmdzLnZhbHVlc1tfZGVmYXVsdFdpZHRoXTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gYXJncy5hcmd1bWVudENhbGxiYWNrID8gYXJncy5hcmd1bWVudENhbGxiYWNrKGRpcnR5SW5kZXgpIDogZGlydHlJbmRleDtcbiAgICAvLyBAdHMtaWdub3JlOiBGb3Igc29tZSByZWFzb24gVHlwZVNjcmlwdCBqdXN0IGRvbid0IHdhbnQgdG8gbWF0Y2ggaXQsIG5vIG1hdHRlciBob3cgaGFyZCB3ZSB0cnkuIEkgY2hhbGxlbmdlIHlvdSB0byB0cnkgdG8gcmVtb3ZlIGl0IVxuICAgIHJldHVybiB2YWx1ZXNBcnJheVtpbmRleF07XG4gIH07XG59IiwiaW1wb3J0IGJ1aWxkTG9jYWxpemVGbiBmcm9tIFwiLi4vLi4vLi4vX2xpYi9idWlsZExvY2FsaXplRm4vaW5kZXguanNcIjtcbnZhciBlcmFWYWx1ZXMgPSB7XG4gIG5hcnJvdzogWydCJywgJ0EnXSxcbiAgYWJicmV2aWF0ZWQ6IFsnQkMnLCAnQUQnXSxcbiAgd2lkZTogWydCZWZvcmUgQ2hyaXN0JywgJ0Fubm8gRG9taW5pJ11cbn07XG52YXIgcXVhcnRlclZhbHVlcyA9IHtcbiAgbmFycm93OiBbJzEnLCAnMicsICczJywgJzQnXSxcbiAgYWJicmV2aWF0ZWQ6IFsnUTEnLCAnUTInLCAnUTMnLCAnUTQnXSxcbiAgd2lkZTogWycxc3QgcXVhcnRlcicsICcybmQgcXVhcnRlcicsICczcmQgcXVhcnRlcicsICc0dGggcXVhcnRlciddXG59O1xuXG4vLyBOb3RlOiBpbiBFbmdsaXNoLCB0aGUgbmFtZXMgb2YgZGF5cyBvZiB0aGUgd2VlayBhbmQgbW9udGhzIGFyZSBjYXBpdGFsaXplZC5cbi8vIElmIHlvdSBhcmUgbWFraW5nIGEgbmV3IGxvY2FsZSBiYXNlZCBvbiB0aGlzIG9uZSwgY2hlY2sgaWYgdGhlIHNhbWUgaXMgdHJ1ZSBmb3IgdGhlIGxhbmd1YWdlIHlvdSdyZSB3b3JraW5nIG9uLlxuLy8gR2VuZXJhbGx5LCBmb3JtYXR0ZWQgZGF0ZXMgc2hvdWxkIGxvb2sgbGlrZSB0aGV5IGFyZSBpbiB0aGUgbWlkZGxlIG9mIGEgc2VudGVuY2UsXG4vLyBlLmcuIGluIFNwYW5pc2ggbGFuZ3VhZ2UgdGhlIHdlZWtkYXlzIGFuZCBtb250aHMgc2hvdWxkIGJlIGluIHRoZSBsb3dlcmNhc2UuXG52YXIgbW9udGhWYWx1ZXMgPSB7XG4gIG5hcnJvdzogWydKJywgJ0YnLCAnTScsICdBJywgJ00nLCAnSicsICdKJywgJ0EnLCAnUycsICdPJywgJ04nLCAnRCddLFxuICBhYmJyZXZpYXRlZDogWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddLFxuICB3aWRlOiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXVxufTtcbnZhciBkYXlWYWx1ZXMgPSB7XG4gIG5hcnJvdzogWydTJywgJ00nLCAnVCcsICdXJywgJ1QnLCAnRicsICdTJ10sXG4gIHNob3J0OiBbJ1N1JywgJ01vJywgJ1R1JywgJ1dlJywgJ1RoJywgJ0ZyJywgJ1NhJ10sXG4gIGFiYnJldmlhdGVkOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddLFxuICB3aWRlOiBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cbn07XG52YXIgZGF5UGVyaW9kVmFsdWVzID0ge1xuICBuYXJyb3c6IHtcbiAgICBhbTogJ2EnLFxuICAgIHBtOiAncCcsXG4gICAgbWlkbmlnaHQ6ICdtaScsXG4gICAgbm9vbjogJ24nLFxuICAgIG1vcm5pbmc6ICdtb3JuaW5nJyxcbiAgICBhZnRlcm5vb246ICdhZnRlcm5vb24nLFxuICAgIGV2ZW5pbmc6ICdldmVuaW5nJyxcbiAgICBuaWdodDogJ25pZ2h0J1xuICB9LFxuICBhYmJyZXZpYXRlZDoge1xuICAgIGFtOiAnQU0nLFxuICAgIHBtOiAnUE0nLFxuICAgIG1pZG5pZ2h0OiAnbWlkbmlnaHQnLFxuICAgIG5vb246ICdub29uJyxcbiAgICBtb3JuaW5nOiAnbW9ybmluZycsXG4gICAgYWZ0ZXJub29uOiAnYWZ0ZXJub29uJyxcbiAgICBldmVuaW5nOiAnZXZlbmluZycsXG4gICAgbmlnaHQ6ICduaWdodCdcbiAgfSxcbiAgd2lkZToge1xuICAgIGFtOiAnYS5tLicsXG4gICAgcG06ICdwLm0uJyxcbiAgICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgICBub29uOiAnbm9vbicsXG4gICAgbW9ybmluZzogJ21vcm5pbmcnLFxuICAgIGFmdGVybm9vbjogJ2FmdGVybm9vbicsXG4gICAgZXZlbmluZzogJ2V2ZW5pbmcnLFxuICAgIG5pZ2h0OiAnbmlnaHQnXG4gIH1cbn07XG52YXIgZm9ybWF0dGluZ0RheVBlcmlvZFZhbHVlcyA9IHtcbiAgbmFycm93OiB7XG4gICAgYW06ICdhJyxcbiAgICBwbTogJ3AnLFxuICAgIG1pZG5pZ2h0OiAnbWknLFxuICAgIG5vb246ICduJyxcbiAgICBtb3JuaW5nOiAnaW4gdGhlIG1vcm5pbmcnLFxuICAgIGFmdGVybm9vbjogJ2luIHRoZSBhZnRlcm5vb24nLFxuICAgIGV2ZW5pbmc6ICdpbiB0aGUgZXZlbmluZycsXG4gICAgbmlnaHQ6ICdhdCBuaWdodCdcbiAgfSxcbiAgYWJicmV2aWF0ZWQ6IHtcbiAgICBhbTogJ0FNJyxcbiAgICBwbTogJ1BNJyxcbiAgICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgICBub29uOiAnbm9vbicsXG4gICAgbW9ybmluZzogJ2luIHRoZSBtb3JuaW5nJyxcbiAgICBhZnRlcm5vb246ICdpbiB0aGUgYWZ0ZXJub29uJyxcbiAgICBldmVuaW5nOiAnaW4gdGhlIGV2ZW5pbmcnLFxuICAgIG5pZ2h0OiAnYXQgbmlnaHQnXG4gIH0sXG4gIHdpZGU6IHtcbiAgICBhbTogJ2EubS4nLFxuICAgIHBtOiAncC5tLicsXG4gICAgbWlkbmlnaHQ6ICdtaWRuaWdodCcsXG4gICAgbm9vbjogJ25vb24nLFxuICAgIG1vcm5pbmc6ICdpbiB0aGUgbW9ybmluZycsXG4gICAgYWZ0ZXJub29uOiAnaW4gdGhlIGFmdGVybm9vbicsXG4gICAgZXZlbmluZzogJ2luIHRoZSBldmVuaW5nJyxcbiAgICBuaWdodDogJ2F0IG5pZ2h0J1xuICB9XG59O1xudmFyIG9yZGluYWxOdW1iZXIgPSBmdW5jdGlvbiBvcmRpbmFsTnVtYmVyKGRpcnR5TnVtYmVyLCBfb3B0aW9ucykge1xuICB2YXIgbnVtYmVyID0gTnVtYmVyKGRpcnR5TnVtYmVyKTtcblxuICAvLyBJZiBvcmRpbmFsIG51bWJlcnMgZGVwZW5kIG9uIGNvbnRleHQsIGZvciBleGFtcGxlLFxuICAvLyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQgZm9yIGRpZmZlcmVudCBncmFtbWF0aWNhbCBnZW5kZXJzLFxuICAvLyB1c2UgYG9wdGlvbnMudW5pdGAuXG4gIC8vXG4gIC8vIGB1bml0YCBjYW4gYmUgJ3llYXInLCAncXVhcnRlcicsICdtb250aCcsICd3ZWVrJywgJ2RhdGUnLCAnZGF5T2ZZZWFyJyxcbiAgLy8gJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLlxuXG4gIHZhciByZW0xMDAgPSBudW1iZXIgJSAxMDA7XG4gIGlmIChyZW0xMDAgPiAyMCB8fCByZW0xMDAgPCAxMCkge1xuICAgIHN3aXRjaCAocmVtMTAwICUgMTApIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIG51bWJlciArICdzdCc7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBudW1iZXIgKyAnbmQnO1xuICAgICAgY2FzZSAzOlxuICAgICAgICByZXR1cm4gbnVtYmVyICsgJ3JkJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bWJlciArICd0aCc7XG59O1xudmFyIGxvY2FsaXplID0ge1xuICBvcmRpbmFsTnVtYmVyOiBvcmRpbmFsTnVtYmVyLFxuICBlcmE6IGJ1aWxkTG9jYWxpemVGbih7XG4gICAgdmFsdWVzOiBlcmFWYWx1ZXMsXG4gICAgZGVmYXVsdFdpZHRoOiAnd2lkZSdcbiAgfSksXG4gIHF1YXJ0ZXI6IGJ1aWxkTG9jYWxpemVGbih7XG4gICAgdmFsdWVzOiBxdWFydGVyVmFsdWVzLFxuICAgIGRlZmF1bHRXaWR0aDogJ3dpZGUnLFxuICAgIGFyZ3VtZW50Q2FsbGJhY2s6IGZ1bmN0aW9uIGFyZ3VtZW50Q2FsbGJhY2socXVhcnRlcikge1xuICAgICAgcmV0dXJuIHF1YXJ0ZXIgLSAxO1xuICAgIH1cbiAgfSksXG4gIG1vbnRoOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogbW9udGhWYWx1ZXMsXG4gICAgZGVmYXVsdFdpZHRoOiAnd2lkZSdcbiAgfSksXG4gIGRheTogYnVpbGRMb2NhbGl6ZUZuKHtcbiAgICB2YWx1ZXM6IGRheVZhbHVlcyxcbiAgICBkZWZhdWx0V2lkdGg6ICd3aWRlJ1xuICB9KSxcbiAgZGF5UGVyaW9kOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogZGF5UGVyaW9kVmFsdWVzLFxuICAgIGRlZmF1bHRXaWR0aDogJ3dpZGUnLFxuICAgIGZvcm1hdHRpbmdWYWx1ZXM6IGZvcm1hdHRpbmdEYXlQZXJpb2RWYWx1ZXMsXG4gICAgZGVmYXVsdEZvcm1hdHRpbmdXaWR0aDogJ3dpZGUnXG4gIH0pXG59O1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxpemU7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRNYXRjaEZuKGFyZ3MpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgdmFyIHdpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICB2YXIgbWF0Y2hQYXR0ZXJuID0gd2lkdGggJiYgYXJncy5tYXRjaFBhdHRlcm5zW3dpZHRoXSB8fCBhcmdzLm1hdGNoUGF0dGVybnNbYXJncy5kZWZhdWx0TWF0Y2hXaWR0aF07XG4gICAgdmFyIG1hdGNoUmVzdWx0ID0gc3RyaW5nLm1hdGNoKG1hdGNoUGF0dGVybik7XG4gICAgaWYgKCFtYXRjaFJlc3VsdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBtYXRjaGVkU3RyaW5nID0gbWF0Y2hSZXN1bHRbMF07XG4gICAgdmFyIHBhcnNlUGF0dGVybnMgPSB3aWR0aCAmJiBhcmdzLnBhcnNlUGF0dGVybnNbd2lkdGhdIHx8IGFyZ3MucGFyc2VQYXR0ZXJuc1thcmdzLmRlZmF1bHRQYXJzZVdpZHRoXTtcbiAgICB2YXIga2V5ID0gQXJyYXkuaXNBcnJheShwYXJzZVBhdHRlcm5zKSA/IGZpbmRJbmRleChwYXJzZVBhdHRlcm5zLCBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgcmV0dXJuIHBhdHRlcm4udGVzdChtYXRjaGVkU3RyaW5nKTtcbiAgICB9KSA6IGZpbmRLZXkocGFyc2VQYXR0ZXJucywgZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgIHJldHVybiBwYXR0ZXJuLnRlc3QobWF0Y2hlZFN0cmluZyk7XG4gICAgfSk7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhbHVlID0gYXJncy52YWx1ZUNhbGxiYWNrID8gYXJncy52YWx1ZUNhbGxiYWNrKGtleSkgOiBrZXk7XG4gICAgdmFsdWUgPSBvcHRpb25zLnZhbHVlQ2FsbGJhY2sgPyBvcHRpb25zLnZhbHVlQ2FsbGJhY2sodmFsdWUpIDogdmFsdWU7XG4gICAgdmFyIHJlc3QgPSBzdHJpbmcuc2xpY2UobWF0Y2hlZFN0cmluZy5sZW5ndGgpO1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICByZXN0OiByZXN0XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGZpbmRLZXkob2JqZWN0LCBwcmVkaWNhdGUpIHtcbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBwcmVkaWNhdGUob2JqZWN0W2tleV0pKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgZm9yICh2YXIga2V5ID0gMDsga2V5IDwgYXJyYXkubGVuZ3RoOyBrZXkrKykge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlba2V5XSkpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRNYXRjaFBhdHRlcm5GbihhcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIHZhciBtYXRjaFJlc3VsdCA9IHN0cmluZy5tYXRjaChhcmdzLm1hdGNoUGF0dGVybik7XG4gICAgaWYgKCFtYXRjaFJlc3VsdCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIG1hdGNoZWRTdHJpbmcgPSBtYXRjaFJlc3VsdFswXTtcbiAgICB2YXIgcGFyc2VSZXN1bHQgPSBzdHJpbmcubWF0Y2goYXJncy5wYXJzZVBhdHRlcm4pO1xuICAgIGlmICghcGFyc2VSZXN1bHQpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IGFyZ3MudmFsdWVDYWxsYmFjayA/IGFyZ3MudmFsdWVDYWxsYmFjayhwYXJzZVJlc3VsdFswXSkgOiBwYXJzZVJlc3VsdFswXTtcbiAgICB2YWx1ZSA9IG9wdGlvbnMudmFsdWVDYWxsYmFjayA/IG9wdGlvbnMudmFsdWVDYWxsYmFjayh2YWx1ZSkgOiB2YWx1ZTtcbiAgICB2YXIgcmVzdCA9IHN0cmluZy5zbGljZShtYXRjaGVkU3RyaW5nLmxlbmd0aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHJlc3Q6IHJlc3RcbiAgICB9O1xuICB9O1xufSIsImltcG9ydCBidWlsZE1hdGNoRm4gZnJvbSBcIi4uLy4uLy4uL19saWIvYnVpbGRNYXRjaEZuL2luZGV4LmpzXCI7XG5pbXBvcnQgYnVpbGRNYXRjaFBhdHRlcm5GbiBmcm9tIFwiLi4vLi4vLi4vX2xpYi9idWlsZE1hdGNoUGF0dGVybkZuL2luZGV4LmpzXCI7XG52YXIgbWF0Y2hPcmRpbmFsTnVtYmVyUGF0dGVybiA9IC9eKFxcZCspKHRofHN0fG5kfHJkKT8vaTtcbnZhciBwYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gL1xcZCsvaTtcbnZhciBtYXRjaEVyYVBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eKGJ8YSkvaSxcbiAgYWJicmV2aWF0ZWQ6IC9eKGJcXC4/XFxzP2NcXC4/fGJcXC4/XFxzP2NcXC4/XFxzP2VcXC4/fGFcXC4/XFxzP2RcXC4/fGNcXC4/XFxzP2VcXC4/KS9pLFxuICB3aWRlOiAvXihiZWZvcmUgY2hyaXN0fGJlZm9yZSBjb21tb24gZXJhfGFubm8gZG9taW5pfGNvbW1vbiBlcmEpL2lcbn07XG52YXIgcGFyc2VFcmFQYXR0ZXJucyA9IHtcbiAgYW55OiBbL15iL2ksIC9eKGF8YykvaV1cbn07XG52YXIgbWF0Y2hRdWFydGVyUGF0dGVybnMgPSB7XG4gIG5hcnJvdzogL15bMTIzNF0vaSxcbiAgYWJicmV2aWF0ZWQ6IC9ecVsxMjM0XS9pLFxuICB3aWRlOiAvXlsxMjM0XSh0aHxzdHxuZHxyZCk/IHF1YXJ0ZXIvaVxufTtcbnZhciBwYXJzZVF1YXJ0ZXJQYXR0ZXJucyA9IHtcbiAgYW55OiBbLzEvaSwgLzIvaSwgLzMvaSwgLzQvaV1cbn07XG52YXIgbWF0Y2hNb250aFBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eW2pmbWFzb25kXS9pLFxuICBhYmJyZXZpYXRlZDogL14oamFufGZlYnxtYXJ8YXByfG1heXxqdW58anVsfGF1Z3xzZXB8b2N0fG5vdnxkZWMpL2ksXG4gIHdpZGU6IC9eKGphbnVhcnl8ZmVicnVhcnl8bWFyY2h8YXByaWx8bWF5fGp1bmV8anVseXxhdWd1c3R8c2VwdGVtYmVyfG9jdG9iZXJ8bm92ZW1iZXJ8ZGVjZW1iZXIpL2lcbn07XG52YXIgcGFyc2VNb250aFBhdHRlcm5zID0ge1xuICBuYXJyb3c6IFsvXmovaSwgL15mL2ksIC9ebS9pLCAvXmEvaSwgL15tL2ksIC9eai9pLCAvXmovaSwgL15hL2ksIC9ecy9pLCAvXm8vaSwgL15uL2ksIC9eZC9pXSxcbiAgYW55OiBbL15qYS9pLCAvXmYvaSwgL15tYXIvaSwgL15hcC9pLCAvXm1heS9pLCAvXmp1bi9pLCAvXmp1bC9pLCAvXmF1L2ksIC9ecy9pLCAvXm8vaSwgL15uL2ksIC9eZC9pXVxufTtcbnZhciBtYXRjaERheVBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eW3NtdHdmXS9pLFxuICBzaG9ydDogL14oc3V8bW98dHV8d2V8dGh8ZnJ8c2EpL2ksXG4gIGFiYnJldmlhdGVkOiAvXihzdW58bW9ufHR1ZXx3ZWR8dGh1fGZyaXxzYXQpL2ksXG4gIHdpZGU6IC9eKHN1bmRheXxtb25kYXl8dHVlc2RheXx3ZWRuZXNkYXl8dGh1cnNkYXl8ZnJpZGF5fHNhdHVyZGF5KS9pXG59O1xudmFyIHBhcnNlRGF5UGF0dGVybnMgPSB7XG4gIG5hcnJvdzogWy9ecy9pLCAvXm0vaSwgL150L2ksIC9edy9pLCAvXnQvaSwgL15mL2ksIC9ecy9pXSxcbiAgYW55OiBbL15zdS9pLCAvXm0vaSwgL150dS9pLCAvXncvaSwgL150aC9pLCAvXmYvaSwgL15zYS9pXVxufTtcbnZhciBtYXRjaERheVBlcmlvZFBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eKGF8cHxtaXxufChpbiB0aGV8YXQpIChtb3JuaW5nfGFmdGVybm9vbnxldmVuaW5nfG5pZ2h0KSkvaSxcbiAgYW55OiAvXihbYXBdXFwuP1xccz9tXFwuP3xtaWRuaWdodHxub29ufChpbiB0aGV8YXQpIChtb3JuaW5nfGFmdGVybm9vbnxldmVuaW5nfG5pZ2h0KSkvaVxufTtcbnZhciBwYXJzZURheVBlcmlvZFBhdHRlcm5zID0ge1xuICBhbnk6IHtcbiAgICBhbTogL15hL2ksXG4gICAgcG06IC9ecC9pLFxuICAgIG1pZG5pZ2h0OiAvXm1pL2ksXG4gICAgbm9vbjogL15uby9pLFxuICAgIG1vcm5pbmc6IC9tb3JuaW5nL2ksXG4gICAgYWZ0ZXJub29uOiAvYWZ0ZXJub29uL2ksXG4gICAgZXZlbmluZzogL2V2ZW5pbmcvaSxcbiAgICBuaWdodDogL25pZ2h0L2lcbiAgfVxufTtcbnZhciBtYXRjaCA9IHtcbiAgb3JkaW5hbE51bWJlcjogYnVpbGRNYXRjaFBhdHRlcm5Gbih7XG4gICAgbWF0Y2hQYXR0ZXJuOiBtYXRjaE9yZGluYWxOdW1iZXJQYXR0ZXJuLFxuICAgIHBhcnNlUGF0dGVybjogcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybixcbiAgICB2YWx1ZUNhbGxiYWNrOiBmdW5jdGlvbiB2YWx1ZUNhbGxiYWNrKHZhbHVlKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICB9XG4gIH0pLFxuICBlcmE6IGJ1aWxkTWF0Y2hGbih7XG4gICAgbWF0Y2hQYXR0ZXJuczogbWF0Y2hFcmFQYXR0ZXJucyxcbiAgICBkZWZhdWx0TWF0Y2hXaWR0aDogJ3dpZGUnLFxuICAgIHBhcnNlUGF0dGVybnM6IHBhcnNlRXJhUGF0dGVybnMsXG4gICAgZGVmYXVsdFBhcnNlV2lkdGg6ICdhbnknXG4gIH0pLFxuICBxdWFydGVyOiBidWlsZE1hdGNoRm4oe1xuICAgIG1hdGNoUGF0dGVybnM6IG1hdGNoUXVhcnRlclBhdHRlcm5zLFxuICAgIGRlZmF1bHRNYXRjaFdpZHRoOiAnd2lkZScsXG4gICAgcGFyc2VQYXR0ZXJuczogcGFyc2VRdWFydGVyUGF0dGVybnMsXG4gICAgZGVmYXVsdFBhcnNlV2lkdGg6ICdhbnknLFxuICAgIHZhbHVlQ2FsbGJhY2s6IGZ1bmN0aW9uIHZhbHVlQ2FsbGJhY2soaW5kZXgpIHtcbiAgICAgIHJldHVybiBpbmRleCArIDE7XG4gICAgfVxuICB9KSxcbiAgbW9udGg6IGJ1aWxkTWF0Y2hGbih7XG4gICAgbWF0Y2hQYXR0ZXJuczogbWF0Y2hNb250aFBhdHRlcm5zLFxuICAgIGRlZmF1bHRNYXRjaFdpZHRoOiAnd2lkZScsXG4gICAgcGFyc2VQYXR0ZXJuczogcGFyc2VNb250aFBhdHRlcm5zLFxuICAgIGRlZmF1bHRQYXJzZVdpZHRoOiAnYW55J1xuICB9KSxcbiAgZGF5OiBidWlsZE1hdGNoRm4oe1xuICAgIG1hdGNoUGF0dGVybnM6IG1hdGNoRGF5UGF0dGVybnMsXG4gICAgZGVmYXVsdE1hdGNoV2lkdGg6ICd3aWRlJyxcbiAgICBwYXJzZVBhdHRlcm5zOiBwYXJzZURheVBhdHRlcm5zLFxuICAgIGRlZmF1bHRQYXJzZVdpZHRoOiAnYW55J1xuICB9KSxcbiAgZGF5UGVyaW9kOiBidWlsZE1hdGNoRm4oe1xuICAgIG1hdGNoUGF0dGVybnM6IG1hdGNoRGF5UGVyaW9kUGF0dGVybnMsXG4gICAgZGVmYXVsdE1hdGNoV2lkdGg6ICdhbnknLFxuICAgIHBhcnNlUGF0dGVybnM6IHBhcnNlRGF5UGVyaW9kUGF0dGVybnMsXG4gICAgZGVmYXVsdFBhcnNlV2lkdGg6ICdhbnknXG4gIH0pXG59O1xuZXhwb3J0IGRlZmF1bHQgbWF0Y2g7IiwiaW1wb3J0IGZvcm1hdERpc3RhbmNlIGZyb20gXCIuL19saWIvZm9ybWF0RGlzdGFuY2UvaW5kZXguanNcIjtcbmltcG9ydCBmb3JtYXRMb25nIGZyb20gXCIuL19saWIvZm9ybWF0TG9uZy9pbmRleC5qc1wiO1xuaW1wb3J0IGZvcm1hdFJlbGF0aXZlIGZyb20gXCIuL19saWIvZm9ybWF0UmVsYXRpdmUvaW5kZXguanNcIjtcbmltcG9ydCBsb2NhbGl6ZSBmcm9tIFwiLi9fbGliL2xvY2FsaXplL2luZGV4LmpzXCI7XG5pbXBvcnQgbWF0Y2ggZnJvbSBcIi4vX2xpYi9tYXRjaC9pbmRleC5qc1wiO1xuLyoqXG4gKiBAdHlwZSB7TG9jYWxlfVxuICogQGNhdGVnb3J5IExvY2FsZXNcbiAqIEBzdW1tYXJ5IEVuZ2xpc2ggbG9jYWxlIChVbml0ZWQgU3RhdGVzKS5cbiAqIEBsYW5ndWFnZSBFbmdsaXNoXG4gKiBAaXNvLTYzOS0yIGVuZ1xuICogQGF1dGhvciBTYXNoYSBLb3NzIFtAa29zc25vY29ycF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2tvc3Nub2NvcnB9XG4gKiBAYXV0aG9yIExlc2hhIEtvc3MgW0BsZXNoYWtvc3Nde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9sZXNoYWtvc3N9XG4gKi9cbnZhciBsb2NhbGUgPSB7XG4gIGNvZGU6ICdlbi1VUycsXG4gIGZvcm1hdERpc3RhbmNlOiBmb3JtYXREaXN0YW5jZSxcbiAgZm9ybWF0TG9uZzogZm9ybWF0TG9uZyxcbiAgZm9ybWF0UmVsYXRpdmU6IGZvcm1hdFJlbGF0aXZlLFxuICBsb2NhbGl6ZTogbG9jYWxpemUsXG4gIG1hdGNoOiBtYXRjaCxcbiAgb3B0aW9uczoge1xuICAgIHdlZWtTdGFydHNPbjogMCAvKiBTdW5kYXkgKi8sXG4gICAgZmlyc3RXZWVrQ29udGFpbnNEYXRlOiAxXG4gIH1cbn07XG5leHBvcnQgZGVmYXVsdCBsb2NhbGU7IiwiaW1wb3J0IGlzVmFsaWQgZnJvbSBcIi4uL2lzVmFsaWQvaW5kZXguanNcIjtcbmltcG9ydCBzdWJNaWxsaXNlY29uZHMgZnJvbSBcIi4uL3N1Yk1pbGxpc2Vjb25kcy9pbmRleC5qc1wiO1xuaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgZm9ybWF0dGVycyBmcm9tIFwiLi4vX2xpYi9mb3JtYXQvZm9ybWF0dGVycy9pbmRleC5qc1wiO1xuaW1wb3J0IGxvbmdGb3JtYXR0ZXJzIGZyb20gXCIuLi9fbGliL2Zvcm1hdC9sb25nRm9ybWF0dGVycy9pbmRleC5qc1wiO1xuaW1wb3J0IGdldFRpbWV6b25lT2Zmc2V0SW5NaWxsaXNlY29uZHMgZnJvbSBcIi4uL19saWIvZ2V0VGltZXpvbmVPZmZzZXRJbk1pbGxpc2Vjb25kcy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgaXNQcm90ZWN0ZWREYXlPZlllYXJUb2tlbiwgaXNQcm90ZWN0ZWRXZWVrWWVhclRva2VuLCB0aHJvd1Byb3RlY3RlZEVycm9yIH0gZnJvbSBcIi4uL19saWIvcHJvdGVjdGVkVG9rZW5zL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi9fbGliL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmltcG9ydCB7IGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSBcIi4uL19saWIvZGVmYXVsdE9wdGlvbnMvaW5kZXguanNcIjtcbmltcG9ydCBkZWZhdWx0TG9jYWxlIGZyb20gXCIuLi9fbGliL2RlZmF1bHRMb2NhbGUvaW5kZXguanNcIjsgLy8gVGhpcyBSZWdFeHAgY29uc2lzdHMgb2YgdGhyZWUgcGFydHMgc2VwYXJhdGVkIGJ5IGB8YDpcbi8vIC0gW3lZUXFNTHdJZERlY2loSEtrbXNdbyBtYXRjaGVzIGFueSBhdmFpbGFibGUgb3JkaW5hbCBudW1iZXIgdG9rZW5cbi8vICAgKG9uZSBvZiB0aGUgY2VydGFpbiBsZXR0ZXJzIGZvbGxvd2VkIGJ5IGBvYClcbi8vIC0gKFxcdylcXDEqIG1hdGNoZXMgYW55IHNlcXVlbmNlcyBvZiB0aGUgc2FtZSBsZXR0ZXJcbi8vIC0gJycgbWF0Y2hlcyB0d28gcXVvdGUgY2hhcmFjdGVycyBpbiBhIHJvd1xuLy8gLSAnKCcnfFteJ10pKygnfCQpIG1hdGNoZXMgYW55dGhpbmcgc3Vycm91bmRlZCBieSB0d28gcXVvdGUgY2hhcmFjdGVycyAoJyksXG4vLyAgIGV4Y2VwdCBhIHNpbmdsZSBxdW90ZSBzeW1ib2wsIHdoaWNoIGVuZHMgdGhlIHNlcXVlbmNlLlxuLy8gICBUd28gcXVvdGUgY2hhcmFjdGVycyBkbyBub3QgZW5kIHRoZSBzZXF1ZW5jZS5cbi8vICAgSWYgdGhlcmUgaXMgbm8gbWF0Y2hpbmcgc2luZ2xlIHF1b3RlXG4vLyAgIHRoZW4gdGhlIHNlcXVlbmNlIHdpbGwgY29udGludWUgdW50aWwgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLlxuLy8gLSAuIG1hdGNoZXMgYW55IHNpbmdsZSBjaGFyYWN0ZXIgdW5tYXRjaGVkIGJ5IHByZXZpb3VzIHBhcnRzIG9mIHRoZSBSZWdFeHBzXG52YXIgZm9ybWF0dGluZ1Rva2Vuc1JlZ0V4cCA9IC9beVlRcU1Md0lkRGVjaWhIS2ttc11vfChcXHcpXFwxKnwnJ3wnKCcnfFteJ10pKygnfCQpfC4vZztcblxuLy8gVGhpcyBSZWdFeHAgY2F0Y2hlcyBzeW1ib2xzIGVzY2FwZWQgYnkgcXVvdGVzLCBhbmQgYWxzb1xuLy8gc2VxdWVuY2VzIG9mIHN5bWJvbHMgUCwgcCwgYW5kIHRoZSBjb21iaW5hdGlvbnMgbGlrZSBgUFBQUFBQUHBwcHBwYFxudmFyIGxvbmdGb3JtYXR0aW5nVG9rZW5zUmVnRXhwID0gL1ArcCt8UCt8cCt8Jyd8JygnJ3xbXiddKSsoJ3wkKXwuL2c7XG52YXIgZXNjYXBlZFN0cmluZ1JlZ0V4cCA9IC9eJyhbXl0qPyknPyQvO1xudmFyIGRvdWJsZVF1b3RlUmVnRXhwID0gLycnL2c7XG52YXIgdW5lc2NhcGVkTGF0aW5DaGFyYWN0ZXJSZWdFeHAgPSAvW2EtekEtWl0vO1xuXG4vKipcbiAqIEBuYW1lIGZvcm1hdFxuICogQGNhdGVnb3J5IENvbW1vbiBIZWxwZXJzXG4gKiBAc3VtbWFyeSBGb3JtYXQgdGhlIGRhdGUuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm4gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZyBpbiB0aGUgZ2l2ZW4gZm9ybWF0LiBUaGUgcmVzdWx0IG1heSB2YXJ5IGJ5IGxvY2FsZS5cbiAqXG4gKiA+IOKaoO+4jyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBgZm9ybWF0YCB0b2tlbnMgZGlmZmVyIGZyb20gTW9tZW50LmpzIGFuZCBvdGhlciBsaWJyYXJpZXMuXG4gKiA+IFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICpcbiAqIFRoZSBjaGFyYWN0ZXJzIHdyYXBwZWQgYmV0d2VlbiB0d28gc2luZ2xlIHF1b3RlcyBjaGFyYWN0ZXJzICgnKSBhcmUgZXNjYXBlZC5cbiAqIFR3byBzaW5nbGUgcXVvdGVzIGluIGEgcm93LCB3aGV0aGVyIGluc2lkZSBvciBvdXRzaWRlIGEgcXVvdGVkIHNlcXVlbmNlLCByZXByZXNlbnQgYSAncmVhbCcgc2luZ2xlIHF1b3RlLlxuICogKHNlZSB0aGUgbGFzdCBleGFtcGxlKVxuICpcbiAqIEZvcm1hdCBvZiB0aGUgc3RyaW5nIGlzIGJhc2VkIG9uIFVuaWNvZGUgVGVjaG5pY2FsIFN0YW5kYXJkICMzNTpcbiAqIGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL3JlcG9ydHMvdHIzNS90cjM1LWRhdGVzLmh0bWwjRGF0ZV9GaWVsZF9TeW1ib2xfVGFibGVcbiAqIHdpdGggYSBmZXcgYWRkaXRpb25zIChzZWUgbm90ZSA3IGJlbG93IHRoZSB0YWJsZSkuXG4gKlxuICogQWNjZXB0ZWQgcGF0dGVybnM6XG4gKiB8IFVuaXQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQYXR0ZXJuIHwgUmVzdWx0IGV4YW1wbGVzICAgICAgICAgICAgICAgICAgIHwgTm90ZXMgfFxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLXxcbiAqIHwgRXJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEcuLkdHRyAgfCBBRCwgQkMgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBHR0dHICAgIHwgQW5ubyBEb21pbmksIEJlZm9yZSBDaHJpc3QgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgR0dHR0cgICB8IEEsIEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgQ2FsZW5kYXIgeWVhciAgICAgICAgICAgICAgICAgICB8IHkgICAgICAgfCA0NCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB5byAgICAgIHwgNDR0aCwgMXN0LCAwdGgsIDE3dGggICAgICAgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeXkgICAgICB8IDQ0LCAwMSwgMDAsIDE3ICAgICAgICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHl5eSAgICAgfCAwNDQsIDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB5eXl5ICAgIHwgMDA0NCwgMDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeXl5eXkgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMsNSAgIHxcbiAqIHwgTG9jYWwgd2Vlay1udW1iZXJpbmcgeWVhciAgICAgICB8IFkgICAgICAgfCA0NCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBZbyAgICAgIHwgNDR0aCwgMXN0LCAxOTAwdGgsIDIwMTd0aCAgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWVkgICAgICB8IDQ0LCAwMSwgMDAsIDE3ICAgICAgICAgICAgICAgICAgICB8IDUsOCAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFlZWSAgICAgfCAwNDQsIDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBZWVlZICAgIHwgMDA0NCwgMDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgIHwgNSw4ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWVlZWVkgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMsNSAgIHxcbiAqIHwgSVNPIHdlZWstbnVtYmVyaW5nIHllYXIgICAgICAgICB8IFIgICAgICAgfCAtNDMsIDAsIDEsIDE5MDAsIDIwMTcgICAgICAgICAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBSUiAgICAgIHwgLTQzLCAwMCwgMDEsIDE5MDAsIDIwMTcgICAgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUlJSICAgICB8IC0wNDMsIDAwMCwgMDAxLCAxOTAwLCAyMDE3ICAgICAgICB8IDUsNyAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFJSUlIgICAgfCAtMDA0MywgMDAwMCwgMDAwMSwgMTkwMCwgMjAxNyAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBSUlJSUiAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyw1LDcgfFxuICogfCBFeHRlbmRlZCB5ZWFyICAgICAgICAgICAgICAgICAgIHwgdSAgICAgICB8IC00MywgMCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHV1ICAgICAgfCAtNDMsIDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB1dXUgICAgIHwgLTA0MywgMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgdXV1dSAgICB8IC0wMDQzLCAwMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHV1dXV1ICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzLDUgICB8XG4gKiB8IFF1YXJ0ZXIgKGZvcm1hdHRpbmcpICAgICAgICAgICAgfCBRICAgICAgIHwgMSwgMiwgMywgNCAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUW8gICAgICB8IDFzdCwgMm5kLCAzcmQsIDR0aCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFFRICAgICAgfCAwMSwgMDIsIDAzLCAwNCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBRUVEgICAgIHwgUTEsIFEyLCBRMywgUTQgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUVFRUSAgICB8IDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFFRUVFRICAgfCAxLCAyLCAzLCA0ICAgICAgICAgICAgICAgICAgICAgICAgfCA0ICAgICB8XG4gKiB8IFF1YXJ0ZXIgKHN0YW5kLWFsb25lKSAgICAgICAgICAgfCBxICAgICAgIHwgMSwgMiwgMywgNCAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcW8gICAgICB8IDFzdCwgMm5kLCAzcmQsIDR0aCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHFxICAgICAgfCAwMSwgMDIsIDAzLCAwNCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBxcXEgICAgIHwgUTEsIFEyLCBRMywgUTQgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcXFxcSAgICB8IDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHFxcXFxICAgfCAxLCAyLCAzLCA0ICAgICAgICAgICAgICAgICAgICAgICAgfCA0ICAgICB8XG4gKiB8IE1vbnRoIChmb3JtYXR0aW5nKSAgICAgICAgICAgICAgfCBNICAgICAgIHwgMSwgMiwgLi4uLCAxMiAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTW8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDEydGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE1NICAgICAgfCAwMSwgMDIsIC4uLiwgMTIgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBNTU0gICAgIHwgSmFuLCBGZWIsIC4uLiwgRGVjICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTU1NTSAgICB8IEphbnVhcnksIEZlYnJ1YXJ5LCAuLi4sIERlY2VtYmVyICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE1NTU1NICAgfCBKLCBGLCAuLi4sIEQgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IE1vbnRoIChzdGFuZC1hbG9uZSkgICAgICAgICAgICAgfCBMICAgICAgIHwgMSwgMiwgLi4uLCAxMiAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTG8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDEydGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IExMICAgICAgfCAwMSwgMDIsIC4uLiwgMTIgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBMTEwgICAgIHwgSmFuLCBGZWIsIC4uLiwgRGVjICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTExMTCAgICB8IEphbnVhcnksIEZlYnJ1YXJ5LCAuLi4sIERlY2VtYmVyICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IExMTExMICAgfCBKLCBGLCAuLi4sIEQgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IExvY2FsIHdlZWsgb2YgeWVhciAgICAgICAgICAgICAgfCB3ICAgICAgIHwgMSwgMiwgLi4uLCA1MyAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgd28gICAgICB8IDFzdCwgMm5kLCAuLi4sIDUzdGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHd3ICAgICAgfCAwMSwgMDIsIC4uLiwgNTMgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IElTTyB3ZWVrIG9mIHllYXIgICAgICAgICAgICAgICAgfCBJICAgICAgIHwgMSwgMiwgLi4uLCA1MyAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgSW8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDUzdGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IElJICAgICAgfCAwMSwgMDIsIC4uLiwgNTMgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8IERheSBvZiBtb250aCAgICAgICAgICAgICAgICAgICAgfCBkICAgICAgIHwgMSwgMiwgLi4uLCAzMSAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZG8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDMxc3QgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGRkICAgICAgfCAwMSwgMDIsIC4uLiwgMzEgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IERheSBvZiB5ZWFyICAgICAgICAgICAgICAgICAgICAgfCBEICAgICAgIHwgMSwgMiwgLi4uLCAzNjUsIDM2NiAgICAgICAgICAgICAgIHwgOSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRG8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDM2NXRoLCAzNjZ0aCAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEREICAgICAgfCAwMSwgMDIsIC4uLiwgMzY1LCAzNjYgICAgICAgICAgICAgfCA5ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBEREQgICAgIHwgMDAxLCAwMDIsIC4uLiwgMzY1LCAzNjYgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRERERCAgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMgICAgIHxcbiAqIHwgRGF5IG9mIHdlZWsgKGZvcm1hdHRpbmcpICAgICAgICB8IEUuLkVFRSAgfCBNb24sIFR1ZSwgV2VkLCAuLi4sIFN1biAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBFRUVFICAgIHwgTW9uZGF5LCBUdWVzZGF5LCAuLi4sIFN1bmRheSAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRUVFRUUgICB8IE0sIFQsIFcsIFQsIEYsIFMsIFMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEVFRUVFRSAgfCBNbywgVHUsIFdlLCBUaCwgRnIsIFNhLCBTdSAgICAgICAgfCAgICAgICB8XG4gKiB8IElTTyBkYXkgb2Ygd2VlayAoZm9ybWF0dGluZykgICAgfCBpICAgICAgIHwgMSwgMiwgMywgLi4uLCA3ICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaW8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDd0aCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGlpICAgICAgfCAwMSwgMDIsIC4uLiwgMDcgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBpaWkgICAgIHwgTW9uLCBUdWUsIFdlZCwgLi4uLCBTdW4gICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaWlpaSAgICB8IE1vbmRheSwgVHVlc2RheSwgLi4uLCBTdW5kYXkgICAgICB8IDIsNyAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGlpaWlpICAgfCBNLCBULCBXLCBULCBGLCBTLCBTICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBpaWlpaWkgIHwgTW8sIFR1LCBXZSwgVGgsIEZyLCBTYSwgU3UgICAgICAgIHwgNyAgICAgfFxuICogfCBMb2NhbCBkYXkgb2Ygd2VlayAoZm9ybWF0dGluZykgIHwgZSAgICAgICB8IDIsIDMsIDQsIC4uLiwgMSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGVvICAgICAgfCAybmQsIDNyZCwgLi4uLCAxc3QgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBlZSAgICAgIHwgMDIsIDAzLCAuLi4sIDAxICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZWVlICAgICB8IE1vbiwgVHVlLCBXZWQsIC4uLiwgU3VuICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGVlZWUgICAgfCBNb25kYXksIFR1ZXNkYXksIC4uLiwgU3VuZGF5ICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBlZWVlZSAgIHwgTSwgVCwgVywgVCwgRiwgUywgUyAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZWVlZWVlICB8IE1vLCBUdSwgV2UsIFRoLCBGciwgU2EsIFN1ICAgICAgICB8ICAgICAgIHxcbiAqIHwgTG9jYWwgZGF5IG9mIHdlZWsgKHN0YW5kLWFsb25lKSB8IGMgICAgICAgfCAyLCAzLCA0LCAuLi4sIDEgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBjbyAgICAgIHwgMm5kLCAzcmQsIC4uLiwgMXN0ICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgY2MgICAgICB8IDAyLCAwMywgLi4uLCAwMSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGNjYyAgICAgfCBNb24sIFR1ZSwgV2VkLCAuLi4sIFN1biAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBjY2NjICAgIHwgTW9uZGF5LCBUdWVzZGF5LCAuLi4sIFN1bmRheSAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgY2NjY2MgICB8IE0sIFQsIFcsIFQsIEYsIFMsIFMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGNjY2NjYyAgfCBNbywgVHUsIFdlLCBUaCwgRnIsIFNhLCBTdSAgICAgICAgfCAgICAgICB8XG4gKiB8IEFNLCBQTSAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhLi5hYSAgIHwgQU0sIFBNICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYWFhICAgICB8IGFtLCBwbSAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGFhYWEgICAgfCBhLm0uLCBwLm0uICAgICAgICAgICAgICAgICAgICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhYWFhYSAgIHwgYSwgcCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBBTSwgUE0sIG5vb24sIG1pZG5pZ2h0ICAgICAgICAgIHwgYi4uYmIgICB8IEFNLCBQTSwgbm9vbiwgbWlkbmlnaHQgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGJiYiAgICAgfCBhbSwgcG0sIG5vb24sIG1pZG5pZ2h0ICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBiYmJiICAgIHwgYS5tLiwgcC5tLiwgbm9vbiwgbWlkbmlnaHQgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYmJiYmIgICB8IGEsIHAsIG4sIG1pICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgRmxleGlibGUgZGF5IHBlcmlvZCAgICAgICAgICAgICB8IEIuLkJCQiAgfCBhdCBuaWdodCwgaW4gdGhlIG1vcm5pbmcsIC4uLiAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBCQkJCICAgIHwgYXQgbmlnaHQsIGluIHRoZSBtb3JuaW5nLCAuLi4gICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgQkJCQkIgICB8IGF0IG5pZ2h0LCBpbiB0aGUgbW9ybmluZywgLi4uICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMS0xMl0gICAgICAgICAgICAgICAgICAgICB8IGggICAgICAgfCAxLCAyLCAuLi4sIDExLCAxMiAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBobyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMTF0aCwgMTJ0aCAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaGggICAgICB8IDAxLCAwMiwgLi4uLCAxMSwgMTIgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMC0yM10gICAgICAgICAgICAgICAgICAgICB8IEggICAgICAgfCAwLCAxLCAyLCAuLi4sIDIzICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBIbyAgICAgIHwgMHRoLCAxc3QsIDJuZCwgLi4uLCAyM3JkICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgSEggICAgICB8IDAwLCAwMSwgMDIsIC4uLiwgMjMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMC0xMV0gICAgICAgICAgICAgICAgICAgICB8IEsgICAgICAgfCAxLCAyLCAuLi4sIDExLCAwICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBLbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMTF0aCwgMHRoICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgS0sgICAgICB8IDAxLCAwMiwgLi4uLCAxMSwgMDAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMS0yNF0gICAgICAgICAgICAgICAgICAgICB8IGsgICAgICAgfCAyNCwgMSwgMiwgLi4uLCAyMyAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBrbyAgICAgIHwgMjR0aCwgMXN0LCAybmQsIC4uLiwgMjNyZCAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwga2sgICAgICB8IDI0LCAwMSwgMDIsIC4uLiwgMjMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgTWludXRlICAgICAgICAgICAgICAgICAgICAgICAgICB8IG0gICAgICAgfCAwLCAxLCAuLi4sIDU5ICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBtbyAgICAgIHwgMHRoLCAxc3QsIC4uLiwgNTl0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgbW0gICAgICB8IDAwLCAwMSwgLi4uLCA1OSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgU2Vjb25kICAgICAgICAgICAgICAgICAgICAgICAgICB8IHMgICAgICAgfCAwLCAxLCAuLi4sIDU5ICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBzbyAgICAgIHwgMHRoLCAxc3QsIC4uLiwgNTl0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgc3MgICAgICB8IDAwLCAwMSwgLi4uLCA1OSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgRnJhY3Rpb24gb2Ygc2Vjb25kICAgICAgICAgICAgICB8IFMgICAgICAgfCAwLCAxLCAuLi4sIDkgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBTUyAgICAgIHwgMDAsIDAxLCAuLi4sIDk5ICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgU1NTICAgICB8IDAwMCwgMDAxLCAuLi4sIDk5OSAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFNTU1MgICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzICAgICB8XG4gKiB8IFRpbWV6b25lIChJU08tODYwMSB3LyBaKSAgICAgICAgfCBYICAgICAgIHwgLTA4LCArMDUzMCwgWiAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWFggICAgICB8IC0wODAwLCArMDUzMCwgWiAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFhYWCAgICAgfCAtMDg6MDAsICswNTozMCwgWiAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBYWFhYICAgIHwgLTA4MDAsICswNTMwLCBaLCArMTIzNDU2ICAgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWFhYWFggICB8IC0wODowMCwgKzA1OjMwLCBaLCArMTI6MzQ6NTYgICAgICB8ICAgICAgIHxcbiAqIHwgVGltZXpvbmUgKElTTy04NjAxIHcvbyBaKSAgICAgICB8IHggICAgICAgfCAtMDgsICswNTMwLCArMDAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB4eCAgICAgIHwgLTA4MDAsICswNTMwLCArMDAwMCAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeHh4ICAgICB8IC0wODowMCwgKzA1OjMwLCArMDA6MDAgICAgICAgICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHh4eHggICAgfCAtMDgwMCwgKzA1MzAsICswMDAwLCArMTIzNDU2ICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB4eHh4eCAgIHwgLTA4OjAwLCArMDU6MzAsICswMDowMCwgKzEyOjM0OjU2IHwgICAgICAgfFxuICogfCBUaW1lem9uZSAoR01UKSAgICAgICAgICAgICAgICAgIHwgTy4uLk9PTyB8IEdNVC04LCBHTVQrNTozMCwgR01UKzAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE9PT08gICAgfCBHTVQtMDg6MDAsIEdNVCswNTozMCwgR01UKzAwOjAwICAgfCAyICAgICB8XG4gKiB8IFRpbWV6b25lIChzcGVjaWZpYyBub24tbG9jYXQuKSAgfCB6Li4uenp6IHwgR01ULTgsIEdNVCs1OjMwLCBHTVQrMCAgICAgICAgICAgIHwgNiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgenp6eiAgICB8IEdNVC0wODowMCwgR01UKzA1OjMwLCBHTVQrMDA6MDAgICB8IDIsNiAgIHxcbiAqIHwgU2Vjb25kcyB0aW1lc3RhbXAgICAgICAgICAgICAgICB8IHQgICAgICAgfCA1MTI5Njk1MjAgICAgICAgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB0dCAgICAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyw3ICAgfFxuICogfCBNaWxsaXNlY29uZHMgdGltZXN0YW1wICAgICAgICAgIHwgVCAgICAgICB8IDUxMjk2OTUyMDkwMCAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFRUICAgICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzLDcgICB8XG4gKiB8IExvbmcgbG9jYWxpemVkIGRhdGUgICAgICAgICAgICAgfCBQICAgICAgIHwgMDQvMjkvMTQ1MyAgICAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUFAgICAgICB8IEFwciAyOSwgMTQ1MyAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBQUCAgICAgfCBBcHJpbCAyOXRoLCAxNDUzICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQUFBQICAgIHwgRnJpZGF5LCBBcHJpbCAyOXRoLCAxNDUzICAgICAgICAgIHwgMiw3ICAgfFxuICogfCBMb25nIGxvY2FsaXplZCB0aW1lICAgICAgICAgICAgIHwgcCAgICAgICB8IDEyOjAwIEFNICAgICAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHBwICAgICAgfCAxMjowMDowMCBBTSAgICAgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBwcHAgICAgIHwgMTI6MDA6MDAgQU0gR01UKzIgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcHBwcCAgICB8IDEyOjAwOjAwIEFNIEdNVCswMjowMCAgICAgICAgICAgICB8IDIsNyAgIHxcbiAqIHwgQ29tYmluYXRpb24gb2YgZGF0ZSBhbmQgdGltZSAgICB8IFBwICAgICAgfCAwNC8yOS8xNDUzLCAxMjowMCBBTSAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQUHBwICAgIHwgQXByIDI5LCAxNDUzLCAxMjowMDowMCBBTSAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUFBQcHBwICB8IEFwcmlsIDI5dGgsIDE0NTMgYXQgLi4uICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBQUFBwcHBwfCBGcmlkYXksIEFwcmlsIDI5dGgsIDE0NTMgYXQgLi4uICAgfCAyLDcgICB8XG4gKiBOb3RlczpcbiAqIDEuIFwiRm9ybWF0dGluZ1wiIHVuaXRzIChlLmcuIGZvcm1hdHRpbmcgcXVhcnRlcikgaW4gdGhlIGRlZmF1bHQgZW4tVVMgbG9jYWxlXG4gKiAgICBhcmUgdGhlIHNhbWUgYXMgXCJzdGFuZC1hbG9uZVwiIHVuaXRzLCBidXQgYXJlIGRpZmZlcmVudCBpbiBzb21lIGxhbmd1YWdlcy5cbiAqICAgIFwiRm9ybWF0dGluZ1wiIHVuaXRzIGFyZSBkZWNsaW5lZCBhY2NvcmRpbmcgdG8gdGhlIHJ1bGVzIG9mIHRoZSBsYW5ndWFnZVxuICogICAgaW4gdGhlIGNvbnRleHQgb2YgYSBkYXRlLiBcIlN0YW5kLWFsb25lXCIgdW5pdHMgYXJlIGFsd2F5cyBub21pbmF0aXZlIHNpbmd1bGFyOlxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnZG8gTExMTCcsIHtsb2NhbGU6IGNzfSkgLy89PiAnNi4gbGlzdG9wYWQnYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnZG8gTU1NTScsIHtsb2NhbGU6IGNzfSkgLy89PiAnNi4gbGlzdG9wYWR1J2BcbiAqXG4gKiAyLiBBbnkgc2VxdWVuY2Ugb2YgdGhlIGlkZW50aWNhbCBsZXR0ZXJzIGlzIGEgcGF0dGVybiwgdW5sZXNzIGl0IGlzIGVzY2FwZWQgYnlcbiAqICAgIHRoZSBzaW5nbGUgcXVvdGUgY2hhcmFjdGVycyAoc2VlIGJlbG93KS5cbiAqICAgIElmIHRoZSBzZXF1ZW5jZSBpcyBsb25nZXIgdGhhbiBsaXN0ZWQgaW4gdGFibGUgKGUuZy4gYEVFRUVFRUVFRUVFYClcbiAqICAgIHRoZSBvdXRwdXQgd2lsbCBiZSB0aGUgc2FtZSBhcyBkZWZhdWx0IHBhdHRlcm4gZm9yIHRoaXMgdW5pdCwgdXN1YWxseVxuICogICAgdGhlIGxvbmdlc3Qgb25lIChpbiBjYXNlIG9mIElTTyB3ZWVrZGF5cywgYEVFRUVgKS4gRGVmYXVsdCBwYXR0ZXJucyBmb3IgdW5pdHNcbiAqICAgIGFyZSBtYXJrZWQgd2l0aCBcIjJcIiBpbiB0aGUgbGFzdCBjb2x1bW4gb2YgdGhlIHRhYmxlLlxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NJykgLy89PiAnTm92J2BcbiAqXG4gKiAgICBgZm9ybWF0KG5ldyBEYXRlKDIwMTcsIDEwLCA2KSwgJ01NTU0nKSAvLz0+ICdOb3ZlbWJlcidgXG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdNTU1NTScpIC8vPT4gJ04nYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NTU1NJykgLy89PiAnTm92ZW1iZXInYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NTU1NTScpIC8vPT4gJ05vdmVtYmVyJ2BcbiAqXG4gKiAzLiBTb21lIHBhdHRlcm5zIGNvdWxkIGJlIHVubGltaXRlZCBsZW5ndGggKHN1Y2ggYXMgYHl5eXl5eXl5YCkuXG4gKiAgICBUaGUgb3V0cHV0IHdpbGwgYmUgcGFkZGVkIHdpdGggemVyb3MgdG8gbWF0Y2ggdGhlIGxlbmd0aCBvZiB0aGUgcGF0dGVybi5cbiAqXG4gKiAgICBgZm9ybWF0KG5ldyBEYXRlKDIwMTcsIDEwLCA2KSwgJ3l5eXl5eXl5JykgLy89PiAnMDAwMDIwMTcnYFxuICpcbiAqIDQuIGBRUVFRUWAgYW5kIGBxcXFxcWAgY291bGQgYmUgbm90IHN0cmljdGx5IG51bWVyaWNhbCBpbiBzb21lIGxvY2FsZXMuXG4gKiAgICBUaGVzZSB0b2tlbnMgcmVwcmVzZW50IHRoZSBzaG9ydGVzdCBmb3JtIG9mIHRoZSBxdWFydGVyLlxuICpcbiAqIDUuIFRoZSBtYWluIGRpZmZlcmVuY2UgYmV0d2VlbiBgeWAgYW5kIGB1YCBwYXR0ZXJucyBhcmUgQi5DLiB5ZWFyczpcbiAqXG4gKiAgICB8IFllYXIgfCBgeWAgfCBgdWAgfFxuICogICAgfC0tLS0tLXwtLS0tLXwtLS0tLXxcbiAqICAgIHwgQUMgMSB8ICAgMSB8ICAgMSB8XG4gKiAgICB8IEJDIDEgfCAgIDEgfCAgIDAgfFxuICogICAgfCBCQyAyIHwgICAyIHwgIC0xIHxcbiAqXG4gKiAgICBBbHNvIGB5eWAgYWx3YXlzIHJldHVybnMgdGhlIGxhc3QgdHdvIGRpZ2l0cyBvZiBhIHllYXIsXG4gKiAgICB3aGlsZSBgdXVgIHBhZHMgc2luZ2xlIGRpZ2l0IHllYXJzIHRvIDIgY2hhcmFjdGVycyBhbmQgcmV0dXJucyBvdGhlciB5ZWFycyB1bmNoYW5nZWQ6XG4gKlxuICogICAgfCBZZWFyIHwgYHl5YCB8IGB1dWAgfFxuICogICAgfC0tLS0tLXwtLS0tLS18LS0tLS0tfFxuICogICAgfCAxICAgIHwgICAwMSB8ICAgMDEgfFxuICogICAgfCAxNCAgIHwgICAxNCB8ICAgMTQgfFxuICogICAgfCAzNzYgIHwgICA3NiB8ICAzNzYgfFxuICogICAgfCAxNDUzIHwgICA1MyB8IDE0NTMgfFxuICpcbiAqICAgIFRoZSBzYW1lIGRpZmZlcmVuY2UgaXMgdHJ1ZSBmb3IgbG9jYWwgYW5kIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFycyAoYFlgIGFuZCBgUmApLFxuICogICAgZXhjZXB0IGxvY2FsIHdlZWstbnVtYmVyaW5nIHllYXJzIGFyZSBkZXBlbmRlbnQgb24gYG9wdGlvbnMud2Vla1N0YXJ0c09uYFxuICogICAgYW5kIGBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZWAgKGNvbXBhcmUgW2dldElTT1dlZWtZZWFyXXtAbGluayBodHRwczovL2RhdGUtZm5zLm9yZy9kb2NzL2dldElTT1dlZWtZZWFyfVxuICogICAgYW5kIFtnZXRXZWVrWWVhcl17QGxpbmsgaHR0cHM6Ly9kYXRlLWZucy5vcmcvZG9jcy9nZXRXZWVrWWVhcn0pLlxuICpcbiAqIDYuIFNwZWNpZmljIG5vbi1sb2NhdGlvbiB0aW1lem9uZXMgYXJlIGN1cnJlbnRseSB1bmF2YWlsYWJsZSBpbiBgZGF0ZS1mbnNgLFxuICogICAgc28gcmlnaHQgbm93IHRoZXNlIHRva2VucyBmYWxsIGJhY2sgdG8gR01UIHRpbWV6b25lcy5cbiAqXG4gKiA3LiBUaGVzZSBwYXR0ZXJucyBhcmUgbm90IGluIHRoZSBVbmljb2RlIFRlY2huaWNhbCBTdGFuZGFyZCAjMzU6XG4gKiAgICAtIGBpYDogSVNPIGRheSBvZiB3ZWVrXG4gKiAgICAtIGBJYDogSVNPIHdlZWsgb2YgeWVhclxuICogICAgLSBgUmA6IElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gKiAgICAtIGB0YDogc2Vjb25kcyB0aW1lc3RhbXBcbiAqICAgIC0gYFRgOiBtaWxsaXNlY29uZHMgdGltZXN0YW1wXG4gKiAgICAtIGBvYDogb3JkaW5hbCBudW1iZXIgbW9kaWZpZXJcbiAqICAgIC0gYFBgOiBsb25nIGxvY2FsaXplZCBkYXRlXG4gKiAgICAtIGBwYDogbG9uZyBsb2NhbGl6ZWQgdGltZVxuICpcbiAqIDguIGBZWWAgYW5kIGBZWVlZYCB0b2tlbnMgcmVwcmVzZW50IHdlZWstbnVtYmVyaW5nIHllYXJzIGJ1dCB0aGV5IGFyZSBvZnRlbiBjb25mdXNlZCB3aXRoIHllYXJzLlxuICogICAgWW91IHNob3VsZCBlbmFibGUgYG9wdGlvbnMudXNlQWRkaXRpb25hbFdlZWtZZWFyVG9rZW5zYCB0byB1c2UgdGhlbS4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKlxuICogOS4gYERgIGFuZCBgRERgIHRva2VucyByZXByZXNlbnQgZGF5cyBvZiB0aGUgeWVhciBidXQgdGhleSBhcmUgb2Z0ZW4gY29uZnVzZWQgd2l0aCBkYXlzIG9mIHRoZSBtb250aC5cbiAqICAgIFlvdSBzaG91bGQgZW5hYmxlIGBvcHRpb25zLnVzZUFkZGl0aW9uYWxEYXlPZlllYXJUb2tlbnNgIHRvIHVzZSB0aGVtLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqXG4gKiBAcGFyYW0ge0RhdGV8TnVtYmVyfSBkYXRlIC0gdGhlIG9yaWdpbmFsIGRhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmb3JtYXQgLSB0aGUgc3RyaW5nIG9mIHRva2Vuc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIGFuIG9iamVjdCB3aXRoIG9wdGlvbnMuXG4gKiBAcGFyYW0ge0xvY2FsZX0gW29wdGlvbnMubG9jYWxlPWRlZmF1bHRMb2NhbGVdIC0gdGhlIGxvY2FsZSBvYmplY3QuIFNlZSBbTG9jYWxlXXtAbGluayBodHRwczovL2RhdGUtZm5zLm9yZy9kb2NzL0xvY2FsZX1cbiAqIEBwYXJhbSB7MHwxfDJ8M3w0fDV8Nn0gW29wdGlvbnMud2Vla1N0YXJ0c09uPTBdIC0gdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgKDAgLSBTdW5kYXkpXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlPTFdIC0gdGhlIGRheSBvZiBKYW51YXJ5LCB3aGljaCBpc1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51c2VBZGRpdGlvbmFsV2Vla1llYXJUb2tlbnM9ZmFsc2VdIC0gaWYgdHJ1ZSwgYWxsb3dzIHVzYWdlIG9mIHRoZSB3ZWVrLW51bWJlcmluZyB5ZWFyIHRva2VucyBgWVlgIGFuZCBgWVlZWWA7XG4gKiAgIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51c2VBZGRpdGlvbmFsRGF5T2ZZZWFyVG9rZW5zPWZhbHNlXSAtIGlmIHRydWUsIGFsbG93cyB1c2FnZSBvZiB0aGUgZGF5IG9mIHllYXIgdG9rZW5zIGBEYCBhbmQgYEREYDtcbiAqICAgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKiBAcmV0dXJucyB7U3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDIgYXJndW1lbnRzIHJlcXVpcmVkXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBgZGF0ZWAgbXVzdCBub3QgYmUgSW52YWxpZCBEYXRlXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBgb3B0aW9ucy5sb2NhbGVgIG11c3QgY29udGFpbiBgbG9jYWxpemVgIHByb3BlcnR5XG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBgb3B0aW9ucy5sb2NhbGVgIG11c3QgY29udGFpbiBgZm9ybWF0TG9uZ2AgcHJvcGVydHlcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBvcHRpb25zLndlZWtTdGFydHNPbmAgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDZcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZWAgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDdcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IHVzZSBgeXl5eWAgaW5zdGVhZCBvZiBgWVlZWWAgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdXNpbmcgW2Zvcm1hdCBwcm92aWRlZF0gdG8gdGhlIGlucHV0IFtpbnB1dCBwcm92aWRlZF07IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gdXNlIGB5eWAgaW5zdGVhZCBvZiBgWVlgIGZvciBmb3JtYXR0aW5nIHllYXJzIHVzaW5nIFtmb3JtYXQgcHJvdmlkZWRdIHRvIHRoZSBpbnB1dCBbaW5wdXQgcHJvdmlkZWRdOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IHVzZSBgZGAgaW5zdGVhZCBvZiBgRGAgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdXNpbmcgW2Zvcm1hdCBwcm92aWRlZF0gdG8gdGhlIGlucHV0IFtpbnB1dCBwcm92aWRlZF07IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gdXNlIGBkZGAgaW5zdGVhZCBvZiBgRERgIGZvciBmb3JtYXR0aW5nIGRheXMgb2YgdGhlIG1vbnRoIHVzaW5nIFtmb3JtYXQgcHJvdmlkZWRdIHRvIHRoZSBpbnB1dCBbaW5wdXQgcHJvdmlkZWRdOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGZvcm1hdCBzdHJpbmcgY29udGFpbnMgYW4gdW5lc2NhcGVkIGxhdGluIGFscGhhYmV0IGNoYXJhY3RlclxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSZXByZXNlbnQgMTEgRmVicnVhcnkgMjAxNCBpbiBtaWRkbGUtZW5kaWFuIGZvcm1hdDpcbiAqIGNvbnN0IHJlc3VsdCA9IGZvcm1hdChuZXcgRGF0ZSgyMDE0LCAxLCAxMSksICdNTS9kZC95eXl5JylcbiAqIC8vPT4gJzAyLzExLzIwMTQnXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFJlcHJlc2VudCAyIEp1bHkgMjAxNCBpbiBFc3BlcmFudG86XG4gKiBpbXBvcnQgeyBlb0xvY2FsZSB9IGZyb20gJ2RhdGUtZm5zL2xvY2FsZS9lbydcbiAqIGNvbnN0IHJlc3VsdCA9IGZvcm1hdChuZXcgRGF0ZSgyMDE0LCA2LCAyKSwgXCJkbyAnZGUnIE1NTU0geXl5eVwiLCB7XG4gKiAgIGxvY2FsZTogZW9Mb2NhbGVcbiAqIH0pXG4gKiAvLz0+ICcyLWEgZGUganVsaW8gMjAxNCdcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRXNjYXBlIHN0cmluZyBieSBzaW5nbGUgcXVvdGUgY2hhcmFjdGVyczpcbiAqIGNvbnN0IHJlc3VsdCA9IGZvcm1hdChuZXcgRGF0ZSgyMDE0LCA2LCAyLCAxNSksIFwiaCAnbycnY2xvY2snXCIpXG4gKiAvLz0+IFwiMyBvJ2Nsb2NrXCJcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtYXQoZGlydHlEYXRlLCBkaXJ0eUZvcm1hdFN0ciwgb3B0aW9ucykge1xuICB2YXIgX3JlZiwgX29wdGlvbnMkbG9jYWxlLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfb3B0aW9ucyRmaXJzdFdlZWtDb24sIF9vcHRpb25zJGxvY2FsZTIsIF9vcHRpb25zJGxvY2FsZTIkb3B0aSwgX2RlZmF1bHRPcHRpb25zJGxvY2FsLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyLCBfcmVmNSwgX3JlZjYsIF9yZWY3LCBfb3B0aW9ucyR3ZWVrU3RhcnRzT24sIF9vcHRpb25zJGxvY2FsZTMsIF9vcHRpb25zJGxvY2FsZTMkb3B0aSwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMywgX2RlZmF1bHRPcHRpb25zJGxvY2FsNDtcbiAgcmVxdWlyZWRBcmdzKDIsIGFyZ3VtZW50cyk7XG4gIHZhciBmb3JtYXRTdHIgPSBTdHJpbmcoZGlydHlGb3JtYXRTdHIpO1xuICB2YXIgZGVmYXVsdE9wdGlvbnMgPSBnZXREZWZhdWx0T3B0aW9ucygpO1xuICB2YXIgbG9jYWxlID0gKF9yZWYgPSAoX29wdGlvbnMkbG9jYWxlID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmxvY2FsZSkgIT09IG51bGwgJiYgX29wdGlvbnMkbG9jYWxlICE9PSB2b2lkIDAgPyBfb3B0aW9ucyRsb2NhbGUgOiBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpICE9PSBudWxsICYmIF9yZWYgIT09IHZvaWQgMCA/IF9yZWYgOiBkZWZhdWx0TG9jYWxlO1xuICB2YXIgZmlyc3RXZWVrQ29udGFpbnNEYXRlID0gdG9JbnRlZ2VyKChfcmVmMiA9IChfcmVmMyA9IChfcmVmNCA9IChfb3B0aW9ucyRmaXJzdFdlZWtDb24gPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyRmaXJzdFdlZWtDb24gIT09IHZvaWQgMCA/IF9vcHRpb25zJGZpcnN0V2Vla0NvbiA6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZTIgPSBvcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZTIkb3B0aSA9IF9vcHRpb25zJGxvY2FsZTIub3B0aW9ucykgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlMiRvcHRpID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb3B0aW9ucyRsb2NhbGUyJG9wdGkuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmNCAhPT0gdm9pZCAwID8gX3JlZjQgOiBkZWZhdWx0T3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYzICE9PSB2b2lkIDAgPyBfcmVmMyA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPSBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPSBfZGVmYXVsdE9wdGlvbnMkbG9jYWwub3B0aW9ucykgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RlZmF1bHRPcHRpb25zJGxvY2FsMi5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYyICE9PSB2b2lkIDAgPyBfcmVmMiA6IDEpO1xuXG4gIC8vIFRlc3QgaWYgd2Vla1N0YXJ0c09uIGlzIGJldHdlZW4gMSBhbmQgNyBfYW5kXyBpcyBub3QgTmFOXG4gIGlmICghKGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSA+PSAxICYmIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSA8PSA3KSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdmaXJzdFdlZWtDb250YWluc0RhdGUgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDcgaW5jbHVzaXZlbHknKTtcbiAgfVxuICB2YXIgd2Vla1N0YXJ0c09uID0gdG9JbnRlZ2VyKChfcmVmNSA9IChfcmVmNiA9IChfcmVmNyA9IChfb3B0aW9ucyR3ZWVrU3RhcnRzT24gPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyR3ZWVrU3RhcnRzT24gIT09IHZvaWQgMCA/IF9vcHRpb25zJHdlZWtTdGFydHNPbiA6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZTMgPSBvcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlMyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZTMkb3B0aSA9IF9vcHRpb25zJGxvY2FsZTMub3B0aW9ucykgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlMyRvcHRpID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb3B0aW9ucyRsb2NhbGUzJG9wdGkud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmNyAhPT0gdm9pZCAwID8gX3JlZjcgOiBkZWZhdWx0T3B0aW9ucy53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWY2ICE9PSB2b2lkIDAgPyBfcmVmNiA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwzID0gZGVmYXVsdE9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwzID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsNCA9IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDMub3B0aW9ucykgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsNCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RlZmF1bHRPcHRpb25zJGxvY2FsNC53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWY1ICE9PSB2b2lkIDAgPyBfcmVmNSA6IDApO1xuXG4gIC8vIFRlc3QgaWYgd2Vla1N0YXJ0c09uIGlzIGJldHdlZW4gMCBhbmQgNiBfYW5kXyBpcyBub3QgTmFOXG4gIGlmICghKHdlZWtTdGFydHNPbiA+PSAwICYmIHdlZWtTdGFydHNPbiA8PSA2KSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd3ZWVrU3RhcnRzT24gbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDYgaW5jbHVzaXZlbHknKTtcbiAgfVxuICBpZiAoIWxvY2FsZS5sb2NhbGl6ZSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdsb2NhbGUgbXVzdCBjb250YWluIGxvY2FsaXplIHByb3BlcnR5Jyk7XG4gIH1cbiAgaWYgKCFsb2NhbGUuZm9ybWF0TG9uZykge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdsb2NhbGUgbXVzdCBjb250YWluIGZvcm1hdExvbmcgcHJvcGVydHknKTtcbiAgfVxuICB2YXIgb3JpZ2luYWxEYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIGlmICghaXNWYWxpZChvcmlnaW5hbERhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdGltZSB2YWx1ZScpO1xuICB9XG5cbiAgLy8gQ29udmVydCB0aGUgZGF0ZSBpbiBzeXN0ZW0gdGltZXpvbmUgdG8gdGhlIHNhbWUgZGF0ZSBpbiBVVEMrMDA6MDAgdGltZXpvbmUuXG4gIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHdoZW4gVVRDIGZ1bmN0aW9ucyB3aWxsIGJlIGltcGxlbWVudGVkLCBsb2NhbGVzIHdpbGwgYmUgY29tcGF0aWJsZSB3aXRoIHRoZW0uXG4gIC8vIFNlZSBhbiBpc3N1ZSBhYm91dCBVVEMgZnVuY3Rpb25zOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvaXNzdWVzLzM3NlxuICB2YXIgdGltZXpvbmVPZmZzZXQgPSBnZXRUaW1lem9uZU9mZnNldEluTWlsbGlzZWNvbmRzKG9yaWdpbmFsRGF0ZSk7XG4gIHZhciB1dGNEYXRlID0gc3ViTWlsbGlzZWNvbmRzKG9yaWdpbmFsRGF0ZSwgdGltZXpvbmVPZmZzZXQpO1xuICB2YXIgZm9ybWF0dGVyT3B0aW9ucyA9IHtcbiAgICBmaXJzdFdlZWtDb250YWluc0RhdGU6IGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSxcbiAgICB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbixcbiAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICBfb3JpZ2luYWxEYXRlOiBvcmlnaW5hbERhdGVcbiAgfTtcbiAgdmFyIHJlc3VsdCA9IGZvcm1hdFN0ci5tYXRjaChsb25nRm9ybWF0dGluZ1Rva2Vuc1JlZ0V4cCkubWFwKGZ1bmN0aW9uIChzdWJzdHJpbmcpIHtcbiAgICB2YXIgZmlyc3RDaGFyYWN0ZXIgPSBzdWJzdHJpbmdbMF07XG4gICAgaWYgKGZpcnN0Q2hhcmFjdGVyID09PSAncCcgfHwgZmlyc3RDaGFyYWN0ZXIgPT09ICdQJykge1xuICAgICAgdmFyIGxvbmdGb3JtYXR0ZXIgPSBsb25nRm9ybWF0dGVyc1tmaXJzdENoYXJhY3Rlcl07XG4gICAgICByZXR1cm4gbG9uZ0Zvcm1hdHRlcihzdWJzdHJpbmcsIGxvY2FsZS5mb3JtYXRMb25nKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnN0cmluZztcbiAgfSkuam9pbignJykubWF0Y2goZm9ybWF0dGluZ1Rva2Vuc1JlZ0V4cCkubWFwKGZ1bmN0aW9uIChzdWJzdHJpbmcpIHtcbiAgICAvLyBSZXBsYWNlIHR3byBzaW5nbGUgcXVvdGUgY2hhcmFjdGVycyB3aXRoIG9uZSBzaW5nbGUgcXVvdGUgY2hhcmFjdGVyXG4gICAgaWYgKHN1YnN0cmluZyA9PT0gXCInJ1wiKSB7XG4gICAgICByZXR1cm4gXCInXCI7XG4gICAgfVxuICAgIHZhciBmaXJzdENoYXJhY3RlciA9IHN1YnN0cmluZ1swXTtcbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIgPT09IFwiJ1wiKSB7XG4gICAgICByZXR1cm4gY2xlYW5Fc2NhcGVkU3RyaW5nKHN1YnN0cmluZyk7XG4gICAgfVxuICAgIHZhciBmb3JtYXR0ZXIgPSBmb3JtYXR0ZXJzW2ZpcnN0Q2hhcmFjdGVyXTtcbiAgICBpZiAoZm9ybWF0dGVyKSB7XG4gICAgICBpZiAoIShvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLnVzZUFkZGl0aW9uYWxXZWVrWWVhclRva2VucykgJiYgaXNQcm90ZWN0ZWRXZWVrWWVhclRva2VuKHN1YnN0cmluZykpIHtcbiAgICAgICAgdGhyb3dQcm90ZWN0ZWRFcnJvcihzdWJzdHJpbmcsIGRpcnR5Rm9ybWF0U3RyLCBTdHJpbmcoZGlydHlEYXRlKSk7XG4gICAgICB9XG4gICAgICBpZiAoIShvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLnVzZUFkZGl0aW9uYWxEYXlPZlllYXJUb2tlbnMpICYmIGlzUHJvdGVjdGVkRGF5T2ZZZWFyVG9rZW4oc3Vic3RyaW5nKSkge1xuICAgICAgICB0aHJvd1Byb3RlY3RlZEVycm9yKHN1YnN0cmluZywgZGlydHlGb3JtYXRTdHIsIFN0cmluZyhkaXJ0eURhdGUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JtYXR0ZXIodXRjRGF0ZSwgc3Vic3RyaW5nLCBsb2NhbGUubG9jYWxpemUsIGZvcm1hdHRlck9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIubWF0Y2godW5lc2NhcGVkTGF0aW5DaGFyYWN0ZXJSZWdFeHApKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignRm9ybWF0IHN0cmluZyBjb250YWlucyBhbiB1bmVzY2FwZWQgbGF0aW4gYWxwaGFiZXQgY2hhcmFjdGVyIGAnICsgZmlyc3RDaGFyYWN0ZXIgKyAnYCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3Vic3RyaW5nO1xuICB9KS5qb2luKCcnKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNsZWFuRXNjYXBlZFN0cmluZyhpbnB1dCkge1xuICB2YXIgbWF0Y2hlZCA9IGlucHV0Lm1hdGNoKGVzY2FwZWRTdHJpbmdSZWdFeHApO1xuICBpZiAoIW1hdGNoZWQpIHtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZWRbMV0ucmVwbGFjZShkb3VibGVRdW90ZVJlZ0V4cCwgXCInXCIpO1xufSIsImV4cG9ydCBjb25zdCBFeHBvcnRlcnMgPSBbJ2NzdicsICdqc29uJywgJ3htbCddO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBMb2FkZXIsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHNhdmVBcyB9IGZyb20gJ2ZpbGUtc2F2ZXInO1xuaW1wb3J0IGZvcm1hdCBmcm9tICdkYXRlLWZucy9mb3JtYXQnO1xuaW1wb3J0IHsgRXhwb3J0ZXJzIH0gZnJvbSAnLi4vZXhwb3J0ZXIudHlwZS5qcyc7XG5leHBvcnQgY29uc3QgbWltZVR5cGVzID0ge1xuICAgIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBjc3Y6ICd0ZXh0L2NzdicsXG4gICAgeG1sOiAndGV4dC94bWwnLFxufTtcbmV4cG9ydCBjb25zdCBnZXRFeHBvcnRlZEZpbGVOYW1lID0gKGV4dGVuc2lvbikgPT4gYGV4cG9ydC0ke2Zvcm1hdChEYXRlLm5vdygpLCAneXl5eS1NTS1kZF9ISC1tbScpfS4ke2V4dGVuc2lvbn1gO1xuY29uc3QgRXhwb3J0Q29tcG9uZW50ID0gKHsgcmVzb3VyY2UgfSkgPT4ge1xuICAgIGNvbnN0IFtpc0ZldGNoaW5nLCBzZXRGZXRjaGluZ10gPSB1c2VTdGF0ZSgpO1xuICAgIGNvbnN0IHNlbmROb3RpY2UgPSB1c2VOb3RpY2UoKTtcbiAgICBjb25zdCBleHBvcnREYXRhID0gYXN5bmMgKHR5cGUpID0+IHtcbiAgICAgICAgc2V0RmV0Y2hpbmcodHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGE6IHsgZXhwb3J0ZWREYXRhIH0sIH0gPSBhd2FpdCBuZXcgQXBpQ2xpZW50KCkucmVzb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLmlkLFxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdleHBvcnQnLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbZXhwb3J0ZWREYXRhXSwgeyB0eXBlOiBtaW1lVHlwZXNbdHlwZV0gfSk7XG4gICAgICAgICAgICBzYXZlQXMoYmxvYiwgZ2V0RXhwb3J0ZWRGaWxlTmFtZSh0eXBlKSk7XG4gICAgICAgICAgICBzZW5kTm90aWNlKHsgbWVzc2FnZTogJ0V4cG9ydGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc2VuZE5vdGljZSh7IG1lc3NhZ2U6IGUubWVzc2FnZSwgdHlwZTogJ2Vycm9yJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRGZXRjaGluZyhmYWxzZSk7XG4gICAgfTtcbiAgICBpZiAoaXNGZXRjaGluZykge1xuICAgICAgICByZXR1cm4gPExvYWRlciAvPjtcbiAgICB9XG4gICAgcmV0dXJuICg8Qm94PlxuICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCI+XG4gICAgICAgIDxUZXh0IHZhcmlhbnQ9XCJsZ1wiPkNob29zZSBleHBvcnQgZm9ybWF0OjwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCI+XG4gICAgICAgIHtFeHBvcnRlcnMubWFwKHBhcnNlclR5cGUgPT4gKDxCb3gga2V5PXtwYXJzZXJUeXBlfSBtPXsyfT5cbiAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17KCkgPT4gZXhwb3J0RGF0YShwYXJzZXJUeXBlKX0gZGlzYWJsZWQ9e2lzRmV0Y2hpbmd9PlxuICAgICAgICAgICAgICB7cGFyc2VyVHlwZS50b1VwcGVyQ2FzZSgpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Cb3g+KSl9XG4gICAgICA8L0JveD5cbiAgICA8L0JveD4pO1xufTtcbmV4cG9ydCBkZWZhdWx0IEV4cG9ydENvbXBvbmVudDtcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuQWRtaW5KUy5lbnYuTk9ERV9FTlYgPSBcImRldmVsb3BtZW50XCJcbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9EYXNoYm9hcmQvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBMaXN0UmVjb3JkTGlua1Byb3BlcnR5IGZyb20gJy4uL3NyYy9yb3V0ZXMvYWRtaW4vY2xpZW50L2NvbXBvbmVudHMvTGlzdFByb3BlcnR5L0xpc3RSZWNvcmRMaW5rUHJvcGVydHknXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxpc3RSZWNvcmRMaW5rUHJvcGVydHkgPSBMaXN0UmVjb3JkTGlua1Byb3BlcnR5XG5pbXBvcnQgRWRpdFBhc3N3b3JkUHJvcGVydHkgZnJvbSAnLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9FZGl0UHJvcGVydHkvRWRpdFBhc3N3b3JkUHJvcGVydHknXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkVkaXRQYXNzd29yZFByb3BlcnR5ID0gRWRpdFBhc3N3b3JkUHJvcGVydHlcbmltcG9ydCBEaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkgZnJvbSAnLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9EaWZmZXJlbmNlUHJvcGVydHkvRGlmZmVyZW5jZVJlY29yZFByb3BlcnR5J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkgPSBEaWZmZXJlbmNlUmVjb3JkUHJvcGVydHlcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0xvZ2luL0xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luXG5pbXBvcnQgUmVjb3JkRGlmZmVyZW5jZSBmcm9tICcuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZERpZmZlcmVuY2UnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZERpZmZlcmVuY2UgPSBSZWNvcmREaWZmZXJlbmNlXG5pbXBvcnQgUmVjb3JkTGluayBmcm9tICcuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZExpbmsnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZExpbmsgPSBSZWNvcmRMaW5rXG5pbXBvcnQgUGFzc3dvcmRFZGl0Q29tcG9uZW50IGZyb20gJy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9wYXNzd29yZHMvYnVpbGQvY29tcG9uZW50cy9QYXNzd29yZEVkaXRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlBhc3N3b3JkRWRpdENvbXBvbmVudCA9IFBhc3N3b3JkRWRpdENvbXBvbmVudFxuaW1wb3J0IEltcG9ydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvaW1wb3J0LWV4cG9ydC9saWIvY29tcG9uZW50cy9JbXBvcnRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkltcG9ydENvbXBvbmVudCA9IEltcG9ydENvbXBvbmVudFxuaW1wb3J0IEV4cG9ydENvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFkbWluanMvaW1wb3J0LWV4cG9ydC9saWIvY29tcG9uZW50cy9FeHBvcnRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkV4cG9ydENvbXBvbmVudCA9IEV4cG9ydENvbXBvbmVudCJdLCJuYW1lcyI6WyJTdGF0Q2FyZCIsImljb24iLCJsYWJlbCIsInZhbHVlIiwiaWNvbkNvbG9yIiwiZGlzcGxheVZhbHVlIiwidW5kZWZpbmVkIiwiaWNvbkRpc3BsYXlDb2xvciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIlN0eWxlZFN0YXRDYXJkIiwiSWNvbkNpcmNsZSIsIiRjb2xvciIsIkljb24iLCJzaXplIiwiY29sb3IiLCJTdGF0TGFiZWwiLCJTdGF0VmFsdWUiLCJzdHlsZWQiLCJCb3giLCJ0aGVtZSIsImNvbG9ycyIsIndoaXRlIiwiYm9yZGVyIiwiVGV4dCIsInRleHRNdXRlZCIsInByaW1hcnkxMDAiLCJwcmltYXJ5MTAiLCJEYXNoYm9hcmQiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsInVzZVN0YXRlIiwiZXJyb3IiLCJzZXRFcnJvciIsImRhdGEiLCJzZXREYXRhIiwiYXBpIiwiQXBpQ2xpZW50Iiwic2VuZE5vdGljZSIsInVzZU5vdGljZSIsImN1cnJlbnRBZG1pbiIsInVzZUN1cnJlbnRBZG1pbiIsInVzZUVmZmVjdCIsImZldGNoRGFzaGJvYXJkRGF0YSIsInNob3dMb2FkaW5nIiwiZ2V0RGFzaGJvYXJkIiwidGhlbiIsInJlc3BvbnNlIiwiZmV0Y2hlZERhdGEiLCJtZXNzYWdlIiwidHlwZSIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJMb2FkaW5nQ29udGFpbmVyIiwiTG9hZGluZ0NvbnRlbnQiLCJMb2FkaW5nSWNvbiIsInNwaW4iLCJMb2FkaW5nVGV4dCIsIkVycm9yQ29udGFpbmVyIiwiRXJyb3JDb250ZW50IiwiRXJyb3JJY29uIiwiRXJyb3JUaXRsZSIsIkVycm9yTWVzc2FnZSIsIlJldHJ5QnV0dG9uIiwib25DbGljayIsIm1yIiwiRGFzaGJvYXJkQ29udGFpbmVyIiwiSGVhZGVyQm94IiwiR3JlZXRpbmdUZXh0IiwiZW1haWwiLCJTdWJ0aXRsZVRleHQiLCJTdGF0c0dyaWQiLCJhY3RpdmVKb2JzIiwiZmFpbGVkSm9icyIsImNvbXBsZXRlZEpvYnMiLCJwZGZzIiwidG90YWwiLCJwcm9jZXNzZWQiLCJwZW5kaW5nIiwicXVldWUiLCJpdGVtcyIsIkZvb3RlckJveCIsInNtYWxsIiwibGFzdFVwZGF0ZWQiLCJCdXR0b24iLCJ2YXJpYW50IiwiZGlzYWJsZWQiLCJ0ZXh0IiwiZXJyb3JMaWdodCIsImdldExvZ1Byb3BlcnR5TmFtZSIsInByb3BlcnR5IiwibWFwcGluZyIsInZpZXdIZWxwZXJzIiwiVmlld0hlbHBlcnMiLCJMaXN0UmVjb3JkTGlua1Byb3BlcnR5IiwicmVjb3JkIiwicGFyYW1zIiwiY3VzdG9tIiwicHJvcGVydGllc01hcHBpbmciLCJyZWNvcmRJZFBhcmFtIiwicmVzb3VyY2VJZFBhcmFtIiwicmVjb3JkVGl0bGVQYXJhbSIsInJlY29yZElkIiwicmVzb3VyY2UiLCJyZWNvcmRUaXRsZSIsIkZvcm1Hcm91cCIsIkxpbmsiLCJocmVmIiwicmVjb3JkQWN0aW9uVXJsIiwiYWN0aW9uTmFtZSIsInJlc291cmNlSWQiLCJFZGl0UGFzc3dvcmRQcm9wZXJ0eSIsInByb3BzIiwib25DaGFuZ2UiLCJ0cmFuc2xhdGVCdXR0b24iLCJ0YiIsInVzZVRyYW5zbGF0aW9uIiwic2hvd1Bhc3N3b3JkIiwidG9nZ2xlUGFzc3dvcmQiLCJuYW1lIiwiaWQiLCJCYXNlUHJvcGVydHlDb21wb25lbnQiLCJQYXNzd29yZCIsIkVkaXQiLCJtYiIsInRleHRBbGlnbiIsIkNlbGwiLCJUYWJsZUNlbGwiLCJSb3ciLCJUYWJsZVJvdyIsIkhlYWQiLCJUYWJsZUhlYWQiLCJUYWJsZSIsIkFkbWluVGFibGUiLCJEaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkiLCJ1bmZsYXR0ZW5lZFBhcmFtcyIsImZsYXQiLCJ1bmZsYXR0ZW4iLCJkaWZmZXJlbmNlcyIsIkxhYmVsIiwiVGFibGVCb2R5IiwiZW50cmllcyIsIm1hcCIsInByb3BlcnR5TmFtZSIsImJlZm9yZSIsImFmdGVyIiwia2V5Iiwid2lkdGgiLCJKU09OIiwic3RyaW5naWZ5IiwiTG9naW4iLCJhY3Rpb24iLCJzZXRFbWFpbCIsInBhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJpc0VtYWlsRm9jdXNlZCIsInNldElzRW1haWxGb2N1c2VkIiwiaXNQYXNzd29yZEZvY3VzZWQiLCJzZXRJc1Bhc3N3b3JkRm9jdXNlZCIsImZvcm1BY3Rpb24iLCJMb2dpbkNvbnRhaW5lciIsIkJhY2tncm91bmRQYXR0ZXJuIiwiV3JhcHBlckJveCIsIkxvZ2luQ2FyZCIsIkxvZ29Db250YWluZXIiLCJMb2dvSWNvbiIsIlN0eWxlZEgyIiwibWV0aG9kIiwiU3R5bGVkTGFiZWwiLCJodG1sRm9yIiwiYWN0aXZlIiwiU3R5bGVkSW5wdXQiLCJlIiwidGFyZ2V0Iiwib25Gb2N1cyIsIm9uQmx1ciIsInJlcXVpcmVkIiwiQnV0dG9uc0NvbnRhaW5lciIsIkxvZ2luQnV0dG9uIiwiYXMiLCJGb3Jnb3RQYXNzd29yZExpbmsiLCJGb290ZXIiLCJTZWN1cml0eVRleHQiLCJwdWxzZSIsImtleWZyYW1lcyIsImRpdiIsImlzSG92ZXJpbmciLCJIMiIsIklucHV0IiwiYSIsIlJlY29yZERpZmZlcmVuY2UiLCJwYXJzZSIsIlJlY29yZExpbmsiLCJQYXNzd29yZEVkaXQiLCJJbXBvcnRDb21wb25lbnQiLCJmaWxlIiwic2V0RmlsZSIsImlzRmV0Y2hpbmciLCJzZXRGZXRjaGluZyIsIm9uVXBsb2FkIiwidXBsb2FkZWRGaWxlIiwib25TdWJtaXQiLCJpbXBvcnREYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNvdXJjZUFjdGlvbiIsIkxvYWRlciIsIm1hcmdpbiIsIm1heFdpZHRoIiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwiZmxleERpcmVjdGlvbiIsIkRyb3Bab25lIiwiZmlsZXMiLCJtdWx0aXBsZSIsIkRyb3Bab25lSXRlbSIsImZpbGVuYW1lIiwib25SZW1vdmUiLCJtIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwicmVxdWlyZWRBcmdzIiwiYXJncyIsIlR5cGVFcnJvciIsImlzRGF0ZSIsImFyZ3VtZW50cyIsIkRhdGUiLCJ0b1N0cmluZyIsImNhbGwiLCJ0b0RhdGUiLCJhcmd1bWVudCIsImFyZ1N0ciIsImdldFRpbWUiLCJ3YXJuIiwiRXJyb3IiLCJzdGFjayIsIk5hTiIsImlzVmFsaWQiLCJkaXJ0eURhdGUiLCJkYXRlIiwiaXNOYU4iLCJOdW1iZXIiLCJ0b0ludGVnZXIiLCJkaXJ0eU51bWJlciIsIm51bWJlciIsIk1hdGgiLCJjZWlsIiwiZmxvb3IiLCJhZGRNaWxsaXNlY29uZHMiLCJkaXJ0eUFtb3VudCIsInRpbWVzdGFtcCIsImFtb3VudCIsInN1Yk1pbGxpc2Vjb25kcyIsIk1JTExJU0VDT05EU19JTl9EQVkiLCJnZXRVVENEYXlPZlllYXIiLCJzZXRVVENNb250aCIsInNldFVUQ0hvdXJzIiwic3RhcnRPZlllYXJUaW1lc3RhbXAiLCJkaWZmZXJlbmNlIiwic3RhcnRPZlVUQ0lTT1dlZWsiLCJ3ZWVrU3RhcnRzT24iLCJkYXkiLCJnZXRVVENEYXkiLCJkaWZmIiwic2V0VVRDRGF0ZSIsImdldFVUQ0RhdGUiLCJnZXRVVENJU09XZWVrWWVhciIsInllYXIiLCJnZXRVVENGdWxsWWVhciIsImZvdXJ0aE9mSmFudWFyeU9mTmV4dFllYXIiLCJzZXRVVENGdWxsWWVhciIsInN0YXJ0T2ZOZXh0WWVhciIsImZvdXJ0aE9mSmFudWFyeU9mVGhpc1llYXIiLCJzdGFydE9mVGhpc1llYXIiLCJzdGFydE9mVVRDSVNPV2Vla1llYXIiLCJmb3VydGhPZkphbnVhcnkiLCJNSUxMSVNFQ09ORFNfSU5fV0VFSyIsImdldFVUQ0lTT1dlZWsiLCJyb3VuZCIsImRlZmF1bHRPcHRpb25zIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJzdGFydE9mVVRDV2VlayIsIm9wdGlvbnMiLCJfcmVmIiwiX3JlZjIiLCJfcmVmMyIsIl9vcHRpb25zJHdlZWtTdGFydHNPbiIsIl9vcHRpb25zJGxvY2FsZSIsIl9vcHRpb25zJGxvY2FsZSRvcHRpbyIsIl9kZWZhdWx0T3B0aW9ucyRsb2NhbCIsIl9kZWZhdWx0T3B0aW9ucyRsb2NhbDIiLCJsb2NhbGUiLCJSYW5nZUVycm9yIiwiZ2V0VVRDV2Vla1llYXIiLCJfb3B0aW9ucyRmaXJzdFdlZWtDb24iLCJmaXJzdFdlZWtDb250YWluc0RhdGUiLCJmaXJzdFdlZWtPZk5leHRZZWFyIiwiZmlyc3RXZWVrT2ZUaGlzWWVhciIsInN0YXJ0T2ZVVENXZWVrWWVhciIsImZpcnN0V2VlayIsImdldFVUQ1dlZWsiLCJhZGRMZWFkaW5nWmVyb3MiLCJ0YXJnZXRMZW5ndGgiLCJzaWduIiwib3V0cHV0IiwiYWJzIiwiZm9ybWF0dGVycyIsInkiLCJ0b2tlbiIsInNpZ25lZFllYXIiLCJNIiwibW9udGgiLCJnZXRVVENNb250aCIsIlN0cmluZyIsImQiLCJkYXlQZXJpb2RFbnVtVmFsdWUiLCJnZXRVVENIb3VycyIsInRvVXBwZXJDYXNlIiwiaCIsIkgiLCJnZXRVVENNaW51dGVzIiwicyIsImdldFVUQ1NlY29uZHMiLCJTIiwibnVtYmVyT2ZEaWdpdHMiLCJtaWxsaXNlY29uZHMiLCJnZXRVVENNaWxsaXNlY29uZHMiLCJmcmFjdGlvbmFsU2Vjb25kcyIsInBvdyIsImRheVBlcmlvZEVudW0iLCJhbSIsIm1pZG5pZ2h0Iiwibm9vbiIsIm1vcm5pbmciLCJhZnRlcm5vb24iLCJldmVuaW5nIiwibmlnaHQiLCJHIiwibG9jYWxpemUiLCJlcmEiLCJvcmRpbmFsTnVtYmVyIiwidW5pdCIsImxpZ2h0Rm9ybWF0dGVycyIsIlkiLCJzaWduZWRXZWVrWWVhciIsIndlZWtZZWFyIiwidHdvRGlnaXRZZWFyIiwiUiIsImlzb1dlZWtZZWFyIiwidSIsIlEiLCJxdWFydGVyIiwiY29udGV4dCIsInEiLCJMIiwidyIsIndlZWsiLCJJIiwiaXNvV2VlayIsIkQiLCJkYXlPZlllYXIiLCJFIiwiZGF5T2ZXZWVrIiwibG9jYWxEYXlPZldlZWsiLCJjIiwiaSIsImlzb0RheU9mV2VlayIsImhvdXJzIiwiZGF5UGVyaW9kIiwidG9Mb3dlckNhc2UiLCJiIiwiQiIsIksiLCJrIiwiWCIsIl9sb2NhbGl6ZSIsIm9yaWdpbmFsRGF0ZSIsIl9vcmlnaW5hbERhdGUiLCJ0aW1lem9uZU9mZnNldCIsImdldFRpbWV6b25lT2Zmc2V0IiwiZm9ybWF0VGltZXpvbmVXaXRoT3B0aW9uYWxNaW51dGVzIiwiZm9ybWF0VGltZXpvbmUiLCJ4IiwiTyIsImZvcm1hdFRpbWV6b25lU2hvcnQiLCJ6IiwidCIsIlQiLCJvZmZzZXQiLCJkaXJ0eURlbGltaXRlciIsImFic09mZnNldCIsIm1pbnV0ZXMiLCJkZWxpbWl0ZXIiLCJkYXRlTG9uZ0Zvcm1hdHRlciIsInBhdHRlcm4iLCJmb3JtYXRMb25nIiwidGltZUxvbmdGb3JtYXR0ZXIiLCJ0aW1lIiwiZGF0ZVRpbWVMb25nRm9ybWF0dGVyIiwibWF0Y2hSZXN1bHQiLCJtYXRjaCIsImRhdGVQYXR0ZXJuIiwidGltZVBhdHRlcm4iLCJkYXRlVGltZUZvcm1hdCIsImRhdGVUaW1lIiwicmVwbGFjZSIsImxvbmdGb3JtYXR0ZXJzIiwicCIsIlAiLCJnZXRUaW1lem9uZU9mZnNldEluTWlsbGlzZWNvbmRzIiwidXRjRGF0ZSIsIlVUQyIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsImdldE1pbGxpc2Vjb25kcyIsInByb3RlY3RlZERheU9mWWVhclRva2VucyIsInByb3RlY3RlZFdlZWtZZWFyVG9rZW5zIiwiaXNQcm90ZWN0ZWREYXlPZlllYXJUb2tlbiIsImluZGV4T2YiLCJpc1Byb3RlY3RlZFdlZWtZZWFyVG9rZW4iLCJ0aHJvd1Byb3RlY3RlZEVycm9yIiwiZm9ybWF0IiwiaW5wdXQiLCJjb25jYXQiLCJmb3JtYXREaXN0YW5jZUxvY2FsZSIsImxlc3NUaGFuWFNlY29uZHMiLCJvbmUiLCJvdGhlciIsInhTZWNvbmRzIiwiaGFsZkFNaW51dGUiLCJsZXNzVGhhblhNaW51dGVzIiwieE1pbnV0ZXMiLCJhYm91dFhIb3VycyIsInhIb3VycyIsInhEYXlzIiwiYWJvdXRYV2Vla3MiLCJ4V2Vla3MiLCJhYm91dFhNb250aHMiLCJ4TW9udGhzIiwiYWJvdXRYWWVhcnMiLCJ4WWVhcnMiLCJvdmVyWFllYXJzIiwiYWxtb3N0WFllYXJzIiwiZm9ybWF0RGlzdGFuY2UiLCJjb3VudCIsInJlc3VsdCIsInRva2VuVmFsdWUiLCJhZGRTdWZmaXgiLCJjb21wYXJpc29uIiwiYnVpbGRGb3JtYXRMb25nRm4iLCJkZWZhdWx0V2lkdGgiLCJmb3JtYXRzIiwiZGF0ZUZvcm1hdHMiLCJmdWxsIiwibG9uZyIsIm1lZGl1bSIsInNob3J0IiwidGltZUZvcm1hdHMiLCJkYXRlVGltZUZvcm1hdHMiLCJmb3JtYXRSZWxhdGl2ZUxvY2FsZSIsImxhc3RXZWVrIiwieWVzdGVyZGF5IiwidG9kYXkiLCJ0b21vcnJvdyIsIm5leHRXZWVrIiwiZm9ybWF0UmVsYXRpdmUiLCJfZGF0ZSIsIl9iYXNlRGF0ZSIsIl9vcHRpb25zIiwiYnVpbGRMb2NhbGl6ZUZuIiwiZGlydHlJbmRleCIsInZhbHVlc0FycmF5IiwiZm9ybWF0dGluZ1ZhbHVlcyIsImRlZmF1bHRGb3JtYXR0aW5nV2lkdGgiLCJfZGVmYXVsdFdpZHRoIiwiX3dpZHRoIiwidmFsdWVzIiwiaW5kZXgiLCJhcmd1bWVudENhbGxiYWNrIiwiZXJhVmFsdWVzIiwibmFycm93IiwiYWJicmV2aWF0ZWQiLCJ3aWRlIiwicXVhcnRlclZhbHVlcyIsIm1vbnRoVmFsdWVzIiwiZGF5VmFsdWVzIiwiZGF5UGVyaW9kVmFsdWVzIiwicG0iLCJmb3JtYXR0aW5nRGF5UGVyaW9kVmFsdWVzIiwicmVtMTAwIiwiYnVpbGRNYXRjaEZuIiwic3RyaW5nIiwibWF0Y2hQYXR0ZXJuIiwibWF0Y2hQYXR0ZXJucyIsImRlZmF1bHRNYXRjaFdpZHRoIiwibWF0Y2hlZFN0cmluZyIsInBhcnNlUGF0dGVybnMiLCJkZWZhdWx0UGFyc2VXaWR0aCIsIkFycmF5IiwiaXNBcnJheSIsImZpbmRJbmRleCIsInRlc3QiLCJmaW5kS2V5IiwidmFsdWVDYWxsYmFjayIsInJlc3QiLCJzbGljZSIsIm9iamVjdCIsInByZWRpY2F0ZSIsImhhc093blByb3BlcnR5IiwiYXJyYXkiLCJidWlsZE1hdGNoUGF0dGVybkZuIiwicGFyc2VSZXN1bHQiLCJwYXJzZVBhdHRlcm4iLCJtYXRjaE9yZGluYWxOdW1iZXJQYXR0ZXJuIiwicGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiIsIm1hdGNoRXJhUGF0dGVybnMiLCJwYXJzZUVyYVBhdHRlcm5zIiwiYW55IiwibWF0Y2hRdWFydGVyUGF0dGVybnMiLCJwYXJzZVF1YXJ0ZXJQYXR0ZXJucyIsIm1hdGNoTW9udGhQYXR0ZXJucyIsInBhcnNlTW9udGhQYXR0ZXJucyIsIm1hdGNoRGF5UGF0dGVybnMiLCJwYXJzZURheVBhdHRlcm5zIiwibWF0Y2hEYXlQZXJpb2RQYXR0ZXJucyIsInBhcnNlRGF5UGVyaW9kUGF0dGVybnMiLCJwYXJzZUludCIsImNvZGUiLCJmb3JtYXR0aW5nVG9rZW5zUmVnRXhwIiwibG9uZ0Zvcm1hdHRpbmdUb2tlbnNSZWdFeHAiLCJlc2NhcGVkU3RyaW5nUmVnRXhwIiwiZG91YmxlUXVvdGVSZWdFeHAiLCJ1bmVzY2FwZWRMYXRpbkNoYXJhY3RlclJlZ0V4cCIsImRpcnR5Rm9ybWF0U3RyIiwiX3JlZjQiLCJfcmVmNSIsIl9yZWY2IiwiX3JlZjciLCJfZGVmYXVsdE9wdGlvbnMkbG9jYWwzIiwiX2RlZmF1bHRPcHRpb25zJGxvY2FsNCIsImZvcm1hdFN0ciIsImRlZmF1bHRMb2NhbGUiLCJmb3JtYXR0ZXJPcHRpb25zIiwic3Vic3RyaW5nIiwiZmlyc3RDaGFyYWN0ZXIiLCJsb25nRm9ybWF0dGVyIiwiam9pbiIsImNsZWFuRXNjYXBlZFN0cmluZyIsImZvcm1hdHRlciIsIm1hdGNoZWQiLCJFeHBvcnRlcnMiLCJtaW1lVHlwZXMiLCJqc29uIiwiY3N2IiwieG1sIiwiZ2V0RXhwb3J0ZWRGaWxlTmFtZSIsImV4dGVuc2lvbiIsIm5vdyIsIkV4cG9ydENvbXBvbmVudCIsImV4cG9ydERhdGEiLCJleHBvcnRlZERhdGEiLCJibG9iIiwiQmxvYiIsInNhdmVBcyIsInBhcnNlclR5cGUiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJlbnYiLCJOT0RFX0VOViIsIlBhc3N3b3JkRWRpdENvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUtBLE1BQU1BLFFBQWlDLEdBQUdBLENBQUM7SUFDekNDLElBQUk7SUFDSkMsS0FBSztJQUNMQyxLQUFLO0VBQ0xDLEVBQUFBO0VBQ0YsQ0FBQyxLQUFLO0VBQ0osRUFBQSxNQUFNQyxZQUFZLEdBQ2hCRixLQUFLLEtBQUtHLFNBQVMsSUFBSUgsS0FBSyxL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RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7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YyxvQkFBb0IsR0FBR0Esb0JBQW9CO0VBRWxFOGMsT0FBTyxDQUFDQyxjQUFjLENBQUN4Yix3QkFBd0IsR0FBR0Esd0JBQXdCO0VBRTFFdWIsT0FBTyxDQUFDQyxjQUFjLENBQUN4YSxLQUFLLEdBQUdBLEtBQUs7RUFFcEN1YSxPQUFPLENBQUNDLGNBQWMsQ0FBQ2hZLGdCQUFnQixHQUFHQSxnQkFBZ0I7RUFFMUQrWCxPQUFPLENBQUNDLGNBQWMsQ0FBQzlYLFVBQVUsR0FBR0EsVUFBVTtFQUU5QzZYLE9BQU8sQ0FBQ0MsY0FBYyxDQUFDRyxxQkFBcUIsR0FBR0EsWUFBcUI7RUFFcEVKLE9BQU8sQ0FBQ0MsY0FBYyxDQUFDNVgsZUFBZSxHQUFHQSxlQUFlO0VBRXhEMlgsT0FBTyxDQUFDQyxjQUFjLENBQUNSLGVBQWUsR0FBR0EsZUFBZTs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOls2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDQyLDQzLDQ0LDQ1LDQ2LDQ3XX0=
