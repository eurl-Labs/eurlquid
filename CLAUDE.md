Buat navbar swap dan buat di pages /swap dengan interface yang bisa memunculkan banyak DEX Agregator sesuai case ketika ingin swap nanti,
Lalu gunakan icon dari icon library popular, install dengan pnpm
Setelah itu, cocokkan nama dan gambar dex agregator dengan yang ada di folder logo



{
  "designSystem": {
    "name": "LiquidityOracle Custom Interface",
    "version": "1.0.0",
    "description": "Alternative modern DeFi interface design system with multiple theme options",
    
    "themeOptions": {
      "lightGlass": {
        "name": "Light Glassmorphism",
        "primary": {
          "50": "#f0f9ff",
          "100": "#e0f2fe", 
          "500": "#0ea5e9",
          "600": "#0284c7",
          "700": "#0369a1",
          "900": "#0c4a6e"
        },
        "background": {
          "primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "secondary": "rgba(255, 255, 255, 0.25)",
          "tertiary": "rgba(255, 255, 255, 0.35)",
          "card": "rgba(255, 255, 255, 0.2)",
          "elevated": "rgba(255, 255, 255, 0.3)"
        },
        "text": {
          "primary": "#1a202c",
          "secondary": "#2d3748",
          "tertiary": "#4a5568",
          "disabled": "#a0aec0"
        },
        "blur": "backdrop-filter: blur(10px)"
      },
      
      "neonCyber": {
        "name": "Neon Cyber",
        "primary": {
          "50": "#f0fff4",
          "100": "#c6f6d5", 
          "500": "#00ff88",
          "600": "#00e574",
          "700": "#00cc66",
          "900": "#00a355"
        },
        "background": {
          "primary": "linear-gradient(145deg, #0a0a0a 0%, #1a0033 50%, #000000 100%)",
          "secondary": "rgba(0, 255, 136, 0.05)",
          "tertiary": "rgba(0, 255, 136, 0.1)",
          "card": "rgba(0, 0, 0, 0.7)",
          "elevated": "rgba(0, 255, 136, 0.08)"
        },
        "text": {
          "primary": "#ffffff",
          "secondary": "#00ff88",
          "tertiary": "#a0aec0",
          "disabled": "#4a5568"
        },
        "glow": "box-shadow: 0 0 20px rgba(0, 255, 136, 0.3)"
      },

      "oceanBreeze": {
        "name": "Ocean Breeze",
        "primary": {
          "50": "#f0fdfa",
          "100": "#ccfbf1", 
          "500": "#14b8a6",
          "600": "#0d9488",
          "700": "#0f766e",
          "900": "#134e4a"
        },
        "background": {
          "primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "secondary": "rgba(20, 184, 166, 0.1)",
          "tertiary": "rgba(20, 184, 166, 0.15)",
          "card": "rgba(255, 255, 255, 0.9)",
          "elevated": "rgba(255, 255, 255, 0.95)"
        },
        "text": {
          "primary": "#0f172a",
          "secondary": "#475569",
          "tertiary": "#64748b",
          "disabled": "#94a3b8"
        }
      },

      "warmSunset": {
        "name": "Warm Sunset",
        "primary": {
          "50": "#fff7ed",
          "100": "#ffedd5", 
          "500": "#f97316",
          "600": "#ea580c",
          "700": "#c2410c",
          "900": "#9a3412"
        },
        "background": {
          "primary": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
          "secondary": "rgba(249, 115, 22, 0.1)",
          "tertiary": "rgba(249, 115, 22, 0.15)",
          "card": "rgba(255, 255, 255, 0.8)",
          "elevated": "rgba(255, 255, 255, 0.9)"
        },
        "text": {
          "primary": "#431407",
          "secondary": "#9a3412",
          "tertiary": "#c2410c",
          "disabled": "#fdba74"
        }
      },

      "purpleHaze": {
        "name": "Purple Haze",
        "primary": {
          "50": "#faf5ff",
          "100": "#f3e8ff", 
          "500": "#a855f7",
          "600": "#9333ea",
          "700": "#7c3aed",
          "900": "#581c87"
        },
        "background": {
          "primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "secondary": "rgba(168, 85, 247, 0.1)",
          "tertiary": "rgba(168, 85, 247, 0.15)",
          "card": "rgba(255, 255, 255, 0.15)",
          "elevated": "rgba(255, 255, 255, 0.25)"
        },
        "text": {
          "primary": "#ffffff",
          "secondary": "#e2e8f0",
          "tertiary": "#cbd5e1",
          "disabled": "#64748b"
        },
        "blur": "backdrop-filter: blur(15px)"
      }
    },

    "selectedTheme": "lightGlass",

    "semanticColors": {
      "success": "#10b981",
      "warning": "#f59e0b", 
      "error": "#ef4444",
      "info": "#3b82f6",
      "positive": "#10b981",
      "negative": "#ef4444",
      "neutral": "#6b7280",
      "highlight": "#fbbf24"
    },

    "typography": {
      "fontFamily": {
        "primary": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        "mono": "JetBrains Mono, Consolas, monospace"
      },
      "fontSize": {
        "xs": "0.75rem",
        "sm": "0.875rem", 
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem"
      },
      "fontWeight": {
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      },
      "lineHeight": {
        "tight": 1.25,
        "normal": 1.5,
        "relaxed": 1.75
      }
    },

    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "0.75rem", 
      "lg": "1rem",
      "xl": "1.5rem",
      "2xl": "2rem",
      "3xl": "3rem"
    },

    "borderRadius": {
      "none": "0",
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "full": "9999px"
    },

    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      "glow": "0 0 20px rgba(14, 165, 233, 0.3)"
    },

    "components": {
      "card": {
        "base": {
          "backgroundColor": "background.card",
          "borderRadius": "xl",
          "padding": "xl",
          "border": "1px solid rgba(255, 255, 255, 0.2)",
          "backdropFilter": "blur(10px)",
          "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.1)"
        },
        "variants": {
          "glass": {
            "backgroundColor": "background.elevated",
            "backdropFilter": "blur(15px)",
            "border": "1px solid rgba(255, 255, 255, 0.3)",
            "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.12)"
          },
          "floating": {
            "backgroundColor": "background.card",
            "boxShadow": "0 20px 40px rgba(0, 0, 0, 0.15)",
            "transform": "translateY(0)",
            "transition": "all 0.3s ease",
            "hover": {
              "transform": "translateY(-4px)",
              "boxShadow": "0 25px 50px rgba(0, 0, 0, 0.2)"
            }
          },
          "neon": {
            "backgroundColor": "background.card",
            "border": "1px solid rgba(0, 255, 136, 0.3)",
            "boxShadow": "0 0 20px rgba(0, 255, 136, 0.1)",
            "hover": {
              "boxShadow": "0 0 30px rgba(0, 255, 136, 0.2)"
            }
          }
        }
      },

      "button": {
        "base": {
          "fontFamily": "primary",
          "fontWeight": "medium",
          "borderRadius": "xl",
          "padding": "lg xl",
          "transition": "all 0.3s ease",
          "cursor": "pointer",
          "border": "none",
          "fontSize": "base",
          "position": "relative",
          "overflow": "hidden"
        },
        "variants": {
          "glassmorphism": {
            "backgroundColor": "rgba(255, 255, 255, 0.2)",
            "backdropFilter": "blur(10px)",
            "border": "1px solid rgba(255, 255, 255, 0.3)",
            "color": "text.primary",
            "hover": {
              "backgroundColor": "rgba(255, 255, 255, 0.3)",
              "transform": "translateY(-2px)",
              "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.15)"
            }
          },
          "gradient": {
            "background": "linear-gradient(135deg, primary.500, primary.700)",
            "color": "#ffffff",
            "boxShadow": "0 4px 15px rgba(0, 0, 0, 0.2)",
            "hover": {
              "transform": "translateY(-2px)",
              "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.3)"
            }
          },
          "neon": {
            "backgroundColor": "transparent",
            "border": "2px solid primary.500",
            "color": "primary.500",
            "boxShadow": "0 0 10px rgba(0, 255, 136, 0.3)",
            "hover": {
              "backgroundColor": "primary.500",
              "color": "#000000",
              "boxShadow": "0 0 20px rgba(0, 255, 136, 0.6)"
            }
          },
          "floating": {
            "backgroundColor": "background.elevated",
            "color": "text.primary",
            "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.15)",
            "hover": {
              "transform": "translateY(-3px)",
              "boxShadow": "0 15px 35px rgba(0, 0, 0, 0.2)"
            }
          }
        },
        "sizes": {
          "sm": {
            "padding": "sm md",
            "fontSize": "sm",
            "borderRadius": "lg"
          },
          "md": {
            "padding": "md lg", 
            "fontSize": "base",
            "borderRadius": "xl"
          },
          "lg": {
            "padding": "lg 2xl",
            "fontSize": "lg",
            "borderRadius": "2xl"
          }
        }
      },

      "input": {
        "base": {
          "backgroundColor": "background.secondary",
          "border": "1px solid rgba(255, 255, 255, 0.1)",
          "borderRadius": "lg",
          "padding": "lg",
          "color": "text.primary",
          "fontSize": "base",
          "transition": "all 0.2s ease",
          "outline": "none"
        },
        "states": {
          "focus": {
            "borderColor": "primary.500",
            "boxShadow": "0 0 0 3px rgba(14, 165, 233, 0.1)"
          },
          "error": {
            "borderColor": "accent.error"
          },
          "disabled": {
            "backgroundColor": "background.primary",
            "color": "text.disabled",
            "cursor": "not-allowed"
          }
        }
      },

      "badge": {
        "base": {
          "fontSize": "xs",
          "fontWeight": "medium", 
          "padding": "xs sm",
          "borderRadius": "md",
          "display": "inline-flex",
          "alignItems": "center"
        },
        "variants": {
          "success": {
            "backgroundColor": "rgba(16, 185, 129, 0.1)",
            "color": "accent.success"
          },
          "error": {
            "backgroundColor": "rgba(239, 68, 68, 0.1)",
            "color": "accent.error"
          },
          "warning": {
            "backgroundColor": "rgba(245, 158, 11, 0.1)",
            "color": "accent.warning"
          },
          "neutral": {
            "backgroundColor": "rgba(107, 114, 128, 0.1)",
            "color": "text.secondary"
          }
        }
      },

      "dataRow": {
        "base": {
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "space-between",
          "padding": "md lg",
          "borderRadius": "lg",
          "transition": "all 0.2s ease"
        },
        "variants": {
          "default": {
            "backgroundColor": "transparent",
            "hover": {
              "backgroundColor": "background.secondary"
            }
          },
          "highlighted": {
            "backgroundColor": "background.elevated",
            "border": "1px solid rgba(14, 165, 233, 0.3)"
          },
          "best": {
            "backgroundColor": "rgba(16, 185, 129, 0.05)",
            "border": "1px solid rgba(16, 185, 129, 0.2)"
          }
        }
      },

      "navigation": {
        "tab": {
          "base": {
            "padding": "md lg",
            "fontSize": "base",
            "fontWeight": "medium",
            "borderRadius": "lg",
            "transition": "all 0.2s ease",
            "cursor": "pointer"
          },
          "states": {
            "active": {
              "backgroundColor": "primary.600",
              "color": "text.primary"
            },
            "inactive": {
              "backgroundColor": "transparent",
              "color": "text.secondary",
              "hover": {
                "backgroundColor": "background.tertiary",
                "color": "text.primary"
              }
            }
          }
        }
      }
    },

    "layout": {
      "container": {
        "maxWidth": "1200px",
        "margin": "0 auto",
        "padding": "0 xl"
      },
      "grid": {
        "columns": {
          "2": "repeat(2, 1fr)",
          "3": "repeat(3, 1fr)",
          "auto": "repeat(auto-fit, minmax(300px, 1fr))"
        },
        "gap": {
          "sm": "md",
          "md": "lg", 
          "lg": "xl"
        }
      },
      "flexbox": {
        "center": {
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center"
        },
        "between": {
          "display": "flex",
          "alignItems": "center", 
          "justifyContent": "space-between"
        },
        "start": {
          "display": "flex",
          "alignItems": "flex-start"
        }
      }
    },

    "patterns": {
      "liquidityInterface": {
        "structure": "Floating card layout with glassmorphism effects",
        "mainPanel": {
          "components": ["glass input cards", "floating action buttons", "gradient overlays"],
          "layout": "centered with breathing space and soft shadows"
        },
        "routesPanel": {
          "components": ["frosted glass cards", "animated hover states", "subtle glow effects"],
          "layout": "flowing grid with smooth transitions"
        }
      },
      
      "visualEffects": {
        "glassmorphism": {
          "backdrop": "blur(10px) saturate(200%)",
          "background": "rgba(255, 255, 255, 0.2)",
          "border": "1px solid rgba(255, 255, 255, 0.3)",
          "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.1)"
        },
        "neonGlow": {
          "textShadow": "0 0 10px currentColor",
          "boxShadow": "0 0 20px currentColor",
          "animation": "pulse 2s infinite"
        },
        "floatingAnimation": {
          "transform": "translateY(0px)",
          "animation": "float 3s ease-in-out infinite",
          "keyframes": {
            "0%, 100%": "translateY(0px)",
            "50%": "translateY(-10px)"
          }
        },
        "gradientShift": {
          "background": "linear-gradient(-45deg, color1, color2, color3, color4)",
          "backgroundSize": "400% 400%",
          "animation": "gradientShift 4s ease infinite"
        }
      },

      "microInteractions": {
        "hoverLift": {
          "transform": "translateY(-4px) scale(1.02)",
          "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        },
        "pressDown": {
          "transform": "translateY(1px) scale(0.98)",
          "transition": "all 0.1s ease"
        },
        "glowPulse": {
          "animation": "glowPulse 2s ease-in-out infinite alternate"
        },
        "shimmer": {
          "background": "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          "animation": "shimmer 2s infinite"
        }
      },
      
      "dataVisualization": {
        "percentageDisplay": {
          "positive": "accent.success with + prefix",
          "negative": "accent.error with - prefix", 
          "neutral": "text.secondary"
        },
        "currencyDisplay": {
          "primary": "text.primary with medium weight",
          "secondary": "text.secondary with normal weight",
          "format": "consistent decimal places"
        }
      },

      "interactiveStates": {
        "hover": {
          "duration": "0.2s",
          "easing": "ease",
          "backgroundShift": "lighter shade",
          "borderGlow": "primary color with opacity"
        },
        "active": {
          "backgroundShift": "primary color",
          "textContrast": "high contrast text"
        },
        "disabled": {
          "opacity": "0.5",
          "cursor": "not-allowed"
        }
      },

      "spacing": {
        "componentGaps": "lg",
        "sectionGaps": "2xl", 
        "contentPadding": "xl",
        "listItemSpacing": "md"
      }
    },

    "breakpoints": {
      "mobile": "640px",
      "tablet": "768px", 
      "desktop": "1024px",
      "wide": "1280px"
    },

    "animations": {
      "duration": {
        "fast": "0.15s",
        "normal": "0.3s",
        "slow": "0.6s",
        "ultra": "1.2s"
      },
      "easing": {
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "sharp": "cubic-bezier(0.4, 0, 0.6, 1)",
        "elastic": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      },
      "keyframes": {
        "float": {
          "0%, 100%": { "transform": "translateY(0px)" },
          "50%": { "transform": "translateY(-10px)" }
        },
        "glow": {
          "0%, 100%": { "opacity": "0.5" },
          "50%": { "opacity": "1" }
        },
        "shimmer": {
          "0%": { "transform": "translateX(-100%)" },
          "100%": { "transform": "translateX(100%)" }
        },
        "gradientShift": {
          "0%": { "backgroundPosition": "0% 50%" },
          "50%": { "backgroundPosition": "100% 50%" },
          "100%": { "backgroundPosition": "0% 50%" }
        }
      }
    },

    "responsiveDesign": {
      "mobile": {
        "cardPadding": "md",
        "fontSize": "sm",
        "buttonHeight": "48px",
        "spacing": "md"
      },
      "tablet": {
        "cardPadding": "lg", 
        "fontSize": "base",
        "buttonHeight": "52px",
        "spacing": "lg"
      },
      "desktop": {
        "cardPadding": "xl",
        "fontSize": "base", 
        "buttonHeight": "56px",
        "spacing": "xl"
      }
    },

    "themeCustomization": {
      "userPreferences": {
        "backgroundIntensity": "0.1 to 1.0",
        "blurStrength": "5px to 20px", 
        "animationSpeed": "0.5x to 2x",
        "colorSaturation": "0.5 to 1.5",
        "contrastLevel": "normal | high | low"
      },
      "seasonalModes": {
        "spring": "light greens and fresh colors",
        "summer": "bright blues and warm tones",
        "autumn": "warm oranges and deep reds", 
        "winter": "cool blues and silver accents"
      },
      "accessibilityModes": {
        "highContrast": "increased text contrast ratios",
        "reducedMotion": "disabled animations and transitions",
        "largeText": "increased font sizes throughout",
        "colorBlind": "colorblind-friendly palette adjustments"
      }
    }
  }
}

json:
{
  "prediction": {
    "timeframe": "1h",
    "liquidityChange": -0.22,
    "riskScore": 0.78,
    "confidence": 0.85
  },
  "advice": "Execute 60% on Curve now, wait 40% for Uniswap in 5 minutes",
  "expectedSlippage": "0.15%",
  "expectedSavingsUSD": 640,
  "optimalRoute": [
    {"dex": "Curve", "allocation": 0.6, "status": "execute_now"},
    {"dex": "UniswapV3", "allocation": 0.4, "status": "wait_5m"}
  ],
  "riskAlerts": [
    "Whale wallet 0xWhale123 may impact Uniswap liquidity in 2 minutes",
    "Uniswap V3 slippage risk increasing"
  ]
}