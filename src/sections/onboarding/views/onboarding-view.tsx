"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { handleResource } from "@/utils/APIRequester";
import { z } from "zod";

// Zod Schema for Validation
const onboardingSchema = z.object({
  planType: z.enum(["pay-as-you-go", "monthly", "yearly"]),
  price: z.string().regex(/^\d+$/, "Price must be a number"),
  expired: z.date().optional(),
  selectedUser: z.object({
    id: z.number(),
    name: z.string().min(1, "User is required"),
  }),
});

export default function OnboardingView() {
  const [planType, setPlanType] = useState<string>("monthly");
  const [additions, setAdditions] = useState<string[]>([]);
  const [expired, setExpired] = useState<Dayjs | null>(null);
  const [price, setPrice] = useState<string>("");
  const [users, setUsers] = useState<USER[]>([]);
  const [selectedUser, setSelectedUser] = useState<USER | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserList = async () => {
      try {
        const result = await handleResource({
          method: "get",
          endpoint: `users?page=1&per_page=100`,
        });
        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUserList();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      plan_type: planType,
      additions: additions,
      user_id: selectedUser?.id,
      expired: expired,
      price: Number(price),
    };
    setLoading(true);

    const result = await handleResource({
      method: "post",
      endpoint: "offers",
      data: payload,
      isMultipart: false,
      popupMessage: true,
      popupText: "Offer created successfully",
    });
    if (result) {
      setPlanType("monthly");
      setAdditions([]);
      setExpired(null);
      setPrice("");
      setSelectedUser(null);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 800, p: 3, mx: "auto", mt: 5, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ borderBottom: "2px solid gray" }}>
            <FormLabel
              sx={{ fontSize: 18, fontWeight: "bold", color: "black" }}
            >
              Create Offer
            </FormLabel>
            <Typography sx={{ color: "gray", mb: 2 }}>
              Send onboarding offer to new user
            </Typography>
          </Box>

          {/* Plan Type */}
          <FormControl component="fieldset" sx={{ mb: 2, mt: 4 }}>
            <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
              Plan Type
            </FormLabel>
            <RadioGroup
              row
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              {["pay-as-you-go", "monthly", "yearly"].map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={type}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Additions */}
          <Box>
            <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
              Additions
            </FormLabel>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {["refundable", "onDemand", "negotiable"].map((name) => (
                <FormControlLabel
                  key={name}
                  control={
                    <Checkbox
                      checked={additions.includes(name)}
                      onChange={(e) => {
                        setAdditions((prev) =>
                          e.target.checked
                            ? [...prev, name]
                            : prev.filter((item) => item !== name)
                        );
                      }}
                      name={name}
                    />
                  }
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                />
              ))}
            </Box>
          </Box>

          {/* User Selection */}
          <InputLabel
            sx={{ color: "black", marginBottom: "10px", fontWeight: "bold" }}
          >
            User
          </InputLabel>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.selectedUser}>
            <Select
              value={selectedUser?.id || ""}
              onChange={(e) => {
                const user = users.find((u) => u.id === Number(e.target.value));
                if (user) setSelectedUser(user);
              }}
            >
              {users.map((i: USER) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedUser && (
              <Typography color="error">{errors.selectedUser}</Typography>
            )}
          </FormControl>

          {/* Expiry Date */}
          <Box sx={{ marginBottom: "20px" }}>
            <InputLabel
              sx={{ color: "black", marginBottom: "10px", fontWeight: "bold" }}
            >
              Expired
            </InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={expired}
                  onChange={(newDate) => setExpired(newDate)}
                  sx={{ mb: 2, width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          {/* Price */}
          <InputLabel
            sx={{ color: "black", marginBottom: "10px", fontWeight: "bold" }}
          >
            Price
          </InputLabel>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "black", color: "white" }}
              onClick={handleSubmit}
            >
              Send Offer
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
