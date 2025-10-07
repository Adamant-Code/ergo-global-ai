import "dotenv/config";
// import axios from "axios";

// const STATUS_BASE_URL = process.env.BACKEND_URL;

export const dashboardHandler = async () => {
  // Simulate a small delay to mimic network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // To fetch data from the dashboard from the server and
    // display it there, it is preferred by AdminJS to create
    // a handler like this one where the data is fetched and on
    // on the dashboard component you can call it using their ApiClient

    // const [
    //   pdfStatsResponse,
    //   queueStatsResponse,
    //   activeJobsResponse,
    //   failedJobsResponse,
    //   completedJobsResponse,
    // ] = await Promise.all([
    //   axios.get(`${STATUS_BASE_URL}/status/pdfs`),
    //   axios.get(`${STATUS_BASE_URL}/status/queue`),
    //   axios.get(`${STATUS_BASE_URL}/status/jobs/active`),
    //   axios.get(`${STATUS_BASE_URL}/status/jobs/failed`),
    //   axios.get(`${STATUS_BASE_URL}/status/jobs/completed`),
    // ]);

    // const pdfStats = pdfStatsResponse.data.data;
    // const queueStats = queueStatsResponse.data.data;
    // const activeJobs = activeJobsResponse.data.data;
    // const failedJobs = failedJobsResponse.data.data;
    // const completedJobs = completedJobsResponse.data.data;

    const dummyData = {
      message: "Welcome to the Application Dashboard!",
      activeJobs: 15,
      failedJobs: 3,
      completedJobs: 120,
      pdfs: {
        total: 550,
        processed: 500,
        pending: 50,
      },
      queue: {
        items: 8,
      },
      lastUpdated: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    // In a real application, you would return the fetched data like this:
    // return {
    //   message: "Data passed successfully",
    //   activeJobs,
    //   failedJobs,
    //   completedJobs,
    //   pdfs: pdfStats,
    //   queue: queueStats,
    //   lastUpdated: new Date().toLocaleString(),
    // };

    return dummyData;
  } catch (error) {
    console.error("Error fetching dashboard data in handler:", error);
    return {
      error: "Failed to load dashboard data from handler.",
      message: "Could not load dashboard data.",
    };
  }
};
