"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui-verse/ui/theme";
import { Plus } from "lucide-react";

export default function ShowcasePage() {
  const [tab, setTab] = useState(0);
  const [radio, setRadio] = useState("default");
  const [check, setCheck] = useState(true);
  const [sw, setSw] = useState(true);
  const [slider, setSlider] = useState(40);
  const [sel, setSel] = useState("a");
  const { toggleTheme, mode } = useTheme();

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h3">Showcase ({mode})</Typography>
        <Button onClick={toggleTheme} variant="outlined" size="small">
          Toggle
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
        }}
      >
        <Card>
          <CardHeader title="font" />
          <CardContent>
            <Stack
              direction={"row"}
              spacing={1}
              flexWrap={"wrap"}
              useFlexGap
              alignItems={"end"}
            >
              <Typography variant="h1">H1</Typography>
              <Typography variant="h2">H2</Typography>
              <Typography variant="h3">H3</Typography>
              <Typography variant="h4">H4</Typography>
              <Typography variant="h5">H5</Typography>
              <Typography variant="h6">H6</Typography>
              <Typography variant="body1">Body1</Typography>
              <Typography variant="body2">Body2</Typography>
              <Typography variant="subtitle1">Subtitle1</Typography>
              <Typography variant="subtitle2">Subtitle2</Typography>
              <Typography variant="caption">Caption</Typography>
              <Typography variant="overline">Overline</Typography>
              <Typography color="textPrimary">primary</Typography>
              <Typography color="textSecondary">secondary</Typography>
              <Typography color="textDisabled">disabled</Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Button" />
          <CardContent>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button variant="contained">Primary</Button>
              <Button variant="contained" color="secondary">
                Secondary
              </Button>
              <Button variant="outlined">Outline</Button>
              <Button variant="text">Ghost</Button>
              <Button variant="contained" color="error">
                Destructive
              </Button>
              <Button variant="contained" color="warning">
                Warning
              </Button>
              <Button color="dark" variant="text">
                AAA
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Button Sizes" />
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button size="small">Small</Button>
              <Button>Default</Button>
              <Button size="large">Large</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Button with Icons" />
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button startIcon={<span>↓</span>}>Download</Button>
              <Button variant="outlined" endIcon={<span>›</span>}>
                Settings
              </Button>
            </Stack>
            <div className="mt-2">
              <IconButton size="medium">
                <Plus className="h-4 w-4" />
              </IconButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Input" />
          <CardContent>
            <Stack spacing={2}>
              <TextField placeholder="Default input..." size="small" />
              <TextField defaultValue="Filled value" size="small" />
              <TextField placeholder="Disabled..." size="small" disabled />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Select" />
          <CardContent>
            <FormControl size="small" fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={sel}
                label="Theme"
                onChange={(e) => setSel(e.target.value)}
              >
                <MenuItem value="a">Option A</MenuItem>
                <MenuItem value="b">Option B</MenuItem>
                <MenuItem value="c">Option C</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Chips" />
          <CardContent>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label="Default" />
              <Chip label="Primary" color="primary" />
              <Chip label="Secondary" color="secondary" variant="outlined" />
              <Chip label="Warning" color="warning" />
              <Chip label="Error" color="error" />
              <Chip label="Outlined" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Checkbox" />
          <CardContent>
            <Stack>
              <FormControlLabel
                control={
                  <Checkbox checked={check} onChange={(_, c) => setCheck(c)} />
                }
                label="Accept terms"
              />
              <FormControlLabel control={<Checkbox />} label="Email updates" />
              <FormControlLabel
                control={<Checkbox checked />}
                label="Newsletter"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Radio Group" />
          <CardContent>
            <RadioGroup value={radio} onChange={(_, v) => setRadio(v)}>
              <FormControlLabel
                value="default"
                control={<Radio />}
                label="Default"
              />
              <FormControlLabel
                value="comfortable"
                control={<Radio />}
                label="Comfortable"
              />
              <FormControlLabel
                value="compact"
                control={<Radio />}
                label="Compact"
              />
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="bg-background-default">
          <CardHeader title="Switch & Slider" />
          <CardContent>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={sw} onChange={(_, v) => setSw(v)} />}
                label="Enable notifications"
              />
              <Slider
                value={slider}
                onChange={(_, v) => setSlider(v as number)}
                min={0}
                max={100}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ gridColumn: "span 3" }}>
          <CardHeader title="Tabs" />
          <CardContent>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Account" />
              <Tab label="Password" />
              <Tab label="Settings" />
            </Tabs>
            <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
              Make changes to your account here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
