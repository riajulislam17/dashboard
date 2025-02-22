"use client";

import { handleResource } from "@/utils/APIRequester";
import {
  Badge,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardView() {
  const [week, setWeek] = useState<string>("this-week");
  const [tab, setTab] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [data, setData] = useState<SummaryData>();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [total, setTotal] = useState<Meta>();
  const [offerList, setOfferList] = useState<OfferData[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    categories: [],
    series: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await handleResource({
          method: "get",
          endpoint: `dashboard/summary?filter=${week}`,
        });
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getData();
  }, [week]);

  useEffect(() => {
    const getOfferList = async () => {
      try {
        const result: Offer = await handleResource({
          method: "get",
          endpoint: `offers?page=${page}&per_page=${limit}&search=${searchText}&type=${type}&status=${tab}`,
        });
        setOfferList(result.data);
        setTotal(result?.meta);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getOfferList();
  }, [page, limit, searchText, type, tab]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await handleResource({
          method: "get",
          endpoint: `dashboard/stat?filter=${week}`,
        });

        if (result) {
          const categories = Object.keys(result.website_visits);
          const desktopVisits = categories.map(
            (day) => result.website_visits[day].desktop
          );
          const mobileVisits = categories.map(
            (day) => result.website_visits[day].mobile
          );
          const offersSent = categories.map((day) => result.offers_sent[day]);

          setChartData((prevState) => ({
            ...prevState,
            categories,
            series: [
              { name: "Desktop Visits", data: desktopVisits },
              { name: "Mobile Visits", data: mobileVisits },
              { name: "Offers Sent", data: offersSent },
            ],
          }));
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    getData();
  }, [week]);

  const columnChartOptions: ApexOptions = {
    chart: { type: "bar", height: 350 },
    xaxis: { categories: chartData.categories },
    title: { text: "Website Visits" },
  };

  const lineChartOptions: ApexOptions = {
    chart: { type: "line", height: 350 },
    xaxis: { categories: chartData.categories },
    title: { text: "Offers Sent" },
  };
  console.log("chartData", chartData);
  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography variant="h4">Dashboard</Typography>
          <FormControl sx={{ mb: 2, fontWeight: "bold" }}>
            <Select value={week} onChange={(e) => setWeek(e.target.value)}>
              <MenuItem value={"this-week"}>This Week</MenuItem>
              <MenuItem value={"prev-week"}>Previous Week</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {/* Card 1 */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                height: 150,
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total active uses
                </Typography>
                <Typography variant="h5" component="div">
                  {week === "this-week"
                    ? data?.current.active_users
                    : data?.previous.active_users}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {week === "this-week" ? "this" : "previous"} week
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                height: 150,
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total clicks
                </Typography>
                <Typography variant="h5" component="div">
                  {week === "this-week"
                    ? data?.current.clicks
                    : data?.previous.clicks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {week === "this-week" ? "this" : "previous"} week
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                height: 150,
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Appearances
                </Typography>
                <Typography variant="h5" component="div">
                  {week === "this-week"
                    ? data?.current.appearance
                    : data?.previous.appearance}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {week === "this-week" ? "this" : "previous"} week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginY: 10, display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Card sx={{ width: "48%" }}>
          <CardContent>
            <Chart
              options={columnChartOptions}
              series={chartData?.series?.slice(0, 2)}
              type="bar"
              height={350}
            />
          </CardContent>
        </Card>

        <Card sx={{ width: "48%" }}>
          <CardContent>
            <Chart
              options={lineChartOptions}
              series={
                chartData?.series?.length > 2 ? [chartData.series[2]] : []
              }
              type="line"
              height={350}
            />
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Card>
          <CardContent>
            <Typography variant="h6">Offer List</Typography>
            {/* status filter */}
            <Tabs
              value={tab}
              onChange={(_, newValue) => {
                setTab(newValue);
                setPage(0);
              }}
              aria-label="basic tabs example"
            >
              <Tab label="All" value={""} />
              <Tab label="Accepted" value={"accepted"} />
            </Tabs>

            {/* search and type filter */}
            <Grid
              container
              spacing={3}
              sx={{ marginY: 3, alignItems: "center" }}
            >
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(0);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
                          setPage(0);
                        }}
                        label="Type"
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}></Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* offer table */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {offerList?.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.user_name}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.company}</TableCell>
                        <TableCell>{item.jobTitle}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                          {" "}
                          <Chip
                            color={`${
                              item.status === "accepted"
                                ? "success"
                                : item.status === "rejected"
                                ? "error"
                                : "secondary"
                            }`}
                            label={item.status}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={total?.total || 0}
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
