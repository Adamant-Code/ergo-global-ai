// import axios from "axios";
import { Box, Text, Icon, Button } from "@adminjs/design-system";
import StatCard from "./StatCard.js";
import React, { useEffect, useState } from "react";
import { DashboardData } from "../../types/dashboard/index.js";
import { ApiClient, useCurrentAdmin, useNotice } from "adminjs";
import { styled } from "@adminjs/design-system/styled-components";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Partial<DashboardData>>({});

  // ApiClient is used to communicate with the AdminJS backend routes,
  // including the custom dashboard handler
  const api = new ApiClient();
  const sendNotice = useNotice();
  const [currentAdmin] = useCurrentAdmin();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetches dashboard data from the custom dashboard handler
   */
  const fetchDashboardData = (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    api
      .getDashboard()
      .then((response) => {
        const fetchedData = response.data as DashboardData;
        if (fetchedData.error) {
          setError(fetchedData.error);
          sendNotice({
            message: fetchedData.error,
            type: "error",
          });
        } else {
          setData(fetchedData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Failed to load dashboard data due to a network or server issue."
        );
        sendNotice({
          message: "Failed to load dashboard data.",
          type: "error",
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

  if (loading && Object.keys(data).length === 0)
    return (
      <LoadingContainer>
        <LoadingContent>
          <LoadingIcon
            icon="Loader"
            spin
            size={32}
          />
          <LoadingText>Loading dashboard data...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );

  if (error)
    return (
      <ErrorContainer>
        <ErrorContent>
          <ErrorIcon
            icon="AlertCircle"
            size={40}
          />
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={() => fetchDashboardData()}>
            <Icon
              icon="RefreshCw"
              mr="sm"
            />{" "}
            Try Again
          </RetryButton>
        </ErrorContent>
      </ErrorContainer>
    );

  return (
    <DashboardContainer>
      <HeaderBox>
        <GreetingText>
          {data.message ||
            `Welcome, ${currentAdmin?.email || "Admin"}!`}
        </GreetingText>
        <SubtitleText>
          Overview of your application's key dummy metrics.
        </SubtitleText>
      </HeaderBox>

      <StatsGrid>
        <StatCard
          label="Active Jobs"
          value={data.activeJobs}
          icon="Zap"
          iconColor={
            data.activeJobs && data.activeJobs > 0
              ? "#007bff"
              : "#6c757d"
          }
        />
        <StatCard
          label="Failed Jobs"
          value={data.failedJobs}
          icon="AlertTriangle"
          iconColor={
            data.failedJobs && data.failedJobs > 0
              ? "#dc3545"
              : "#6c757d"
          }
        />
        <StatCard
          label="Completed Jobs"
          value={data.completedJobs}
          icon="CheckCircle"
          iconColor="#28a745"
        />
        <StatCard
          label="Total PDFs"
          value={data.pdfs?.total}
          icon="FileText"
          iconColor="#17a2b8"
        />
        <StatCard
          label="PDFs Processed"
          value={data.pdfs?.processed}
          icon="CheckSquare"
          iconColor="#28a745"
        />
        <StatCard
          label="PDFs Pending"
          value={data.pdfs?.pending}
          icon="Clock"
          iconColor={
            data.pdfs?.pending && data.pdfs.pending > 0
              ? "#ffc107"
              : "#6c757d"
          }
        />
        <StatCard
          label="Queue Size"
          value={data.queue?.items}
          icon="List"
          iconColor={
            data.queue?.items && data.queue.items > 0
              ? "#fd7e14"
              : "#6c757d"
          }
        />
        <StatCard
          label="Extra Data"
          value={data.queue?.items}
          icon="List"
          iconColor={
            data.queue?.items && data.queue.items > 0
              ? "#fd7e14"
              : "#6c757d"
          }
        />
      </StatsGrid>

      <FooterBox>
        <Text
          small
          color="textMuted"
        >
          Last updated: {data.lastUpdated || "N/A"}
        </Text>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => fetchDashboardData()}
          disabled={loading}
        >
          <Icon
            icon="RefreshCw"
            mr="sm"
          />{" "}
          Refresh Data
        </Button>
      </FooterBox>
    </DashboardContainer>
  );
};

const DashboardContainer = styled(Box)`
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  position: relative;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.text};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 1rem;
`;

const HeaderBox = styled(Box)`
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const GreetingText = styled(Text)`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 48px;
  color: ${({ theme }) => theme.colors.primary100};
  margin-bottom: 0.75rem;
`;

const SubtitleText = styled(Text)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const FooterBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 1rem;
`;

const ErrorMessage = styled(Text)<{ small?: boolean }>`
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorLight};
  padding: ${({ small }) =>
    small ? "0.5rem 0.75rem" : "0.75rem 1rem"};
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
    background: ${({ theme }) => theme.colors.error};
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;

const LoadingContainer = styled(DashboardContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  margin: 1rem;
`;

const LoadingContent = styled(Box)`
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
`;

const LoadingIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.primary100};
  margin-bottom: 1rem;
`;

const LoadingText = styled(Text)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
`;

const ErrorContainer = styled(LoadingContainer)``;

const ErrorContent = styled(LoadingContent)`
  padding: 3rem 2rem;
`;

const ErrorIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
`;

const ErrorTitle = styled(Text)`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const RetryButton = styled(Button)`
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
`;

export default Dashboard;
