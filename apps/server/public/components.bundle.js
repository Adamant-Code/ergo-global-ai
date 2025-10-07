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

  const getLogPropertyName = (property, mapping = {}) => {
    if (!mapping[property]) {
      return property;
    }
    return mapping[property];
  };
  const viewHelpers = new adminjs.ViewHelpers();
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
    const recordIdParam = getLogPropertyName("recordId", propertiesMapping);
    const resourceIdParam = getLogPropertyName("resource", propertiesMapping);
    const recordTitleParam = getLogPropertyName("recordTitle", propertiesMapping);
    const recordId = record.params[recordIdParam];
    const resource = record.params[resourceIdParam];
    const recordTitle = record.params[recordTitleParam];
    if (!recordId || !resource) {
      return null;
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Link, {
      href: viewHelpers.recordActionUrl({
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
  const DifferenceRecordProperty = ({
    record,
    property
  }) => {
    // Get the unflattened version of the entire record
    const unflattenedParams = adminjs.flat.unflatten(record?.params ?? {});
    const differences = unflattenedParams?.[property.name];
    if (!differences || typeof differences !== "object") return null;
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
      }, JSON.stringify(before) || "undefined"), /*#__PURE__*/React__default.default.createElement(Cell, {
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

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.ListRecordLinkProperty = ListRecordLinkProperty;
  AdminJS.UserComponents.EditPasswordProperty = EditPasswordProperty;
  AdminJS.UserComponents.DifferenceRecordProperty = DifferenceRecordProperty;
  AdminJS.UserComponents.Login = Login;

})(AdminJSDesignSystem, React, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0Rhc2hib2FyZC9TdGF0Q2FyZC50c3giLCIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0Rhc2hib2FyZC9EYXNoYm9hcmQudHN4IiwiLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9MaXN0UHJvcGVydHkvTGlzdFJlY29yZExpbmtQcm9wZXJ0eS50c3giLCIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0VkaXRQcm9wZXJ0eS9FZGl0UGFzc3dvcmRQcm9wZXJ0eS50c3giLCIuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0RpZmZlcmVuY2VQcm9wZXJ0eS9EaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkudHN4IiwiLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9Mb2dpbi9Mb2dpbi50c3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBCb3gsIFRleHQsIEljb24gfSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbVwiO1xuaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSBcIkBhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHNcIjtcbmltcG9ydCB7IFN0YXRDYXJkUHJvcHMgfSBmcm9tIFwiLi4vLi4vdHlwZXMvZGFzaGJvYXJkL2luZGV4LmpzXCI7XG5cbmNvbnN0IFN0YXRDYXJkOiBSZWFjdC5GQzxTdGF0Q2FyZFByb3BzPiA9ICh7XG4gIGljb24sXG4gIGxhYmVsLFxuICB2YWx1ZSxcbiAgaWNvbkNvbG9yLFxufSkgPT4ge1xuICBjb25zdCBkaXNwbGF5VmFsdWUgPVxuICAgIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgPyBcIi1cIiA6IHZhbHVlO1xuICBjb25zdCBpY29uRGlzcGxheUNvbG9yID0gaWNvbkNvbG9yIHx8IFwicHJpbWFyeTEwMFwiO1xuXG4gIHJldHVybiAoXG4gICAgPFN0eWxlZFN0YXRDYXJkPlxuICAgICAgPEljb25DaXJjbGUgJGNvbG9yPXtpY29uQ29sb3J9PlxuICAgICAgICA8SWNvblxuICAgICAgICAgIGljb249e2ljb259XG4gICAgICAgICAgc2l6ZT17Mjh9XG4gICAgICAgICAgY29sb3I9e2ljb25EaXNwbGF5Q29sb3J9XG4gICAgICAgIC8+XG4gICAgICA8L0ljb25DaXJjbGU+XG4gICAgICA8U3RhdExhYmVsPntsYWJlbH08L1N0YXRMYWJlbD5cbiAgICAgIDxTdGF0VmFsdWU+e2Rpc3BsYXlWYWx1ZX08L1N0YXRWYWx1ZT5cbiAgICA8L1N0eWxlZFN0YXRDYXJkPlxuICApO1xufTtcblxuY29uc3QgU3R5bGVkU3RhdENhcmQgPSBzdHlsZWQoQm94KWBcbiAgYmFja2dyb3VuZDogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMud2hpdGV9O1xuICBwYWRkaW5nOiAxLjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMDMpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiAwLjc1cmVtO1xuICBib3JkZXI6IDFweCBzb2xpZCAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5ib3JkZXJ9O1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBlYXNlLWluLW91dCwgYm94LXNoYWRvdyAwLjJzIGVhc2UtaW4tb3V0O1xuICB3aWR0aDogMTAwJTtcblxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XG4gICAgYm94LXNoYWRvdzogMCA0cHggMTZweCByZ2JhKDAsIDAsIDAsIDAuMDgpO1xuICB9XG5gO1xuXG5jb25zdCBTdGF0TGFiZWwgPSBzdHlsZWQoVGV4dClgXG4gIGZvbnQtc2l6ZTogMC45cmVtO1xuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMudGV4dE11dGVkfTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDVlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbmA7XG5cbmNvbnN0IFN0YXRWYWx1ZSA9IHN0eWxlZChUZXh0KWBcbiAgZm9udC1zaXplOiAycmVtO1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMucHJpbWFyeTEwMH07XG5gO1xuXG5jb25zdCBJY29uQ2lyY2xlID0gc3R5bGVkKEJveCk8eyAkY29sb3I/OiBzdHJpbmcgfT5gXG4gIHdpZHRoOiA0OHB4O1xuICBoZWlnaHQ6IDQ4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZDogJHsoeyAkY29sb3IsIHRoZW1lIH0pID0+XG4gICAgJGNvbG9yID8gYCR7JGNvbG9yfTFBYCA6IHRoZW1lLmNvbG9ycy5wcmltYXJ5MTB9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgU3RhdENhcmQ7XG4iLCIvLyBpbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBCb3gsIFRleHQsIEljb24sIEJ1dHRvbiB9IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtXCI7XG5pbXBvcnQgU3RhdENhcmQgZnJvbSBcIi4vU3RhdENhcmQuanNcIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBEYXNoYm9hcmREYXRhIH0gZnJvbSBcIi4uLy4uL3R5cGVzL2Rhc2hib2FyZC9pbmRleC5qc1wiO1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VDdXJyZW50QWRtaW4sIHVzZU5vdGljZSB9IGZyb20gXCJhZG1pbmpzXCI7XG5pbXBvcnQgeyBzdHlsZWQgfSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50c1wiO1xuXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZTxQYXJ0aWFsPERhc2hib2FyZERhdGE+Pih7fSk7XG5cbiAgLy8gQXBpQ2xpZW50IGlzIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgQWRtaW5KUyBiYWNrZW5kIHJvdXRlcyxcbiAgLy8gaW5jbHVkaW5nIHRoZSBjdXN0b20gZGFzaGJvYXJkIGhhbmRsZXJcbiAgY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpO1xuICBjb25zdCBzZW5kTm90aWNlID0gdXNlTm90aWNlKCk7XG4gIGNvbnN0IFtjdXJyZW50QWRtaW5dID0gdXNlQ3VycmVudEFkbWluKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBmZXRjaERhc2hib2FyZERhdGEoKTtcbiAgfSwgW10pO1xuXG4gIC8qKlxuICAgKiBGZXRjaGVzIGRhc2hib2FyZCBkYXRhIGZyb20gdGhlIGN1c3RvbSBkYXNoYm9hcmQgaGFuZGxlclxuICAgKi9cbiAgY29uc3QgZmV0Y2hEYXNoYm9hcmREYXRhID0gKHNob3dMb2FkaW5nID0gdHJ1ZSkgPT4ge1xuICAgIGlmIChzaG93TG9hZGluZykgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBzZXRFcnJvcihudWxsKTtcblxuICAgIGFwaVxuICAgICAgLmdldERhc2hib2FyZCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3QgZmV0Y2hlZERhdGEgPSByZXNwb25zZS5kYXRhIGFzIERhc2hib2FyZERhdGE7XG4gICAgICAgIGlmIChmZXRjaGVkRGF0YS5lcnJvcikge1xuICAgICAgICAgIHNldEVycm9yKGZldGNoZWREYXRhLmVycm9yKTtcbiAgICAgICAgICBzZW5kTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZldGNoZWREYXRhLmVycm9yLFxuICAgICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldERhdGEoZmV0Y2hlZERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBkYXNoYm9hcmQgZGF0YTpcIiwgZXJyKTtcbiAgICAgICAgc2V0RXJyb3IoXG4gICAgICAgICAgXCJGYWlsZWQgdG8gbG9hZCBkYXNoYm9hcmQgZGF0YSBkdWUgdG8gYSBuZXR3b3JrIG9yIHNlcnZlciBpc3N1ZS5cIlxuICAgICAgICApO1xuICAgICAgICBzZW5kTm90aWNlKHtcbiAgICAgICAgICBtZXNzYWdlOiBcIkZhaWxlZCB0byBsb2FkIGRhc2hib2FyZCBkYXRhLlwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgLy8gTm90ZSB0aGF0IHlvdSBjYW4gYWxzbyB1c2UgYXhpb3MgZGlyZWN0bHlcbiAgLy8gaWYgeW91IG5lZWQgdG8gZmV0Y2ggZGF0YSBvciBzZW5kIGRhdGEgdG8gb3RoZXIgZW5kcG9pbnRzXG4gIC8vIGJhc2VkIG9uIHVzZXIgaW50ZXJhY3Rpb25zIHdpdGhpbiB0aGUgZGFzaGJvYXJkLlxuICAvLyBjb25zdCBoYW5kbGVyRmV0Y2hEYXRhID0gYXN5bmMgKCkgPT4ge1xuICAvLyAgIHRyeSB7XG4gIC8vICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCgnL3lvdXItY3VzdG9tLWFwaS1lbmRwb2ludCcpO1xuICAvLyAgICAgY29uc29sZS5sb2coJ0RhdGEgZnJvbSBjdXN0b20gZW5kcG9pbnQ6JywgcmVzcG9uc2UuZGF0YSk7XG4gIC8vICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGZyb20gY3VzdG9tIGVuZHBvaW50OicsIGVycm9yKTtcbiAgLy8gICB9XG4gIC8vIH07XG5cbiAgaWYgKGxvYWRpbmcgJiYgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiAoXG4gICAgICA8TG9hZGluZ0NvbnRhaW5lcj5cbiAgICAgICAgPExvYWRpbmdDb250ZW50PlxuICAgICAgICAgIDxMb2FkaW5nSWNvblxuICAgICAgICAgICAgaWNvbj1cIkxvYWRlclwiXG4gICAgICAgICAgICBzcGluXG4gICAgICAgICAgICBzaXplPXszMn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxMb2FkaW5nVGV4dD5Mb2FkaW5nIGRhc2hib2FyZCBkYXRhLi4uPC9Mb2FkaW5nVGV4dD5cbiAgICAgICAgPC9Mb2FkaW5nQ29udGVudD5cbiAgICAgIDwvTG9hZGluZ0NvbnRhaW5lcj5cbiAgICApO1xuXG4gIGlmIChlcnJvcilcbiAgICByZXR1cm4gKFxuICAgICAgPEVycm9yQ29udGFpbmVyPlxuICAgICAgICA8RXJyb3JDb250ZW50PlxuICAgICAgICAgIDxFcnJvckljb25cbiAgICAgICAgICAgIGljb249XCJBbGVydENpcmNsZVwiXG4gICAgICAgICAgICBzaXplPXs0MH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxFcnJvclRpdGxlPlNvbWV0aGluZyB3ZW50IHdyb25nPC9FcnJvclRpdGxlPlxuICAgICAgICAgIDxFcnJvck1lc3NhZ2U+e2Vycm9yfTwvRXJyb3JNZXNzYWdlPlxuICAgICAgICAgIDxSZXRyeUJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBmZXRjaERhc2hib2FyZERhdGEoKX0+XG4gICAgICAgICAgICA8SWNvblxuICAgICAgICAgICAgICBpY29uPVwiUmVmcmVzaEN3XCJcbiAgICAgICAgICAgICAgbXI9XCJzbVwiXG4gICAgICAgICAgICAvPntcIiBcIn1cbiAgICAgICAgICAgIFRyeSBBZ2FpblxuICAgICAgICAgIDwvUmV0cnlCdXR0b24+XG4gICAgICAgIDwvRXJyb3JDb250ZW50PlxuICAgICAgPC9FcnJvckNvbnRhaW5lcj5cbiAgICApO1xuXG4gIHJldHVybiAoXG4gICAgPERhc2hib2FyZENvbnRhaW5lcj5cbiAgICAgIDxIZWFkZXJCb3g+XG4gICAgICAgIDxHcmVldGluZ1RleHQ+XG4gICAgICAgICAge2RhdGEubWVzc2FnZSB8fFxuICAgICAgICAgICAgYFdlbGNvbWUsICR7Y3VycmVudEFkbWluPy5lbWFpbCB8fCBcIkFkbWluXCJ9IWB9XG4gICAgICAgIDwvR3JlZXRpbmdUZXh0PlxuICAgICAgICA8U3VidGl0bGVUZXh0PlxuICAgICAgICAgIE92ZXJ2aWV3IG9mIHlvdXIgYXBwbGljYXRpb24ncyBrZXkgZHVtbXkgbWV0cmljcy5cbiAgICAgICAgPC9TdWJ0aXRsZVRleHQ+XG4gICAgICA8L0hlYWRlckJveD5cblxuICAgICAgPFN0YXRzR3JpZD5cbiAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgbGFiZWw9XCJBY3RpdmUgSm9ic1wiXG4gICAgICAgICAgdmFsdWU9e2RhdGEuYWN0aXZlSm9ic31cbiAgICAgICAgICBpY29uPVwiWmFwXCJcbiAgICAgICAgICBpY29uQ29sb3I9e1xuICAgICAgICAgICAgZGF0YS5hY3RpdmVKb2JzICYmIGRhdGEuYWN0aXZlSm9icyA+IDBcbiAgICAgICAgICAgICAgPyBcIiMwMDdiZmZcIlxuICAgICAgICAgICAgICA6IFwiIzZjNzU3ZFwiXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICBsYWJlbD1cIkZhaWxlZCBKb2JzXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5mYWlsZWRKb2JzfVxuICAgICAgICAgIGljb249XCJBbGVydFRyaWFuZ2xlXCJcbiAgICAgICAgICBpY29uQ29sb3I9e1xuICAgICAgICAgICAgZGF0YS5mYWlsZWRKb2JzICYmIGRhdGEuZmFpbGVkSm9icyA+IDBcbiAgICAgICAgICAgICAgPyBcIiNkYzM1NDVcIlxuICAgICAgICAgICAgICA6IFwiIzZjNzU3ZFwiXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICBsYWJlbD1cIkNvbXBsZXRlZCBKb2JzXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5jb21wbGV0ZWRKb2JzfVxuICAgICAgICAgIGljb249XCJDaGVja0NpcmNsZVwiXG4gICAgICAgICAgaWNvbkNvbG9yPVwiIzI4YTc0NVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgIGxhYmVsPVwiVG90YWwgUERGc1wiXG4gICAgICAgICAgdmFsdWU9e2RhdGEucGRmcz8udG90YWx9XG4gICAgICAgICAgaWNvbj1cIkZpbGVUZXh0XCJcbiAgICAgICAgICBpY29uQ29sb3I9XCIjMTdhMmI4XCJcbiAgICAgICAgLz5cbiAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgbGFiZWw9XCJQREZzIFByb2Nlc3NlZFwiXG4gICAgICAgICAgdmFsdWU9e2RhdGEucGRmcz8ucHJvY2Vzc2VkfVxuICAgICAgICAgIGljb249XCJDaGVja1NxdWFyZVwiXG4gICAgICAgICAgaWNvbkNvbG9yPVwiIzI4YTc0NVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgIGxhYmVsPVwiUERGcyBQZW5kaW5nXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5wZGZzPy5wZW5kaW5nfVxuICAgICAgICAgIGljb249XCJDbG9ja1wiXG4gICAgICAgICAgaWNvbkNvbG9yPXtcbiAgICAgICAgICAgIGRhdGEucGRmcz8ucGVuZGluZyAmJiBkYXRhLnBkZnMucGVuZGluZyA+IDBcbiAgICAgICAgICAgICAgPyBcIiNmZmMxMDdcIlxuICAgICAgICAgICAgICA6IFwiIzZjNzU3ZFwiXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICBsYWJlbD1cIlF1ZXVlIFNpemVcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLnF1ZXVlPy5pdGVtc31cbiAgICAgICAgICBpY29uPVwiTGlzdFwiXG4gICAgICAgICAgaWNvbkNvbG9yPXtcbiAgICAgICAgICAgIGRhdGEucXVldWU/Lml0ZW1zICYmIGRhdGEucXVldWUuaXRlbXMgPiAwXG4gICAgICAgICAgICAgID8gXCIjZmQ3ZTE0XCJcbiAgICAgICAgICAgICAgOiBcIiM2Yzc1N2RcIlxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgbGFiZWw9XCJFeHRyYSBEYXRhXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5xdWV1ZT8uaXRlbXN9XG4gICAgICAgICAgaWNvbj1cIkxpc3RcIlxuICAgICAgICAgIGljb25Db2xvcj17XG4gICAgICAgICAgICBkYXRhLnF1ZXVlPy5pdGVtcyAmJiBkYXRhLnF1ZXVlLml0ZW1zID4gMFxuICAgICAgICAgICAgICA/IFwiI2ZkN2UxNFwiXG4gICAgICAgICAgICAgIDogXCIjNmM3NTdkXCJcbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICA8L1N0YXRzR3JpZD5cblxuICAgICAgPEZvb3RlckJveD5cbiAgICAgICAgPFRleHRcbiAgICAgICAgICBzbWFsbFxuICAgICAgICAgIGNvbG9yPVwidGV4dE11dGVkXCJcbiAgICAgICAgPlxuICAgICAgICAgIExhc3QgdXBkYXRlZDoge2RhdGEubGFzdFVwZGF0ZWQgfHwgXCJOL0FcIn1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdmFyaWFudD1cIm91dGxpbmVkXCJcbiAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGZldGNoRGFzaGJvYXJkRGF0YSgpfVxuICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nfVxuICAgICAgICA+XG4gICAgICAgICAgPEljb25cbiAgICAgICAgICAgIGljb249XCJSZWZyZXNoQ3dcIlxuICAgICAgICAgICAgbXI9XCJzbVwiXG4gICAgICAgICAgLz57XCIgXCJ9XG4gICAgICAgICAgUmVmcmVzaCBEYXRhXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Gb290ZXJCb3g+XG4gICAgPC9EYXNoYm9hcmRDb250YWluZXI+XG4gICk7XG59O1xuXG5jb25zdCBEYXNoYm9hcmRDb250YWluZXIgPSBzdHlsZWQoQm94KWBcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE0NWRlZywgI2Y4ZmFmYyAwJSwgI2YxZjVmOSAxMDAlKTtcbiAgcGFkZGluZzogMnJlbTtcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgYm94LXNoYWRvdzogMCA4cHggMjRweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLnRleHR9O1xuICBmb250LWZhbWlseTogXCJJbnRlclwiLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWY7XG4gIG1hcmdpbjogMXJlbTtcbmA7XG5cbmNvbnN0IEhlYWRlckJveCA9IHN0eWxlZChCb3gpYFxuICBtYXJnaW4tYm90dG9tOiAzcmVtO1xuICBwYWRkaW5nLWJvdHRvbTogMS41cmVtO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMuYm9yZGVyfTtcbmA7XG5cbmNvbnN0IEdyZWV0aW5nVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgZm9udC1zaXplOiAyLjVyZW07XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiA0OHB4O1xuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMucHJpbWFyeTEwMH07XG4gIG1hcmdpbi1ib3R0b206IDAuNzVyZW07XG5gO1xuXG5jb25zdCBTdWJ0aXRsZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMudGV4dE11dGVkfTtcbmA7XG5cbmNvbnN0IFN0YXRzR3JpZCA9IHN0eWxlZChCb3gpYFxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIyMHB4LCAxZnIpKTtcbiAgZ2FwOiAxLjVyZW07XG4gIG1hcmdpbi1ib3R0b206IDNyZW07XG5gO1xuXG5jb25zdCBGb290ZXJCb3ggPSBzdHlsZWQoQm94KWBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nLXRvcDogMS41cmVtO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMuYm9yZGVyfTtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDFyZW07XG5gO1xuXG5jb25zdCBFcnJvck1lc3NhZ2UgPSBzdHlsZWQoVGV4dCk8eyBzbWFsbD86IGJvb2xlYW4gfT5gXG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5lcnJvcn07XG4gIGJhY2tncm91bmQ6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLmVycm9yTGlnaHR9O1xuICBwYWRkaW5nOiAkeyh7IHNtYWxsIH0pID0+XG4gICAgc21hbGwgPyBcIjAuNXJlbSAwLjc1cmVtXCIgOiBcIjAuNzVyZW0gMXJlbVwifTtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBmb250LXNpemU6IDAuOXJlbTtcbiAgbWFyZ2luOiAwLjVyZW0gMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjVyZW07XG5cbiAgJjo6YmVmb3JlIHtcbiAgICBjb250ZW50OiBcIiFcIjtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi13aWR0aDogMThweDtcbiAgICBoZWlnaHQ6IDE4cHg7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGJhY2tncm91bmQ6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLmVycm9yfTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgZm9udC1zaXplOiAwLjc1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB9XG5gO1xuXG5jb25zdCBMb2FkaW5nQ29udGFpbmVyID0gc3R5bGVkKERhc2hib2FyZENvbnRhaW5lcilgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtaW4taGVpZ2h0OiA0MDBweDtcbiAgbWFyZ2luOiAxcmVtO1xuYDtcblxuY29uc3QgTG9hZGluZ0NvbnRlbnQgPSBzdHlsZWQoQm94KWBcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nOiAycmVtO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBiYWNrZ3JvdW5kOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy53aGl0ZX07XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggcmdiYSgwLCAwLCAwLCAwLjA1KTtcbiAgd2lkdGg6IDEwMCU7XG4gIG1heC13aWR0aDogNDAwcHg7XG5gO1xuXG5jb25zdCBMb2FkaW5nSWNvbiA9IHN0eWxlZChJY29uKWBcbiAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuY29sb3JzLnByaW1hcnkxMDB9O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuYDtcblxuY29uc3QgTG9hZGluZ1RleHQgPSBzdHlsZWQoVGV4dClgXG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy50ZXh0TXV0ZWR9O1xuICBmb250LXNpemU6IDFyZW07XG5gO1xuXG5jb25zdCBFcnJvckNvbnRhaW5lciA9IHN0eWxlZChMb2FkaW5nQ29udGFpbmVyKWBgO1xuXG5jb25zdCBFcnJvckNvbnRlbnQgPSBzdHlsZWQoTG9hZGluZ0NvbnRlbnQpYFxuICBwYWRkaW5nOiAzcmVtIDJyZW07XG5gO1xuXG5jb25zdCBFcnJvckljb24gPSBzdHlsZWQoSWNvbilgXG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy5lcnJvcn07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG5gO1xuXG5jb25zdCBFcnJvclRpdGxlID0gc3R5bGVkKFRleHQpYFxuICBmb250LXNpemU6IDEuMjVyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLmNvbG9ycy50ZXh0fTtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuYDtcblxuY29uc3QgUmV0cnlCdXR0b24gPSBzdHlsZWQoQnV0dG9uKWBcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMaW5rIH0gZnJvbSBcIkBhZG1pbmpzL2Rlc2lnbi1zeXN0ZW1cIjtcbmltcG9ydCB7IExvZ2dlclByb3BlcnRpZXNNYXBwaW5nIGFzIE9yaWdpbmFsTG9nZ2VyUHJvcGVydGllc01hcHBpbmcgfSBmcm9tIFwiQGFkbWluanMvbG9nZ2VyXCI7XG5cbi8vIEV4dGVuZCBMb2dnZXJQcm9wZXJ0aWVzTWFwcGluZyB0byBhbGxvdyBzdHJpbmcgaW5kZXhpbmdcbnR5cGUgTG9nZ2VyUHJvcGVydGllc01hcHBpbmcgPSBPcmlnaW5hbExvZ2dlclByb3BlcnRpZXNNYXBwaW5nICYge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59O1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5UHJvcHMsIFZpZXdIZWxwZXJzIH0gZnJvbSBcImFkbWluanNcIjtcbmltcG9ydCBSZWFjdCwgeyBGQyB9IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBnZXRMb2dQcm9wZXJ0eU5hbWUgPSAoXG4gIHByb3BlcnR5OiBzdHJpbmcsXG4gIG1hcHBpbmc6IExvZ2dlclByb3BlcnRpZXNNYXBwaW5nID0ge31cbikgPT4ge1xuICBpZiAoIW1hcHBpbmdbcHJvcGVydHldKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5O1xuICB9XG5cbiAgcmV0dXJuIG1hcHBpbmdbcHJvcGVydHldO1xufTtcblxuY29uc3Qgdmlld0hlbHBlcnMgPSBuZXcgVmlld0hlbHBlcnMoKTtcbmNvbnN0IExpc3RSZWNvcmRMaW5rUHJvcGVydHk6IEZDPEJhc2VQcm9wZXJ0eVByb3BzPiA9ICh7XG4gIHJlY29yZCxcbiAgcHJvcGVydHksXG59KSA9PiB7XG4gIGlmICghcmVjb3JkPy5wYXJhbXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHsgY3VzdG9tID0ge30gfSA9IHByb3BlcnR5O1xuICBjb25zdCB7IHByb3BlcnRpZXNNYXBwaW5nID0ge30gfSA9IGN1c3RvbTtcblxuICBjb25zdCByZWNvcmRJZFBhcmFtID0gZ2V0TG9nUHJvcGVydHlOYW1lKFxuICAgIFwicmVjb3JkSWRcIixcbiAgICBwcm9wZXJ0aWVzTWFwcGluZ1xuICApO1xuICBjb25zdCByZXNvdXJjZUlkUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoXG4gICAgXCJyZXNvdXJjZVwiLFxuICAgIHByb3BlcnRpZXNNYXBwaW5nXG4gICk7XG4gIGNvbnN0IHJlY29yZFRpdGxlUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoXG4gICAgXCJyZWNvcmRUaXRsZVwiLFxuICAgIHByb3BlcnRpZXNNYXBwaW5nXG4gICk7XG5cbiAgY29uc3QgcmVjb3JkSWQgPSByZWNvcmQucGFyYW1zW3JlY29yZElkUGFyYW1dO1xuICBjb25zdCByZXNvdXJjZSA9IHJlY29yZC5wYXJhbXNbcmVzb3VyY2VJZFBhcmFtXTtcbiAgY29uc3QgcmVjb3JkVGl0bGUgPSByZWNvcmQucGFyYW1zW3JlY29yZFRpdGxlUGFyYW1dO1xuXG4gIGlmICghcmVjb3JkSWQgfHwgIXJlc291cmNlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxGb3JtR3JvdXA+XG4gICAgICA8TGlua1xuICAgICAgICBocmVmPXt2aWV3SGVscGVycy5yZWNvcmRBY3Rpb25Vcmwoe1xuICAgICAgICAgIGFjdGlvbk5hbWU6IFwic2hvd1wiLFxuICAgICAgICAgIHJlY29yZElkLFxuICAgICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAge3JlY29yZFRpdGxlfVxuICAgICAgPC9MaW5rPlxuICAgIDwvRm9ybUdyb3VwPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTGlzdFJlY29yZExpbmtQcm9wZXJ0eTtcbiIsImltcG9ydCB7IEJveCwgQnV0dG9uLCBUZXh0IH0gZnJvbSBcIkBhZG1pbmpzL2Rlc2lnbi1zeXN0ZW1cIjtcbmltcG9ydCB7XG4gIEJhc2VQcm9wZXJ0eUNvbXBvbmVudCxcbiAgRWRpdFByb3BlcnR5UHJvcHMsXG4gIHVzZVRyYW5zbGF0aW9uLFxufSBmcm9tIFwiYWRtaW5qc1wiO1xuaW1wb3J0IFJlYWN0LCB7IEZDLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IEVkaXRQYXNzd29yZFByb3BlcnR5OiBGQzxFZGl0UHJvcGVydHlQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBvbkNoYW5nZSwgcHJvcGVydHksIHJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzO1xuICBjb25zdCB7IHRyYW5zbGF0ZUJ1dHRvbjogdGIgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHRvZ2dsZVBhc3N3b3JkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghc2hvd1Bhc3N3b3JkKSB7XG4gICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBcIlwiKTtcbiAgICB9XG4gIH0sIFtvbkNoYW5nZSwgc2hvd1Bhc3N3b3JkXSk7XG5cbiAgLy8gRm9yIG5ldyByZWNvcmRzIGFsd2F5cyBzaG93IHRoZSBwcm9wZXJ0eVxuICBpZiAoIXJlY29yZC5pZCkge1xuICAgIHJldHVybiA8QmFzZVByb3BlcnR5Q29tcG9uZW50LlBhc3N3b3JkLkVkaXQgey4uLnByb3BzfSAvPjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveD5cbiAgICAgIHtzaG93UGFzc3dvcmQgJiYgKFxuICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50LlBhc3N3b3JkLkVkaXQgey4uLnByb3BzfSAvPlxuICAgICAgKX1cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8VGV4dCB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0b2dnbGVQYXNzd29yZCghc2hvd1Bhc3N3b3JkKX1cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzaG93UGFzc3dvcmRcbiAgICAgICAgICAgICAgPyB0YihcImNhbmNlbFwiLCByZXNvdXJjZS5pZClcbiAgICAgICAgICAgICAgOiB0YihcImNoYW5nZVBhc3N3b3JkXCIsIHJlc291cmNlLmlkKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0UGFzc3dvcmRQcm9wZXJ0eTtcbiIsImltcG9ydCB7XG4gIExhYmVsLFxuICBUYWJsZVJvdyxcbiAgRm9ybUdyb3VwLFxuICBUYWJsZUJvZHksXG4gIFRhYmxlSGVhZCxcbiAgVGFibGVDZWxsLFxuICBUYWJsZSBhcyBBZG1pblRhYmxlLFxufSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbVwiO1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5UHJvcHMsIGZsYXQgfSBmcm9tIFwiYWRtaW5qc1wiO1xuaW1wb3J0IFJlYWN0LCB7IEZDIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBzdHlsZWQgfSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50c1wiO1xuXG5jb25zdCBDZWxsID0gc3R5bGVkKFRhYmxlQ2VsbClgXG4gIHdpZHRoOiAxMDAlO1xuICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuYDtcbmNvbnN0IFJvdyA9IHN0eWxlZChUYWJsZVJvdylgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiB1bnNldDtcbmA7XG5jb25zdCBIZWFkID0gc3R5bGVkKFRhYmxlSGVhZClgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiB1bnNldDtcbmA7XG5jb25zdCBUYWJsZSA9IHN0eWxlZChBZG1pblRhYmxlKWBcbiAgd2lkdGg6IDEwMCU7XG4gIHBvc2l0aW9uOiB1bnNldDtcbiAgZGlzcGxheTogYmxvY2s7XG5gO1xuXG5jb25zdCBEaWZmZXJlbmNlUmVjb3JkUHJvcGVydHk6IEZDPEJhc2VQcm9wZXJ0eVByb3BzPiA9ICh7XG4gIHJlY29yZCxcbiAgcHJvcGVydHksXG59KSA9PiB7XG4gIC8vIEdldCB0aGUgdW5mbGF0dGVuZWQgdmVyc2lvbiBvZiB0aGUgZW50aXJlIHJlY29yZFxuICBjb25zdCB1bmZsYXR0ZW5lZFBhcmFtcyA9IGZsYXQudW5mbGF0dGVuKHJlY29yZD8ucGFyYW1zID8/IHt9KTtcbiAgY29uc3QgZGlmZmVyZW5jZXMgPSB1bmZsYXR0ZW5lZFBhcmFtcz8uW3Byb3BlcnR5Lm5hbWVdO1xuXG4gIGlmICghZGlmZmVyZW5jZXMgfHwgdHlwZW9mIGRpZmZlcmVuY2VzICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtR3JvdXA+XG4gICAgICA8TGFiZWw+e3Byb3BlcnR5LmxhYmVsfTwvTGFiZWw+XG4gICAgICA8VGFibGU+XG4gICAgICAgIDxIZWFkPlxuICAgICAgICAgIDxSb3c+XG4gICAgICAgICAgICA8Q2VsbD5Qcm9wZXJ0eSBuYW1lPC9DZWxsPlxuICAgICAgICAgICAgPENlbGw+QmVmb3JlPC9DZWxsPlxuICAgICAgICAgICAgPENlbGw+QWZ0ZXI8L0NlbGw+XG4gICAgICAgICAgPC9Sb3c+XG4gICAgICAgIDwvSGVhZD5cbiAgICAgICAgPFRhYmxlQm9keT5cbiAgICAgICAgICB7T2JqZWN0LmVudHJpZXMoXG4gICAgICAgICAgICBkaWZmZXJlbmNlcyBhcyBSZWNvcmQ8XG4gICAgICAgICAgICAgIHN0cmluZyxcbiAgICAgICAgICAgICAgeyBiZWZvcmU6IHN0cmluZzsgYWZ0ZXI6IHN0cmluZyB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgKS5tYXAoKFtwcm9wZXJ0eU5hbWUsIHsgYmVmb3JlLCBhZnRlciB9XSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFJvdyBrZXk9e3Byb3BlcnR5TmFtZX0+XG4gICAgICAgICAgICAgICAgPENlbGwgd2lkdGg9ezEgLyAzfT57cHJvcGVydHlOYW1lfTwvQ2VsbD5cbiAgICAgICAgICAgICAgICA8Q2VsbFxuICAgICAgICAgICAgICAgICAgY29sb3I9XCJyZWRcIlxuICAgICAgICAgICAgICAgICAgd2lkdGg9ezEgLyAzfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtKU09OLnN0cmluZ2lmeShiZWZvcmUpIHx8IFwidW5kZWZpbmVkXCJ9XG4gICAgICAgICAgICAgICAgPC9DZWxsPlxuICAgICAgICAgICAgICAgIDxDZWxsXG4gICAgICAgICAgICAgICAgICBjb2xvcj1cImdyZWVuXCJcbiAgICAgICAgICAgICAgICAgIHdpZHRoPXsxIC8gM31cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7SlNPTi5zdHJpbmdpZnkoYWZ0ZXIpIHx8IFwidW5kZWZpbmVkXCJ9XG4gICAgICAgICAgICAgICAgPC9DZWxsPlxuICAgICAgICAgICAgICA8L1Jvdz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvVGFibGVCb2R5PlxuICAgICAgPC9UYWJsZT5cbiAgICA8L0Zvcm1Hcm91cD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERpZmZlcmVuY2VSZWNvcmRQcm9wZXJ0eTtcbiIsImltcG9ydCB7XG4gIEgyLFxuICBCb3gsXG4gIEljb24sXG4gIExhYmVsLFxuICBJbnB1dCxcbiAgQnV0dG9uLFxufSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbVwiO1xuaW1wb3J0IHsgTG9naW5Qcm9wcyB9IGZyb20gXCJhZG1pbmpzXCI7XG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7XG4gIHN0eWxlZCxcbiAga2V5ZnJhbWVzLFxufSBmcm9tIFwiQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50c1wiO1xuXG5jb25zdCBMb2dpbjogUmVhY3QuRkM8TG9naW5Qcm9wcz4gPSAoeyBhY3Rpb24gfSkgPT4ge1xuICBjb25zdCBbZW1haWwsIHNldEVtYWlsXSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbcGFzc3dvcmQsIHNldFBhc3N3b3JkXSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbaXNFbWFpbEZvY3VzZWQsIHNldElzRW1haWxGb2N1c2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzUGFzc3dvcmRGb2N1c2VkLCBzZXRJc1Bhc3N3b3JkRm9jdXNlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGZvcm1BY3Rpb24gPSBhY3Rpb24gfHwgXCIvYWRtaW4vbG9naW5cIjtcblxuICByZXR1cm4gKFxuICAgIDxMb2dpbkNvbnRhaW5lcj5cbiAgICAgIDxCYWNrZ3JvdW5kUGF0dGVybiAvPlxuICAgICAgPFdyYXBwZXJCb3g+XG4gICAgICAgIDxMb2dpbkNhcmQ+XG4gICAgICAgICAgPExvZ29Db250YWluZXI+XG4gICAgICAgICAgICA8TG9nb0ljb24+XG4gICAgICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICAgICAgc2l6ZT17MzJ9XG4gICAgICAgICAgICAgICAgaWNvbj1cIkNvcHlcIlxuICAgICAgICAgICAgICAgIGNvbG9yPVwiIzRGNDZFNVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0xvZ29JY29uPlxuICAgICAgICAgICAgPFN0eWxlZEgyPlRlbXBsYXRlPC9TdHlsZWRIMj5cbiAgICAgICAgICA8L0xvZ29Db250YWluZXI+XG4gICAgICAgICAgPGZvcm1cbiAgICAgICAgICAgIGFjdGlvbj17Zm9ybUFjdGlvbn1cbiAgICAgICAgICAgIG1ldGhvZD1cIlBPU1RcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgICAgICAgIDxTdHlsZWRMYWJlbFxuICAgICAgICAgICAgICAgIGh0bWxGb3I9XCJlbWFpbFwiXG4gICAgICAgICAgICAgICAgYWN0aXZlPXtpc0VtYWlsRm9jdXNlZCB8fCBlbWFpbC5sZW5ndGggPiAwfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEljb25cbiAgICAgICAgICAgICAgICAgIGljb249XCJFbnZlbG9wZU9wZW5cIlxuICAgICAgICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICBFbWFpbCBBZGRyZXNzXG4gICAgICAgICAgICAgIDwvU3R5bGVkTGFiZWw+XG4gICAgICAgICAgICAgIDxTdHlsZWRJbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgICBpZD1cImVtYWlsXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT5cbiAgICAgICAgICAgICAgICAgIHNldEVtYWlsKGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZXRJc0VtYWlsRm9jdXNlZCh0cnVlKX1cbiAgICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IHNldElzRW1haWxGb2N1c2VkKGZhbHNlKX1cbiAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgIGFjdGl2ZT17aXNFbWFpbEZvY3VzZWR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgICAgPFN0eWxlZExhYmVsXG4gICAgICAgICAgICAgICAgaHRtbEZvcj1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBhY3RpdmU9e2lzUGFzc3dvcmRGb2N1c2VkIHx8IHBhc3N3b3JkLmxlbmd0aCA+IDB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cIktleVwiXG4gICAgICAgICAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIFBhc3N3b3JkXG4gICAgICAgICAgICAgIDwvU3R5bGVkTGFiZWw+XG4gICAgICAgICAgICAgIDxTdHlsZWRJbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT5cbiAgICAgICAgICAgICAgICAgIHNldFBhc3N3b3JkKGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZXRJc1Bhc3N3b3JkRm9jdXNlZCh0cnVlKX1cbiAgICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IHNldElzUGFzc3dvcmRGb2N1c2VkKGZhbHNlKX1cbiAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgIGFjdGl2ZT17aXNQYXNzd29yZEZvY3VzZWR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgICAgPEJ1dHRvbnNDb250YWluZXI+XG4gICAgICAgICAgICAgIDxMb2dpbkJ1dHRvblxuICAgICAgICAgICAgICAgIGFzPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICAgICAgICBpY29uPVwiTG9nSW5cIlxuICAgICAgICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5TaWduIEluPC9zcGFuPlxuICAgICAgICAgICAgICA8L0xvZ2luQnV0dG9uPlxuXG4gICAgICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZExpbmsgaHJlZj1cIiNcIj5cbiAgICAgICAgICAgICAgICBGb3Jnb3QgcGFzc3dvcmQ/XG4gICAgICAgICAgICAgIDwvRm9yZ290UGFzc3dvcmRMaW5rPlxuICAgICAgICAgICAgPC9CdXR0b25zQ29udGFpbmVyPlxuICAgICAgICAgIDwvZm9ybT5cblxuICAgICAgICAgIDxGb290ZXI+XG4gICAgICAgICAgICA8U2VjdXJpdHlUZXh0PlxuICAgICAgICAgICAgICA8SWNvblxuICAgICAgICAgICAgICAgIGljb249XCJTaGllbGRcIlxuICAgICAgICAgICAgICAgIHNpemU9ezE0fVxuICAgICAgICAgICAgICAgIGNvbG9yPVwiIzZCNzI4MFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxzcGFuPlNlY3VyZSBBdXRoZW50aWNhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgIDwvU2VjdXJpdHlUZXh0PlxuICAgICAgICAgIDwvRm9vdGVyPlxuICAgICAgICA8L0xvZ2luQ2FyZD5cbiAgICAgIDwvV3JhcHBlckJveD5cbiAgICA8L0xvZ2luQ29udGFpbmVyPlxuICApO1xufTtcblxuY29uc3QgcHVsc2UgPSBrZXlmcmFtZXNgXG4gIDAlIHsgb3BhY2l0eTogMC44OyB0cmFuc2Zvcm06IHNjYWxlKDEpOyB9XG4gIDUwJSB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7IH1cbiAgMTAwJSB7IG9wYWNpdHk6IDAuODsgdHJhbnNmb3JtOiBzY2FsZSgxKTsgfVxuYDtcblxuY29uc3QgTG9naW5Db250YWluZXIgPSBzdHlsZWQoQm94KWBcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZDogI2Y4ZmFmOTtcbmA7XG5cbmNvbnN0IEJhY2tncm91bmRQYXR0ZXJuID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIG9wYWNpdHk6IDAuNDtcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweDtcbiAgei1pbmRleDogMTtcbmA7XG5cbmNvbnN0IFdyYXBwZXJCb3ggPSBzdHlsZWQoQm94KWBcbiAgei1pbmRleDogMjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZzogNnJlbSAxcmVtIDEwcmVtO1xuYDtcblxuaW50ZXJmYWNlIExvZ2luQ2FyZFByb3BzIHtcbiAgaXNIb3ZlcmluZzogYm9vbGVhbjtcbn1cblxuY29uc3QgTG9naW5DYXJkID0gc3R5bGVkKEJveCk8TG9naW5DYXJkUHJvcHM+YFxuICB3aWR0aDogMTAwJTtcbiAgbWF4LXdpZHRoOiA0MjBweDtcbiAgcGFkZGluZzogMi41cmVtO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOTUpO1xuICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICBib3gtc2hhZG93OiAwIDIwcHggMjVweCAtNXB4IHJnYmEoMCwgMCwgMCwgMC4xKSxcbiAgICAwIDEwcHggMTBweCAtNXB4IHJnYmEoMCwgMCwgMCwgMC4wNCksXG4gICAgMCAwIDAgMXB4IHJnYmEoNzksIDcwLCAyMjksIDAuMSkgaW5zZXQ7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuOHMgZWFzZTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICY6YmVmb3JlIHtcbiAgICBjb250ZW50OiBcIlwiO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IC0ycHg7XG4gICAgbGVmdDogLTJweDtcbiAgICByaWdodDogLTJweDtcbiAgICBib3R0b206IC0ycHg7XG4gICAgYmFja2dyb3VuZC1zaXplOiA0MDAlIDQwMCU7XG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgICB6LWluZGV4OiAtMTtcbiAgICBvcGFjaXR5OiAkeyhwcm9wcykgPT4gKHByb3BzLmlzSG92ZXJpbmcgPyAxIDogMC43KX07XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2U7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBib3gtc2hhZG93OiAwIDI1cHggNTBweCAtMTJweCByZ2JhKDAsIDAsIDAsIDAuMjUpLFxuICAgICAgMCAwIDAgMXB4IHJnYmEoNzksIDcwLCAyMjksIDAuMikgaW5zZXQ7XG5cbiAgICAmOmJlZm9yZSB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgTG9nb0NvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1hcmdpbi1ib3R0b206IDJyZW07XG5gO1xuXG5jb25zdCBMb2dvSWNvbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB3aWR0aDogNjRweDtcbiAgaGVpZ2h0OiA2NHB4O1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZWVmMmZmIDAlLCAjYzdkMmZlIDEwMCUpO1xuICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggLTFweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gIGFuaW1hdGlvbjogJHtwdWxzZX0gM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7XG5gO1xuXG5jb25zdCBTdHlsZWRIMiA9IHN0eWxlZChIMilgXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGZvbnQtc2l6ZTogMS43NXJlbTtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjNGY0NmU1LCAjODE4Y2Y4KTtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XG4gIGJhY2tncm91bmQtY2xpcDogdGV4dDtcbiAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xuICBsZXR0ZXItc3BhY2luZzogLTAuMDI1ZW07XG4gIG1hcmdpbjogMDtcbmA7XG5cbmNvbnN0IEZvcm1Hcm91cCA9IHN0eWxlZChCb3gpYFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDAuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5gO1xuXG5pbnRlcmZhY2UgTGFiZWxQcm9wcyB7XG4gIGFjdGl2ZTogYm9vbGVhbjtcbn1cblxuY29uc3QgU3R5bGVkTGFiZWwgPSBzdHlsZWQoTGFiZWwpPExhYmVsUHJvcHM+YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDAuNXJlbTtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiAocHJvcHMuYWN0aXZlID8gXCIjNEY0NkU1XCIgOiBcIiM2QjcyODBcIil9O1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG5cbiAgc3ZnIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IChwcm9wcy5hY3RpdmUgPyBcIiM0RjQ2RTVcIiA6IFwiIzlDQTNBRlwiKX07XG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyBlYXNlO1xuICB9XG5gO1xuXG5pbnRlcmZhY2UgSW5wdXRQcm9wcyB7XG4gIGFjdGl2ZTogYm9vbGVhbjtcbn1cblxuY29uc3QgU3R5bGVkSW5wdXQgPSBzdHlsZWQoSW5wdXQpPElucHV0UHJvcHM+YFxuICBiYWNrZ3JvdW5kOiAkeyhwcm9wcykgPT4gKHByb3BzLmFjdGl2ZSA/IFwiI0Y5RkFGQlwiIDogXCIjRjNGNEY2XCIpfTtcbiAgYm9yZGVyOiAxcHggc29saWRcbiAgICAkeyhwcm9wcykgPT4gKHByb3BzLmFjdGl2ZSA/IFwiIzgxOENGOFwiIDogXCIjRTVFN0VCXCIpfTtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgcGFkZGluZzogMC43NXJlbSAxcmVtO1xuICBmb250LXNpemU6IDFyZW07XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gIGJveC1zaGFkb3c6ICR7KHByb3BzKSA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IFwiMCAwIDAgNHB4IHJnYmEoMTI5LCAxNDAsIDI0OCwgMC4xKVwiIDogXCJub25lXCJ9O1xuXG4gICY6aG92ZXIge1xuICAgIGJvcmRlci1jb2xvcjogJHsocHJvcHMpID0+XG4gICAgICBwcm9wcy5hY3RpdmUgPyBcIiM4MThDRjhcIiA6IFwiI0QxRDVEQlwifTtcbiAgfVxuXG4gICY6Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgYm9yZGVyLWNvbG9yOiAjNjM2NmYxO1xuICAgIGJhY2tncm91bmQ6ICNmOWZhZmI7XG4gICAgYm94LXNoYWRvdzogMCAwIDAgNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjEpO1xuICB9XG5gO1xuXG5jb25zdCBCdXR0b25zQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAxcmVtO1xuICBtYXJnaW4tdG9wOiAycmVtO1xuYDtcblxuY29uc3QgTG9naW5CdXR0b24gPSBzdHlsZWQoQnV0dG9uKWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNGY0NmU1LCAjNjM2NmYxKTtcbiAgY29sb3I6IHdoaXRlO1xuICBmb250LXdlaWdodDogNjAwO1xuICBwYWRkaW5nOiAwLjg3NXJlbSAxLjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gIGJvcmRlcjogbm9uZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IC0xcHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNSk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAmOmhvdmVyIHtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMTVweCAtM3B4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpO1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM0MzM4Y2EsICM0ZjQ2ZTUpO1xuICB9XG5cbiAgJjphY3RpdmUge1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDRweCAtMXB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjUpO1xuICB9XG5cbiAgJjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAtMTAwJTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgICAgdG8gcmlnaHQsXG4gICAgICB0cmFuc3BhcmVudCxcbiAgICAgIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKSxcbiAgICAgIHRyYW5zcGFyZW50XG4gICAgKTtcbiAgICB0cmFuc2l0aW9uOiBsZWZ0IDAuN3MgZWFzZTtcbiAgfVxuXG4gICY6aG92ZXI6YmVmb3JlIHtcbiAgICBsZWZ0OiAxMDAlO1xuICB9XG5gO1xuXG5jb25zdCBGb3Jnb3RQYXNzd29yZExpbmsgPSBzdHlsZWQuYWBcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzZiNzI4MDtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG5cbiAgJjpob3ZlciB7XG4gICAgY29sb3I6ICM0ZjQ2ZTU7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gIH1cbmA7XG5cbmNvbnN0IEZvb3RlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW4tdG9wOiAycmVtO1xuICBwYWRkaW5nLXRvcDogMS41cmVtO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTdlYjtcbmA7XG5cbmNvbnN0IFNlY3VyaXR5VGV4dCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xuICBjb2xvcjogIzZiNzI4MDtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgTG9naW47XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9EYXNoYm9hcmQvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBMaXN0UmVjb3JkTGlua1Byb3BlcnR5IGZyb20gJy4uL3NyYy9yb3V0ZXMvYWRtaW4vY2xpZW50L2NvbXBvbmVudHMvTGlzdFByb3BlcnR5L0xpc3RSZWNvcmRMaW5rUHJvcGVydHknXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxpc3RSZWNvcmRMaW5rUHJvcGVydHkgPSBMaXN0UmVjb3JkTGlua1Byb3BlcnR5XG5pbXBvcnQgRWRpdFBhc3N3b3JkUHJvcGVydHkgZnJvbSAnLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9FZGl0UHJvcGVydHkvRWRpdFBhc3N3b3JkUHJvcGVydHknXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkVkaXRQYXNzd29yZFByb3BlcnR5ID0gRWRpdFBhc3N3b3JkUHJvcGVydHlcbmltcG9ydCBEaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkgZnJvbSAnLi4vc3JjL3JvdXRlcy9hZG1pbi9jbGllbnQvY29tcG9uZW50cy9EaWZmZXJlbmNlUHJvcGVydHkvRGlmZmVyZW5jZVJlY29yZFByb3BlcnR5J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EaWZmZXJlbmNlUmVjb3JkUHJvcGVydHkgPSBEaWZmZXJlbmNlUmVjb3JkUHJvcGVydHlcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9zcmMvcm91dGVzL2FkbWluL2NsaWVudC9jb21wb25lbnRzL0xvZ2luL0xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luIl0sIm5hbWVzIjpbIlN0YXRDYXJkIiwiaWNvbiIsImxhYmVsIiwidmFsdWUiLCJpY29uQ29sb3IiLCJkaXNwbGF5VmFsdWUiLCJ1bmRlZmluZWQiLCJpY29uRGlzcGxheUNvbG9yIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiU3R5bGVkU3RhdENhcmQiLCJJY29uQ2lyY2xlIiwiJGNvbG9yIiwiSWNvbiIsInNpemUiLCJjb2xvciIsIlN0YXRMYWJlbCIsIlN0YXRWYWx1ZSIsInN0eWxlZCIsIkJveCIsInRoZW1lIiwiY29sb3JzIiwid2hpdGUiLCJib3JkZXIiLCJUZXh0IiwidGV4dE11dGVkIiwicHJpbWFyeTEwMCIsInByaW1hcnkxMCIsIkRhc2hib2FyZCIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwidXNlU3RhdGUiLCJlcnJvciIsInNldEVycm9yIiwiZGF0YSIsInNldERhdGEiLCJhcGkiLCJBcGlDbGllbnQiLCJzZW5kTm90aWNlIiwidXNlTm90aWNlIiwiY3VycmVudEFkbWluIiwidXNlQ3VycmVudEFkbWluIiwidXNlRWZmZWN0IiwiZmV0Y2hEYXNoYm9hcmREYXRhIiwic2hvd0xvYWRpbmciLCJnZXREYXNoYm9hcmQiLCJ0aGVuIiwicmVzcG9uc2UiLCJmZXRjaGVkRGF0YSIsIm1lc3NhZ2UiLCJ0eXBlIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIkxvYWRpbmdDb250YWluZXIiLCJMb2FkaW5nQ29udGVudCIsIkxvYWRpbmdJY29uIiwic3BpbiIsIkxvYWRpbmdUZXh0IiwiRXJyb3JDb250YWluZXIiLCJFcnJvckNvbnRlbnQiLCJFcnJvckljb24iLCJFcnJvclRpdGxlIiwiRXJyb3JNZXNzYWdlIiwiUmV0cnlCdXR0b24iLCJvbkNsaWNrIiwibXIiLCJEYXNoYm9hcmRDb250YWluZXIiLCJIZWFkZXJCb3giLCJHcmVldGluZ1RleHQiLCJlbWFpbCIsIlN1YnRpdGxlVGV4dCIsIlN0YXRzR3JpZCIsImFjdGl2ZUpvYnMiLCJmYWlsZWRKb2JzIiwiY29tcGxldGVkSm9icyIsInBkZnMiLCJ0b3RhbCIsInByb2Nlc3NlZCIsInBlbmRpbmciLCJxdWV1ZSIsIml0ZW1zIiwiRm9vdGVyQm94Iiwic21hbGwiLCJsYXN0VXBkYXRlZCIsIkJ1dHRvbiIsInZhcmlhbnQiLCJkaXNhYmxlZCIsInRleHQiLCJlcnJvckxpZ2h0IiwiZ2V0TG9nUHJvcGVydHlOYW1lIiwicHJvcGVydHkiLCJtYXBwaW5nIiwidmlld0hlbHBlcnMiLCJWaWV3SGVscGVycyIsIkxpc3RSZWNvcmRMaW5rUHJvcGVydHkiLCJyZWNvcmQiLCJwYXJhbXMiLCJjdXN0b20iLCJwcm9wZXJ0aWVzTWFwcGluZyIsInJlY29yZElkUGFyYW0iLCJyZXNvdXJjZUlkUGFyYW0iLCJyZWNvcmRUaXRsZVBhcmFtIiwicmVjb3JkSWQiLCJyZXNvdXJjZSIsInJlY29yZFRpdGxlIiwiRm9ybUdyb3VwIiwiTGluayIsImhyZWYiLCJyZWNvcmRBY3Rpb25VcmwiLCJhY3Rpb25OYW1lIiwicmVzb3VyY2VJZCIsIkVkaXRQYXNzd29yZFByb3BlcnR5IiwicHJvcHMiLCJvbkNoYW5nZSIsInRyYW5zbGF0ZUJ1dHRvbiIsInRiIiwidXNlVHJhbnNsYXRpb24iLCJzaG93UGFzc3dvcmQiLCJ0b2dnbGVQYXNzd29yZCIsIm5hbWUiLCJpZCIsIkJhc2VQcm9wZXJ0eUNvbXBvbmVudCIsIlBhc3N3b3JkIiwiRWRpdCIsIm1iIiwidGV4dEFsaWduIiwiQ2VsbCIsIlRhYmxlQ2VsbCIsIlJvdyIsIlRhYmxlUm93IiwiSGVhZCIsIlRhYmxlSGVhZCIsIlRhYmxlIiwiQWRtaW5UYWJsZSIsIkRpZmZlcmVuY2VSZWNvcmRQcm9wZXJ0eSIsInVuZmxhdHRlbmVkUGFyYW1zIiwiZmxhdCIsInVuZmxhdHRlbiIsImRpZmZlcmVuY2VzIiwiTGFiZWwiLCJUYWJsZUJvZHkiLCJlbnRyaWVzIiwibWFwIiwicHJvcGVydHlOYW1lIiwiYmVmb3JlIiwiYWZ0ZXIiLCJrZXkiLCJ3aWR0aCIsIkpTT04iLCJzdHJpbmdpZnkiLCJMb2dpbiIsImFjdGlvbiIsInNldEVtYWlsIiwicGFzc3dvcmQiLCJzZXRQYXNzd29yZCIsImlzRW1haWxGb2N1c2VkIiwic2V0SXNFbWFpbEZvY3VzZWQiLCJpc1Bhc3N3b3JkRm9jdXNlZCIsInNldElzUGFzc3dvcmRGb2N1c2VkIiwiZm9ybUFjdGlvbiIsIkxvZ2luQ29udGFpbmVyIiwiQmFja2dyb3VuZFBhdHRlcm4iLCJXcmFwcGVyQm94IiwiTG9naW5DYXJkIiwiTG9nb0NvbnRhaW5lciIsIkxvZ29JY29uIiwiU3R5bGVkSDIiLCJtZXRob2QiLCJTdHlsZWRMYWJlbCIsImh0bWxGb3IiLCJhY3RpdmUiLCJTdHlsZWRJbnB1dCIsImUiLCJ0YXJnZXQiLCJvbkZvY3VzIiwib25CbHVyIiwicmVxdWlyZWQiLCJCdXR0b25zQ29udGFpbmVyIiwiTG9naW5CdXR0b24iLCJhcyIsIkZvcmdvdFBhc3N3b3JkTGluayIsIkZvb3RlciIsIlNlY3VyaXR5VGV4dCIsInB1bHNlIiwia2V5ZnJhbWVzIiwiZGl2IiwiaXNIb3ZlcmluZyIsIkgyIiwiSW5wdXQiLCJhIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBS0EsTUFBTUEsUUFBaUMsR0FBR0EsQ0FBQztJQUN6Q0MsSUFBSTtJQUNKQyxLQUFLO0lBQ0xDLEtBQUs7RUFDTEMsRUFBQUE7RUFDRixDQUFDLEtBQUs7RUFDSixFQUFBLE1BQU1DLFlBQVksR0FDaEJGLEtBQUssS0FBS0csU0FBUyxJQUFJSCxLQUFLLEtBQUssSUFBSSxHQUFHLEdBQUcsR0FBR0EsS0FBSztFQUNyRCxFQUFBLE1BQU1JLGdCQUFnQixHQUFHSCxTQUFTLElBQUksWUFBWTtJQUVsRCxvQkFDRUksc0JBQUEsQ0FBQUMsYUFBQSxDQUFDQyxjQUFjLHFCQUNiRixzQkFBQSxDQUFBQyxhQUFBLENBQUNFLFVBQVUsRUFBQTtFQUFDQyxJQUFBQSxNQUFNLEVBQUVSO0VBQVUsR0FBQSxlQUM1Qkksc0JBQUEsQ0FBQUMsYUFBQSxDQUFDSSxpQkFBSSxFQUFBO0VBQ0haLElBQUFBLElBQUksRUFBRUEsSUFBSztFQUNYYSxJQUFBQSxJQUFJLEVBQUUsRUFBRztFQUNUQyxJQUFBQSxLQUFLLEVBQUVSO0tBQ1IsQ0FDUyxDQUFDLGVBQ2JDLHNCQUFBLENBQUFDLGFBQUEsQ0FBQ08sU0FBUyxFQUFFZCxJQUFBQSxFQUFBQSxLQUFpQixDQUFDLGVBQzlCTSxzQkFBQSxDQUFBQyxhQUFBLENBQUNRLFNBQVMsRUFBRVosSUFBQUEsRUFBQUEsWUFBd0IsQ0FDdEIsQ0FBQztFQUVyQixDQUFDO0VBRUQsTUFBTUssY0FBYyxHQUFHUSx1QkFBTSxDQUFDQyxnQkFBRyxDQUFDO0FBQ2xDLGNBQUEsRUFBZ0IsQ0FBQztBQUFFQyxFQUFBQTtBQUFNLENBQUMsS0FBS0Es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
