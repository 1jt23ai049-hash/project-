import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Logo from "../components/Logo";
import { BRAND } from "../theme/brand";

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <Box
    component="a"
    href={href}
    sx={{
      color: "#263238",
      textDecoration: "none",
      fontWeight: 700,
      fontSize: "14px",
      "&:hover": {
        color: BRAND.primary,
      },
    }}
  >
    {children}
  </Box>
);

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #edf4e9 0%, #f8f9f3 55%, #ffffff 100%)",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderTop: "6px solid #263238",
          borderBottom: "1px solid #e5e7e2",
          backdropFilter: "blur(8px)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Logo size={34} />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#static-vs-dynamic">
              Static vs Dynamic
            </NavLink>
            <NavLink href="#reach">Reach</NavLink>
            <NavLink href="#plans">Plans</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              component={Link}
              to="/auth/login"
              sx={{
                color: "#263238",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Log in
            </Button>

            <Button
              component={Link}
              to="/company/register"
              variant="contained"
              sx={{
                backgroundColor: BRAND.primary,
                color: "#fff",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "10px",
                px: 2.5,
                py: 1,
                "&:hover": {
                  backgroundColor: BRAND.primaryDark,
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ================= HERO ================= */}
      <Box
        component="section"
        sx={{
          minHeight: { xs: "auto", md: "760px" },
          display: "flex",
          alignItems: "center",
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: { xs: 7, md: 5 },
              alignItems: "center",
            }}
          >
            {/* LEFT SIDE */}
            <Box>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1.5,
                  py: 0.8,
                  borderRadius: "7px",
                  border: "1px solid #c9dbc9",
                  backgroundColor: "#e7f0e4",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#315c3a",
                  }}
                >
                  For manufacturers under FCO & bio-stimulant QR rules
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "46px",
                    sm: "54px",
                    md: "60px",
                  },
                  lineHeight: 1.04,
                  fontWeight: 900,
                  letterSpacing: "-2.5px",
                  color: "#263238",
                }}
              >
                What's really
                <br />
                <Box
                  component="span"
                  sx={{
                    color: "#43834f",
                  }}
                >
                  inside the bag?
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  maxWidth: "620px",
                  fontSize: "18px",
                  lineHeight: 1.75,
                  color: "#69798a",
                }}
              >
                AgriQR turns a bag, drum, or carton into something a
                farmer can question before they buy it. One scan
                surfaces the batch&apos;s registration, composition,
                and dates — pulled straight from what the manufacturer
                filed, not restated by a dealer.
              </Typography>

              {/* FEATURES */}
              <Box
                sx={{
                  mt: 3.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {[
                  "Gazette & licence reference on every scan",
                  "Composition and dosage in the buyer's own language",
                  "Batch, manufacturing, and expiry — not a marketing page",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 21,
                        height: 21,
                        borderRadius: "50%",
                        backgroundColor: "#e4f0e3",
                        color: "#43834f",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#303b45",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* BUTTONS */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 4.5,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component={Link}
                  to="/company/register"
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.7,
                    borderRadius: "14px",
                    backgroundColor: "#347343",
                    fontSize: "15px",
                    fontWeight: 800,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#2c633a",
                    },
                  }}
                >
                  Start Your Trial
                </Button>

                <Button
                  component="a"
                  href="#how-it-works"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.7,
                    borderRadius: "14px",
                    borderColor: "#347343",
                    color: "#315c3a",
                    fontSize: "15px",
                    fontWeight: 800,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#2c633a",
                      backgroundColor: "#edf5eb",
                    },
                  }}
                >
                  How It Works
                </Button>
              </Box>
            </Box>

            {/* RIGHT SIDE */}
            <Box
              sx={{
                position: "relative",
                minHeight: "520px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* PRODUCT CARD */}
              <Box
                sx={{
                  width: {
                    xs: "280px",
                    md: "350px",
                  },
                  height: {
                    xs: "350px",
                    md: "430px",
                  },
                  background:
                    "linear-gradient(180deg,#fefef9 0%,#f7f7ef 100%)",
                  borderRadius: "18px",
                  transform: "rotate(2deg)",
                  boxShadow: "0 30px 60px rgba(55,76,57,0.18)",
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid #e5e7df",
                }}
              >
                <Box
                  sx={{
                    height: "88px",
                    background:
                      "linear-gradient(90deg,#347343,#438d59)",
                    color: "#fff",
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: "17px",
                    }}
                  >
                    AgriQR Verified
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      opacity: 0.85,
                      mt: 0.5,
                    }}
                  >
                    Scan result · Genuine agri-input
                  </Typography>
                </Box>

                {/* QR */}
                <Box
                  sx={{
                    mt: 4,
                    mx: "auto",
                    width: 120,
                    height: 120,
                    borderRadius: "18px",
                    backgroundColor: "#fff",
                    border: "1px solid #e2e5dc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 78,
                      height: 78,
                      border: "6px dotted #347343",
                      borderRadius: "10px",
                    }}
                  />
                </Box>

                {/* DETAILS */}
                <Box
                  sx={{
                    px: 4,
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#7b8790",
                        fontSize: 13,
                      }}
                    >
                      Product
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 13,
                        textAlign: "right",
                      }}
                    >
                      NPK 19:19:19 — 50kg
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#7b8790",
                        fontSize: 13,
                      }}
                    >
                      Batch No.
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      FT-2026-0842
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#7b8790",
                        fontSize: 13,
                      }}
                    >
                      Mfg / Exp
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      Mar 2026 / Mar 2028
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* BADGE 1 */}
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: "12%",
                  right: {
                    xs: "0%",
                    md: "-3%",
                  },
                  px: 2,
                  py: 1.3,
                  borderRadius: "15px",
                  backgroundColor: "#fff",
                  boxShadow:
                    "0 15px 35px rgba(38,50,56,0.12)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: 13,
                  }}
                >
                  🌿 100% Genuine
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#718096",
                  }}
                >
                  Verified agri-input
                </Typography>
              </Paper>

              {/* BADGE 2 */}
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: {
                    xs: "-2%",
                    md: "-7%",
                  },
                  px: 2,
                  py: 1.3,
                  borderRadius: "15px",
                  backgroundColor: "#fff",
                  boxShadow:
                    "0 15px 35px rgba(38,50,56,0.12)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: 13,
                  }}
                >
                  📱 No App Needed
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#718096",
                  }}
                >
                  Works on any phone
                </Typography>
              </Paper>

              {/* BADGE 3 */}
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  bottom: "12%",
                  left: {
                    xs: "0%",
                    md: "-3%",
                  },
                  px: 2,
                  py: 1.3,
                  borderRadius: "15px",
                  backgroundColor: "#fff",
                  boxShadow:
                    "0 15px 35px rgba(38,50,56,0.12)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: 13,
                  }}
                >
                  ⛶ Scan · Instant Result
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#718096",
                  }}
                >
                  Under 2 seconds
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ================= HOW IT WORKS ================= */}
      <Box
        id="how-it-works"
        sx={{
          py: 12,
          backgroundColor: "#ffffff",
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "38px",
                md: "48px",
              },
            }}
          >
            How It Works
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#69798a",
              fontSize: 18,
              maxWidth: "700px",
            }}
          >
            Register your products, generate QR codes, and let
            customers verify product information with a simple scan.
          </Typography>
        </Container>
      </Box>

      {/* ================= STATIC VS DYNAMIC ================= */}
      <Box
        id="static-vs-dynamic"
        sx={{
          py: 12,
          backgroundColor: "#f8f9f3",
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "38px",
                md: "48px",
              },
            }}
          >
            Static vs Dynamic
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#69798a",
              fontSize: 18,
              maxWidth: "700px",
            }}
          >
            Understand the difference between static and dynamic
            QR verification.
          </Typography>
        </Container>
      </Box>

      {/* ================= REACH ================= */}
      <Box
        id="reach"
        sx={{
          py: 12,
          backgroundColor: "#ffffff",
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "38px",
                md: "48px",
              },
            }}
          >
            Reach
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#69798a",
              fontSize: 18,
              maxWidth: "700px",
            }}
          >
            Help customers access product information directly
            from the package.
          </Typography>
        </Container>
      </Box>

      {/* ================= PLANS ================= */}
      <Box
        id="plans"
        sx={{
          py: 12,
          backgroundColor: "#f8f9f3",
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "38px",
                md: "48px",
              },
            }}
          >
            Plans
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#69798a",
              fontSize: 18,
              maxWidth: "700px",
            }}
          >
            Choose a plan that fits your organization's product
            verification requirements.
          </Typography>
        </Container>
      </Box>

      {/* ================= FAQ ================= */}
      <Box
        id="faq"
        sx={{
          py: 12,
          backgroundColor: "#ffffff",
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "38px",
                md: "48px",
              },
            }}
          >
            FAQ
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#69798a",
              fontSize: 18,
              maxWidth: "700px",
            }}
          >
            Frequently asked questions about AgriQR and QR-based
            product verification.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
