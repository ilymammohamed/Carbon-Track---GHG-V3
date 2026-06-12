import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const ENTITIES = [
  { id:"eiic",      name:"EIIC — Emirates International Investment Co.", short:"EIIC",      icon:"🏦", color:"#00c6ff", sectors:["Capital Markets","Private Equity","Venture Capital"] },
  { id:"bloom",     name:"Bloom Holding",                                 short:"Bloom",     icon:"🏘️", color:"#69db7c", sectors:["Property Management","Properties","Education","Hospitality","Landscape"] },
  { id:"efi",       name:"Emirates Food Industries",                      short:"EFI",       icon:"🌾", color:"#ffa94d", sectors:["Animal Feed Production","Dairy Manufacturing","Bags Manufacturing","Farms & Milk Production","Veterinary Clinic"] },
  { id:"exeed",     name:"Exeed Industries",                              short:"Exeed",     icon:"🏗️", color:"#cc5de8", sectors:["Precast","Litecrete","Mortar"] },
  { id:"foodquest", name:"FoodQuest",                                     short:"FoodQuest", icon:"🍔", color:"#f06595", sectors:["Food & Beverage"] },
  { id:"petromal",  name:"Petromal",                                      short:"Petromal",  icon:"⛽", color:"#ff6b6b", sectors:["Upstream Oil & Gas","Downstream Oil & Gas"] },
  { id:"rise",      name:"Rise",                                          short:"Rise",      icon:"🌐", color:"#a9e34b", sectors:["General Trading","Technologies","Healthcare"] },
  { id:"nathold",   name:"National Holding (HQ)",                         short:"NatHolding",icon:"🏛️", color:"#f8c94b", sectors:["Corporate HQ — Offices Only"] },
];

const S1_CAT = [
  { id:"ng",         g:"Stationary Combustion",   name:"Natural Gas",                                unit:"m3",      ef:2.04,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"ng_proc",    g:"Stationary Combustion",   name:"Natural Gas — Industrial Process Heating",   unit:"m3",      ef:2.04,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"diesel_s",   g:"Stationary Combustion",   name:"Diesel — Generators / Boilers",             unit:"L",       ef:2.68,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"lpg_s",      g:"Stationary Combustion",   name:"LPG — Stationary (Heating / Boilers)",      unit:"L",       ef:1.51,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"lpg_cook",   g:"Stationary Combustion",   name:"LPG — Commercial Kitchen / Cooking",        unit:"L",       ef:1.51,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"hfo",        g:"Stationary Combustion",   name:"Heavy Fuel Oil",                            unit:"L",       ef:3.17,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"kero_s",     g:"Stationary Combustion",   name:"Kerosene",                                  unit:"L",       ef:2.54,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"coal",       g:"Stationary Combustion",   name:"Coal",                                      unit:"kg",      ef:2.42,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"biomass",    g:"Stationary Combustion",   name:"Biomass / Wood Pellets",                    unit:"kg",      ef:0.39,   src:"IPCC AR6 (biogenic)" },
  { id:"petrol_v",   g:"Mobile Combustion",       name:"Petrol / Gasoline — Vehicles",              unit:"L",       ef:2.31,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"diesel_v",   g:"Mobile Combustion",       name:"Diesel — Vehicles / Fleet",                 unit:"L",       ef:2.68,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"diesel_ag",  g:"Mobile Combustion",       name:"Diesel — Agricultural / Farm Machinery",    unit:"L",       ef:2.68,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"diesel_hvy", g:"Mobile Combustion",       name:"Diesel — Heavy Construction Equipment",     unit:"L",       ef:2.68,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"petrol_ls",  g:"Mobile Combustion",       name:"Petrol — Landscape / Small Engines",        unit:"L",       ef:2.31,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"cng_v",      g:"Mobile Combustion",       name:"CNG — Vehicles",                            unit:"m3",      ef:2.75,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"lpg_v",      g:"Mobile Combustion",       name:"LPG — Vehicles",                            unit:"L",       ef:1.51,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"avgas",      g:"Mobile Combustion",       name:"Aviation Fuel — Company Aircraft",          unit:"L",       ef:2.55,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"marine_do",  g:"Mobile Combustion",       name:"Marine Diesel Oil — Vessels / Offshore",    unit:"L",       ef:2.68,   src:"IPCC AR6 / IMO 4th GHG Study 2020" },
  { id:"r22",        g:"Fugitive — Refrigerants", name:"Refrigerant R-22 Leakage",                  unit:"kg",      ef:1810,   src:"IPCC AR6 GWP-100 = 1,810" },
  { id:"r134a",      g:"Fugitive — Refrigerants", name:"Refrigerant R-134a Leakage",                unit:"kg",      ef:1430,   src:"IPCC AR6 GWP-100 = 1,430" },
  { id:"r410a",      g:"Fugitive — Refrigerants", name:"Refrigerant R-410A Leakage",                unit:"kg",      ef:2088,   src:"IPCC AR6 GWP-100 = 2,088" },
  { id:"r404a",      g:"Fugitive — Refrigerants", name:"Refrigerant R-404A Leakage",                unit:"kg",      ef:3922,   src:"IPCC AR6 GWP-100 = 3,922" },
  { id:"r32",        g:"Fugitive — Refrigerants", name:"Refrigerant R-32 Leakage",                  unit:"kg",      ef:675,    src:"IPCC AR6 GWP-100 = 675" },
  { id:"r454b",      g:"Fugitive — Refrigerants", name:"Refrigerant R-454B Leakage",                unit:"kg",      ef:466,    src:"IPCC AR6 GWP-100 = 466" },
  { id:"sf6",        g:"Fugitive — Refrigerants", name:"SF6 — Electrical Switchgear",               unit:"kg",      ef:23500,  src:"IPCC AR6 GWP-100 = 23,500" },
  { id:"ch4_vent",   g:"Fugitive — Oil & Gas",    name:"Methane Venting — Wellhead / Pipeline",     unit:"kg CH4",  ef:27.9,   src:"IPCC AR6 GWP-100 CH4 = 27.9" },
  { id:"gas_flare",  g:"Fugitive — Oil & Gas",    name:"Associated Gas Flaring",                    unit:"m3 gas",  ef:1.89,   src:"IPCC AR6 / API Compendium 2023" },
  { id:"pneu_blow",  g:"Fugitive — Oil & Gas",    name:"Pneumatic Device Blowdown",                 unit:"kg CH4",  ef:27.9,   src:"EPA GHG Reporting 2023 / IPCC AR6" },
  { id:"pipe_fug",   g:"Fugitive — Oil & Gas",    name:"Pipeline Fugitive Emissions",               unit:"km/yr",   ef:580,    src:"EPA Emission Factors Hub 2023" },
  { id:"storage_fug",g:"Fugitive — Oil & Gas",    name:"Storage Tank Fugitive Emissions",           unit:"m3",      ef:0.002,  src:"API Compendium 2023" },
  { id:"ww",         g:"Process Emissions",       name:"Wastewater Treatment (on-site)",             unit:"m3",      ef:0.70,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"cement_p",   g:"Process Emissions",       name:"Cement Clinker Production (calcination)",   unit:"t clinker",ef:500,   src:"IPCC AR6 2023 (kg CO2e/t)" },
  { id:"precast_p",  g:"Process Emissions",       name:"Precast Concrete Curing (steam/autoclave)", unit:"m3",      ef:18,     src:"ecoinvent 3.10 / GHG Protocol" },
  { id:"mortar_p",   g:"Process Emissions",       name:"Dry Mortar Production (process heat)",      unit:"tonne",   ef:56,     src:"ecoinvent 3.10" },
  { id:"refinery",   g:"Process Emissions",       name:"Refinery Process Emissions",                unit:"barrel",  ef:30,     src:"API Compendium 2023" },
  { id:"enteric_d",  g:"Agriculture — Livestock", name:"Enteric Fermentation — Dairy Cattle",       unit:"head/yr", ef:1786,   src:"IPCC AR6 Tier 1: 64 kg CH4/hd x GWP100(27.9)" },
  { id:"enteric_b",  g:"Agriculture — Livestock", name:"Enteric Fermentation — Beef / Cattle",      unit:"head/yr", ef:940,    src:"IPCC AR6 Tier 1: ~33.7 kg CH4/hd x GWP100" },
  { id:"manure_c4",  g:"Agriculture — Livestock", name:"Manure Management — CH4 (dairy cattle)",    unit:"head/yr", ef:446,    src:"IPCC AR6 Tier 1: 16 kg CH4/hd x GWP100" },
  { id:"manure_n2",  g:"Agriculture — Livestock", name:"Manure Management — N2O (all cattle)",      unit:"head/yr", ef:93,     src:"IPCC AR6 Tier 1: 0.35 kg N2O/hd x GWP100" },
  { id:"fert_n",     g:"Agriculture — Soil",      name:"Synthetic N Fertilizer Application (N2O)",  unit:"kg N",    ef:4.9,    src:"IPCC AR6 Tier 1: 1% N to N2O x GWP100=273" },
  { id:"fert_urea",  g:"Agriculture — Soil",      name:"Urea Fertilizer Application (CO2 release)", unit:"kg urea", ef:0.72,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"cust_s1",    g:"Custom",                  name:"Custom Activity (enter EF manually)",        unit:"unit",    ef:0,      src:"User-defined" },
];

const S2_CAT = [
  { id:"elec_dub",  g:"Purchased Electricity", name:"Grid Electricity — Dubai (DEWA)",                           unit:"kWh", ef:0.420, src:"DEWA Carbon Footprint Report 2024" },
  { id:"elec_ad",   g:"Purchased Electricity", name:"Grid Electricity — Abu Dhabi (ADDC / AADC)",               unit:"kWh", ef:0.400, src:"ADWEC Grid Emission Factor 2024" },
  { id:"elec_taqa", g:"Purchased Electricity", name:"Grid Electricity — TAQA (Abu Dhabi / N. Emirates)",        unit:"kWh", ef:0.400, src:"TAQA / ADWEC Grid Emission Factor 2024" },
  { id:"elec_ne",   g:"Purchased Electricity", name:"Grid Electricity — Northern Emirates (SEWA / FEWA)",       unit:"kWh", ef:0.440, src:"UAE National Average 2024" },
  { id:"elec_iea",  g:"Purchased Electricity", name:"Grid Electricity — International (IEA Global Avg)",        unit:"kWh", ef:0.475, src:"IEA World Energy Outlook 2024" },
  { id:"elec_ren",  g:"Purchased Electricity", name:"Renewable Electricity — Solar / Wind (market-based zero)", unit:"kWh", ef:0.000, src:"GHG Protocol Scope 2 — zero market-based EF" },
  { id:"steam",     g:"Purchased Heat",        name:"Purchased Steam",                                          unit:"kWh", ef:0.270, src:"GHG Protocol / IPCC 2023" },
  { id:"heat_dist", g:"Purchased Heat",        name:"District Heating",                                         unit:"kWh", ef:0.220, src:"GHG Protocol / IPCC 2023" },
  { id:"cooling",   g:"Purchased Cooling",     name:"District Cooling (UAE DCS)",                               unit:"kWh", ef:0.150, src:"UAE District Cooling Average 2024" },
  { id:"cust_s2",   g:"Custom",               name:"Custom Activity (enter EF manually)",                       unit:"unit",ef:0,     src:"User-defined" },
];

const S3_CAT = [
  // ── Cat 1: Purchased Goods & Services ──────────────────────────────────────
  { id:"c1_steel",    n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Steel / Iron",                      unit:"kg",        ef:1.46,   src:"ecoinvent 3.10 / IPCC AR6 2023" },
  { id:"c1_alum",     n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Aluminium (primary)",               unit:"kg",        ef:9.95,   src:"ecoinvent 3.10" },
  { id:"c1_copper",   n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Copper",                            unit:"kg",        ef:3.30,   src:"ecoinvent 3.10" },
  { id:"c1_cement",   n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Cement",                            unit:"kg",        ef:0.92,   src:"IPCC AR6 / ecoinvent 3.10" },
  { id:"c1_concrete", n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Concrete (ready-mix)",              unit:"tonne",     ef:150,    src:"ecoinvent 3.10 / GHG Protocol 2023" },
  { id:"c1_aggregate",n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Aggregates (sand / gravel)",        unit:"tonne",     ef:5.0,    src:"ecoinvent 3.10" },
  { id:"c1_glass",    n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Glass",                             unit:"kg",        ef:0.85,   src:"ecoinvent 3.10" },
  { id:"c1_plastic",  n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Plastic (generic)",                 unit:"kg",        ef:2.53,   src:"ecoinvent 3.10 / DEFRA 2024" },
  { id:"c1_paper",    n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Paper / Cardboard",                 unit:"kg",        ef:1.09,   src:"DEFRA 2024 / ecoinvent 3.10" },
  { id:"c1_timber",   n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Timber / Wood Products",            unit:"kg",        ef:0.46,   src:"ecoinvent 3.10" },
  { id:"c1_chemical", n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Chemicals (generic average)",       unit:"kg",        ef:2.00,   src:"ecoinvent 3.10 / GHG Protocol 2023" },
  { id:"c1_food",     n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Food & Beverages (generic)",        unit:"kg",        ef:2.00,   src:"DEFRA 2024 / ecoinvent 3.10" },
  { id:"c1_it",       n:1,  g:"Cat 1 — Purchased Goods & Services", name:"IT Equipment / Electronics",        unit:"kg",        ef:30.0,   src:"ecoinvent 3.10 / GHG Protocol 2023" },
  { id:"c1_fertilizer",n:1, g:"Cat 1 — Purchased Goods & Services", name:"Fertilizer (nitrogen-based)",       unit:"kg",        ef:5.26,   src:"IPCC AR6 / ecoinvent 3.10" },
  { id:"c1_fuel_oil", n:1,  g:"Cat 1 — Purchased Goods & Services", name:"Purchased Diesel / Fuel Oil",       unit:"L",         ef:2.68,   src:"IPCC AR6 / GHG Protocol 2023" },
  // ── Cat 2: Capital Goods ────────────────────────────────────────────────────
  { id:"c2_machinery",n:2,  g:"Cat 2 — Capital Goods",              name:"Machinery / Industrial Equipment",  unit:"kg",        ef:2.80,   src:"ecoinvent 3.10 / GHG Protocol 2023" },
  { id:"c2_building", n:2,  g:"Cat 2 — Capital Goods",              name:"Building Construction",             unit:"m2",        ef:600,    src:"ecoinvent 3.10 / RICS 2023" },
  { id:"c2_vehicle",  n:2,  g:"Cat 2 — Capital Goods",              name:"Vehicles (purchased fleet)",        unit:"vehicle",   ef:8000,   src:"ecoinvent 3.10 / GHG Protocol 2023" },
  { id:"c2_hvac",     n:2,  g:"Cat 2 — Capital Goods",              name:"HVAC / Cooling Systems",            unit:"unit",      ef:500,    src:"ecoinvent 3.10" },
  { id:"c2_solar",    n:2,  g:"Cat 2 — Capital Goods",              name:"Solar PV Panels (embodied)",        unit:"kWp",       ef:1200,   src:"ecoinvent 3.10 / IRENA 2023" },
  // ── Cat 3: Fuel & Energy Related (not in S1/S2) ──────────────────────────
  { id:"c3_ng_up",    n:3,  g:"Cat 3 — Fuel & Energy Related",      name:"Upstream: Natural Gas",             unit:"m3",        ef:0.332,  src:"GHG Protocol 2023 / DEFRA 2024" },
  { id:"c3_diesel_up",n:3,  g:"Cat 3 — Fuel & Energy Related",      name:"Upstream: Diesel",                  unit:"L",         ef:0.697,  src:"GHG Protocol 2023 / DEFRA 2024" },
  { id:"c3_petrol_up",n:3,  g:"Cat 3 — Fuel & Energy Related",      name:"Upstream: Petrol / Gasoline",       unit:"L",         ef:0.593,  src:"GHG Protocol 2023 / DEFRA 2024" },
  { id:"c3_lpg_up",   n:3,  g:"Cat 3 — Fuel & Energy Related",      name:"Upstream: LPG",                     unit:"L",         ef:0.242,  src:"GHG Protocol 2023 / DEFRA 2024" },
  { id:"c3_td_loss",  n:3,  g:"Cat 3 — Fuel & Energy Related",      name:"T&D Losses — Grid Electricity UAE", unit:"kWh",       ef:0.030,  src:"ADWEC 2024 / GHG Protocol Scope 2" },
  // ── Cat 4: Upstream Transportation & Distribution ─────────────────────────
  { id:"c4_road",     n:4,  g:"Cat 4 — Upstream Transportation",    name:"Road Freight — Diesel HGV",         unit:"tonne-km",  ef:0.098,  src:"DEFRA 2024 / GHG Protocol 2023" },
  { id:"c4_sea",      n:4,  g:"Cat 4 — Upstream Transportation",    name:"Sea Freight — Container",           unit:"tonne-km",  ef:0.016,  src:"IMO / DEFRA 2024" },
  { id:"c4_air",      n:4,  g:"Cat 4 — Upstream Transportation",    name:"Air Freight",                       unit:"tonne-km",  ef:0.602,  src:"ICAO / DEFRA 2024" },
  { id:"c4_rail",     n:4,  g:"Cat 4 — Upstream Transportation",    name:"Rail Freight",                      unit:"tonne-km",  ef:0.028,  src:"DEFRA 2024 / UIC 2023" },
  // ── Cat 5: Waste Generated in Operations ─────────────────────────────────
  { id:"c5_landfill", n:5,  g:"Cat 5 — Waste in Operations",        name:"Waste — Landfill",                  unit:"tonne",     ef:467,    src:"IPCC AR6 / UAE Waste Board 2024" },
  { id:"c5_recycle",  n:5,  g:"Cat 5 — Waste in Operations",        name:"Waste — Recycling",                 unit:"tonne",     ef:21,     src:"IPCC AR6 / ecoinvent 3.10" },
  { id:"c5_incinerate",n:5, g:"Cat 5 — Waste in Operations",        name:"Waste — Incineration",              unit:"tonne",     ef:1100,   src:"IPCC AR6 / UAE Waste Board 2024" },
  { id:"c5_compost",  n:5,  g:"Cat 5 — Waste in Operations",        name:"Waste — Composting",                unit:"tonne",     ef:14,     src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"c5_ad",       n:5,  g:"Cat 5 — Waste in Operations",        name:"Waste — Anaerobic Digestion",       unit:"tonne",     ef:190,    src:"IPCC AR6 / DEFRA 2024" },
  { id:"c5_ww",       n:5,  g:"Cat 5 — Waste in Operations",        name:"Wastewater Treatment (offsite)",    unit:"m3",        ef:0.700,  src:"IPCC AR6 / GHG Protocol 2023" },
  // ── Cat 6: Business Travel ────────────────────────────────────────────────
  { id:"c6_flight_sh",n:6,  g:"Cat 6 — Business Travel",            name:"Flights — Short-haul Economy",      unit:"km",        ef:0.156,  src:"ICAO / DEFRA 2024" },
  { id:"c6_flight_lh",n:6,  g:"Cat 6 — Business Travel",            name:"Flights — Long-haul Economy",       unit:"km",        ef:0.195,  src:"ICAO / DEFRA 2024" },
  { id:"c6_flight_bc",n:6,  g:"Cat 6 — Business Travel",            name:"Flights — Business Class",          unit:"km",        ef:0.429,  src:"ICAO / DEFRA 2024" },
  { id:"c6_hotel",    n:6,  g:"Cat 6 — Business Travel",            name:"Hotel Stays",                       unit:"night",     ef:31,     src:"DEFRA 2024 / ecoinvent 3.10" },
  { id:"c6_car_rent", n:6,  g:"Cat 6 — Business Travel",            name:"Rental Car — Petrol",               unit:"km",        ef:0.192,  src:"DEFRA 2024 / GHG Protocol 2023" },
  { id:"c6_taxi",     n:6,  g:"Cat 6 — Business Travel",            name:"Taxi / Rideshare",                  unit:"km",        ef:0.149,  src:"DEFRA 2024" },
  // ── Cat 7: Employee Commuting ─────────────────────────────────────────────
  { id:"c7_car_p",    n:7,  g:"Cat 7 — Employee Commuting",         name:"Personal Car — Petrol",             unit:"km",        ef:0.192,  src:"DEFRA 2024 / GHG Protocol 2023" },
  { id:"c7_car_d",    n:7,  g:"Cat 7 — Employee Commuting",         name:"Personal Car — Diesel",             unit:"km",        ef:0.209,  src:"DEFRA 2024 / GHG Protocol 2023" },
  { id:"c7_metro",    n:7,  g:"Cat 7 — Employee Commuting",         name:"Metro / Rail",                      unit:"km",        ef:0.041,  src:"DEFRA 2024" },
  { id:"c7_bus",      n:7,  g:"Cat 7 — Employee Commuting",         name:"Bus",                               unit:"km",        ef:0.089,  src:"DEFRA 2024" },
  { id:"c7_wfh",      n:7,  g:"Cat 7 — Employee Commuting",         name:"Work From Home",                    unit:"day",       ef:0.135,  src:"DEFRA 2024 / GHG Protocol 2023" },
  // ── Cat 8: Upstream Leased Assets ────────────────────────────────────────
  { id:"c8_office",   n:8,  g:"Cat 8 — Upstream Leased Assets",    name:"Leased Office Space",               unit:"m2/yr",     ef:58,     src:"CBRE / GHG Protocol 2023" },
  { id:"c8_warehouse",n:8,  g:"Cat 8 — Upstream Leased Assets",    name:"Leased Warehouse / Storage",        unit:"m2/yr",     ef:24,     src:"GHG Protocol 2023 / ecoinvent 3.10" },
  { id:"c8_retail",   n:8,  g:"Cat 8 — Upstream Leased Assets",    name:"Leased Retail Space",               unit:"m2/yr",     ef:48,     src:"GHG Protocol 2023" },
  { id:"c8_land",     n:8,  g:"Cat 8 — Upstream Leased Assets",    name:"Leased Land / Agricultural",        unit:"ha/yr",     ef:200,    src:"IPCC AR6 / GHG Protocol 2023" },
  // ── Cat 9: Downstream Transportation & Distribution ───────────────────────
  { id:"c9_road",     n:9,  g:"Cat 9 — Downstream Transportation", name:"Road Freight — Diesel HGV",         unit:"tonne-km",  ef:0.098,  src:"DEFRA 2024 / GHG Protocol 2023" },
  { id:"c9_sea",      n:9,  g:"Cat 9 — Downstream Transportation", name:"Sea Freight — Container",           unit:"tonne-km",  ef:0.016,  src:"IMO / DEFRA 2024" },
  { id:"c9_air",      n:9,  g:"Cat 9 — Downstream Transportation", name:"Air Freight",                       unit:"tonne-km",  ef:0.602,  src:"ICAO / DEFRA 2024" },
  { id:"c9_3pl",      n:9,  g:"Cat 9 — Downstream Transportation", name:"Third-Party Logistics (3PL avg.)",  unit:"tonne-km",  ef:0.075,  src:"GHG Protocol 2023 / SmartFreightCentre" },
  // ── Cat 10: Processing of Sold Products ──────────────────────────────────
  { id:"c10_mfg",     n:10, g:"Cat 10 — Processing of Sold Products",name:"Manufacturing Energy (electricity)",unit:"kWh",      ef:0.400,  src:"ADWEC / GHG Protocol 2023" },
  { id:"c10_heat",    n:10, g:"Cat 10 — Processing of Sold Products",name:"Manufacturing Energy (heat/gas)",  unit:"m3 gas",    ef:2.04,   src:"IPCC AR6 / GHG Protocol 2023" },
  // ── Cat 11: Use of Sold Products ─────────────────────────────────────────
  { id:"c11_elec",    n:11, g:"Cat 11 — Use of Sold Products",      name:"Electricity-Consuming Products",   unit:"kWh",       ef:0.400,  src:"ADWEC / GHG Protocol 2023" },
  { id:"c11_fuel",    n:11, g:"Cat 11 — Use of Sold Products",      name:"Fuel-Consuming Products (petrol)", unit:"L",         ef:2.31,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"c11_gas",     n:11, g:"Cat 11 — Use of Sold Products",      name:"Gas-Consuming Products (NG)",      unit:"m3",        ef:2.04,   src:"IPCC AR6 / GHG Protocol 2023" },
  // ── Cat 12: End-of-Life Treatment of Sold Products ───────────────────────
  { id:"c12_landfill",n:12, g:"Cat 12 — End-of-Life Treatment",    name:"EOL — Landfill",                   unit:"tonne",     ef:467,    src:"IPCC AR6 / UAE Waste Board 2024" },
  { id:"c12_recycle", n:12, g:"Cat 12 — End-of-Life Treatment",    name:"EOL — Recycling",                  unit:"tonne",     ef:21,     src:"IPCC AR6 / ecoinvent 3.10" },
  { id:"c12_incinerate",n:12,g:"Cat 12 — End-of-Life Treatment",   name:"EOL — Incineration",               unit:"tonne",     ef:1100,   src:"IPCC AR6" },
  // ── Cat 13: Downstream Leased Assets ─────────────────────────────────────
  { id:"c13_office",  n:13, g:"Cat 13 — Downstream Leased Assets", name:"Leased Office to Tenants",         unit:"m2/yr",     ef:58,     src:"GHG Protocol 2023 / CBRE" },
  { id:"c13_retail",  n:13, g:"Cat 13 — Downstream Leased Assets", name:"Leased Retail to Tenants",         unit:"m2/yr",     ef:48,     src:"GHG Protocol 2023" },
  { id:"c13_industrial",n:13,g:"Cat 13 — Downstream Leased Assets",name:"Leased Industrial to Tenants",     unit:"m2/yr",     ef:35,     src:"GHG Protocol 2023" },
  // ── Cat 14: Franchises ────────────────────────────────────────────────────
  { id:"c14_elec",    n:14, g:"Cat 14 — Franchises",               name:"Franchise Operations — Electricity",unit:"kWh",      ef:0.400,  src:"ADWEC / GHG Protocol 2023" },
  { id:"c14_gas",     n:14, g:"Cat 14 — Franchises",               name:"Franchise Operations — Gas",       unit:"m3",        ef:2.04,   src:"IPCC AR6 / GHG Protocol 2023" },
  { id:"c14_waste",   n:14, g:"Cat 14 — Franchises",               name:"Franchise Operations — Waste",     unit:"tonne",     ef:467,    src:"IPCC AR6 / GHG Protocol 2023" },
  // ── Cat 15: Investments (Financed Emissions) ──────────────────────────────
  { id:"c15_equity",  n:15, g:"Cat 15 — Investments & Finance",    name:"Financed Emissions — Equity (PCAF)", unit:"M USD",  ef:70,     src:"PCAF Standard 2023 / GHG Protocol" },
  { id:"c15_debt",    n:15, g:"Cat 15 — Investments & Finance",    name:"Financed Emissions — Corporate Debt",unit:"M USD",  ef:50,     src:"PCAF Standard 2023 / GHG Protocol" },
  { id:"c15_project", n:15, g:"Cat 15 — Investments & Finance",    name:"Project Finance Emissions",         unit:"M USD",   ef:60,     src:"PCAF Standard 2023" },
  { id:"cust_s3",     n:15, g:"Cat 15 — Investments & Finance",    name:"Custom Activity (enter EF manually)",unit:"unit",   ef:0,      src:"User-defined" },
];

const FRAMEWORKS = ["GHG Protocol Corporate Standard","ISO 14064-1:2018","IPCC Guidelines 2006","GHG Protocol Scope 3"];
const BOUNDARIES = ["Equity Share (Financial Control)","Operational Control","Organizational Boundary (100%)"];
const TABS = ["Setup","Scope 1","Scope 2","Scope 3","Dashboard","GHG Report","Completeness","Governance"];
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const C = {
  bg:"#08111e",grad1:"#00d9ff",grad2:"#00a8ff",border:"#1a3a52",text:"#e8eef5",muted:"#8899aa",accent:"#ff6b9d",
  s1:"#00ffaa",s2:"#ffd60a",s3:"#ff006e",green:"#06d6a0",warn:"#ff9500",surface:"#0d1f33"
};

export default function CarbonTrackPro(){
  const [tab,setTab]=useState("Setup");
  const [setup,setSetup]=useState({holdingName:"National Holding Group",year:"2025",baseYear:"2022",periodStart:"01 January 2025",periodEnd:"31 December 2025",framework:FRAMEWORKS[0],boundary:BOUNDARIES[2],verificationStatus:"Not yet verified",orgDesc:"National Holding represents a diversified conglomerate operating across capital markets, real estate, food production, construction, hospitality, energy, and general trading sectors across the Middle East region.",corporateFTE:"",corporateRevenue:""});
  const PREPARED_BY="Mohamed Gibril Mohamed Elimam";
  
  const [allData,setAllData]=useState(Object.fromEntries(ENTITIES.map(e=>[e.id,{
    s1:[],s2:[],s3:[],
    name:e.name,
    shortName:e.short,
    description:"",
    fte:"",
    revenue:"",
    primarySector:e.sectors[0],
    sectors:Object.fromEntries(e.sectors.map(s=>([s,{description:"",fte:"",revenue:""}])))
  }])));
  
  const [entId,setEntId]=useState("efi");
  const [divId,setDivId]=useState("");
  const [selMonth,setSelMonth]=useState(-1);
  const [repEnt,setRepEnt]=useState("all");
  const [repLevel,setRepLevel]=useState("national");
  const [repDiv,setRepDiv]=useState("");

  const upSetup=(k,v)=>setSetup(p=>({...p,[k]:v}));
  const sumR=r=>r.reduce((a,c)=>a+(c.qty||0)*(c.ef||0)/1000,0);
  const aqty=r=>r.qty||0;
  const tco2=r=>(r.qty||0)*(r.ef||0)/1000;
  
  const MBtn=({active,children,...p})=><button {...p} style={{padding:"6px 14px",background:active?C.accent+"22":C.border+"22",border:`1px solid ${active?C.accent:C.border}`,borderRadius:6,fontSize:12,color:active?C.accent:C.muted,cursor:"pointer",fontWeight:active?600:400}}>{children}</button>;
  const Card=({children,style={}})=><div style={{padding:"18px 20px",background:"#0a1726",borderRadius:10,border:`1px solid ${C.border}`,...style}}>{children}</div>;
  const SHead=({children,color=C.accent})=><div style={{fontSize:13,fontWeight:700,color,marginBottom:12,letterSpacing:1}}>{children}</div>;
  const Label=({children,color=C.accent})=><span style={{display:"inline-block",padding:"3px 8px",background:color+"22",color,borderRadius:4,fontSize:10,fontWeight:600}}>{children}</span>;
  const Stat=({label,value,unit,color=C.text,alert=false})=><div style={{padding:"14px",background:alert?C.warn+"15":"#0a1726",border:`1px solid ${alert?C.warn:C.border}`,borderRadius:8,textAlign:"center"}}>
    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>{label}</div>
    <div style={{fontFamily:"monospace",fontSize:24,color,fontWeight:700}}>{value}</div>
    <div style={{color:C.muted,fontSize:10,marginTop:4}}>{unit}</div>
  </div>;

  const corpSum=useMemo(()=>{
    return ENTITIES.map(e=>{
      const d=allData[e.id];
      const s1=sumR(d.s1),s2=sumR(d.s2),s3=sumR(d.s3),total=s1+s2+s3;
      return {id:e.id,name:e.short,icon:e.icon,color:e.color,total,fte:d.fte||0,revenue:d.revenue||0};
    });
  },[allData]);
  const corpTot=corpSum.reduce((a,c)=>a+c.total,0);

  const handlePrint=()=>{
    setTab("GHG Report");
    setTimeout(()=>window.print(),300);
  };

  const inp={width:"100%",padding:"8px 12px",background:"#060f1b",border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:12,fontFamily:"'Barlow',sans-serif"};
  const sel={...inp,cursor:"pointer"};

  const EntBar=()=>(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Select Entity for Data Entry</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {ENTITIES.map(e=>(
          <button key={e.id} onClick={()=>{setEntId(e.id);setDivId(e.sectors[0]);}} style={{display:"flex",alignItems:"center",gap:6,
            background:entId===e.id?e.color+"22":"none",border:`1px solid ${entId===e.id?e.color:C.border}`,
            borderRadius:8,padding:"8px 14px",cursor:"pointer",color:entId===e.id?e.color:C.muted,
            fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:entId===e.id?700:400,letterSpacing:1}}>
            <span>{e.icon}</span>{e.short}
          </button>
        ))}
      </div>
    </div>
  );

  const DivBar=()=>{
    const ent=ENTITIES.find(e=>e.id===entId);
    return(
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Select Division</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {ent?.sectors.map(s=>(
            <MBtn key={s} active={divId===s} onClick={()=>setDivId(s)}>{s}</MBtn>
          ))}
        </div>
      </div>
    );
  };

  const MonthBar=()=>(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
        Entry Period {selMonth===-1?"— Full Year (quantity entered will be distributed evenly across 12 months)":"— "+MO[selMonth]+" "+setup.year+" only"}
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        <MBtn active={selMonth===-1} onClick={()=>setSelMonth(-1)}>Full Year</MBtn>
        {MO.map((m,i)=><MBtn key={m} active={selMonth===i} onClick={()=>setSelMonth(i)}>{m}</MBtn>)}
      </div>
    </div>
  );

  const addEntry=(scope,cat,qty,notes)=>{
    if(!entId||!divId||!cat||!qty)return alert("Please fill all fields");
    const newEntry={_uid:Math.random().toString(36).substr(2,9),division:divId,categoryId:cat.id,qty:parseFloat(qty),ef:cat.ef,group:cat.g,name:cat.name,unit:cat.unit,sc:{1:C.s1,2:C.s2,3:C.s3}[scope],scope,notes};
    setAllData(p=>({...p,[entId]:{...p[entId],[`s${scope}`]:[...p[entId][`s${scope}`],newEntry]}}));
  };

  const deleteEntry=(scope,uid)=>{
    setAllData(p=>({...p,[entId]:{...p[entId],[`s${scope}`]:p[entId][`s${scope}`].filter(r=>r._uid!==uid)}}));
  };

  const getReportData=()=>{
    if(repLevel==="national"){
      const allRows=Object.values(allData).flatMap(d=>[...d.s1,...d.s2,...d.s3]);
      const totalFTE=Object.values(allData).reduce((sum,d)=>sum+(parseFloat(d.fte)||0),0);
      const totalRevenue=Object.values(allData).reduce((sum,d)=>sum+(parseFloat(d.revenue)||0),0);
      return{s1:sumR(Object.values(allData).flatMap(d=>d.s1)),s2:sumR(Object.values(allData).flatMap(d=>d.s2)),s3:sumR(Object.values(allData).flatMap(d=>d.s3)),rows:allRows,fte:totalFTE,revenue:totalRevenue};
    }
    if(repLevel==="entity"){
      if(!repEnt||!allData[repEnt])return{s1:0,s2:0,s3:0,rows:[],fte:0,revenue:0};
      const allRows=[...allData[repEnt].s1,...allData[repEnt].s2,...allData[repEnt].s3];
      const divisionFTEs=Object.values(allData[repEnt].sectors).reduce((sum,d)=>sum+(parseFloat(d.fte)||0),0);
      const divisionRevenues=Object.values(allData[repEnt].sectors).reduce((sum,d)=>sum+(parseFloat(d.revenue)||0),0);
      const totalFTE=(parseFloat(allData[repEnt].fte)||0)+divisionFTEs;
      const totalRevenue=(parseFloat(allData[repEnt].revenue)||0)+divisionRevenues;
      return{s1:sumR(allData[repEnt].s1),s2:sumR(allData[repEnt].s2),s3:sumR(allData[repEnt].s3),rows:allRows,fte:totalFTE,revenue:totalRevenue};
    }
    if(repLevel==="division"){
      if(!repEnt||!allData[repEnt]||!repDiv)return{s1:0,s2:0,s3:0,rows:[],fte:0,revenue:0};
      const allRows=[...allData[repEnt].s1,...allData[repEnt].s2,...allData[repEnt].s3].filter(r=>r.division===repDiv);
      const divFTE=parseFloat(allData[repEnt].sectors[repDiv]?.fte)||0;
      const divRevenue=parseFloat(allData[repEnt].sectors[repDiv]?.revenue)||0;
      return{s1:sumR(allData[repEnt].s1.filter(r=>r.division===repDiv)),s2:sumR(allData[repEnt].s2.filter(r=>r.division===repDiv)),s3:sumR(allData[repEnt].s3.filter(r=>r.division===repDiv)),rows:allRows,fte:divFTE,revenue:divRevenue};
    }
    return{s1:0,s2:0,s3:0,rows:[],fte:0,revenue:0};
  };

  const reportData=getReportData();
  const repTotal=reportData.s1+reportData.s2+reportData.s3;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Barlow',sans-serif",
      backgroundImage:`radial-gradient(ellipse at 0% 0%,#0a2040 0%,transparent 55%),radial-gradient(ellipse at 100% 100%,#040e1c 0%,transparent 50%)`}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input,select,textarea{outline:none;transition:border-color 0.2s;}
        input:focus,select:focus,textarea:focus{border-color:${C.accent}!important;}
        ::-webkit-scrollbar{width:5px;background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        button:hover{opacity:0.85;}tr:hover td{background:${C.accent}07;}
        @media print {
          .no-print { display: none !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            background: #08111e !important;
            color: #e8eef5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #ghg-print { display: block !important; }
          #ghg-print * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          div[style] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          svg, canvas, .recharts-wrapper {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            page-break-inside: avoid;
          }
          .recharts-tooltip-wrapper { display: none !important; }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="no-print" style={{borderBottom:`1px solid ${C.border}`,background:"#060f1bee",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:16,height:56}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.grad1},${C.grad2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌍</div>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,letterSpacing:1.5,background:`linear-gradient(90deg,${C.grad1},${C.grad2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>CARBONTRACK PRO</div>
                <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>National Holding Group · GHG Management Platform · UAE</div>
              </div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              {TABS.map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 16px",background:tab===t?C.accent:C.border,borderRadius:6,color:tab===t?C.bg:C.text,border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,transition:"all 0.2s"}}>{t.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px"}}>
        {tab==="Setup"&&(
          <div>
            <SHead>Holding Information</SHead>
            <Card style={{marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Holding / Group Name</label><input type="text" defaultValue={setup.holdingName} onBlur={e=>upSetup("holdingName",e.target.value)} style={inp}/></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Reporting Year</label><input type="text" defaultValue={setup.year} onBlur={e=>upSetup("year",e.target.value)} style={inp}/></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Base Year</label><input type="text" defaultValue={setup.baseYear} onBlur={e=>upSetup("baseYear",e.target.value)} style={inp}/></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Period Start</label><input type="text" defaultValue={setup.periodStart} onBlur={e=>upSetup("periodStart",e.target.value)} style={inp}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Period End</label><input type="text" defaultValue={setup.periodEnd} onBlur={e=>upSetup("periodEnd",e.target.value)} style={inp}/></div>
                <div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Methodology & Compliance — Reporting Framework</label><select value={setup.framework} onChange={e=>upSetup("framework",e.target.value)} style={sel}>{FRAMEWORKS.map(f=><option key={f}>{f}</option>)}</select></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Organizational Boundary</label><select value={setup.boundary} onChange={e=>upSetup("boundary",e.target.value)} style={sel}>{BOUNDARIES.map(b=><option key={b}>{b}</option>)}</select></div>
              </div>
              <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Verification Status</label><select value={setup.verificationStatus} onChange={e=>upSetup("verificationStatus",e.target.value)} style={sel}><option>Not yet verified</option><option>Internally verified</option><option>Third-party verified</option></select></div>
              <div style={{marginTop:16}}><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Group Description</label><textarea defaultValue={setup.orgDesc} onBlur={e=>upSetup("orgDesc",e.target.value)} style={{...inp,height:80,resize:"none"}} /></div>
              <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:12}}>🏛️ National Holding — Corporate Level</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div>
                    <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>CORPORATE FTE (Total)</label>
                    <input type="number" defaultValue={setup.corporateFTE||""} onBlur={e=>upSetup("corporateFTE",e.target.value)} style={inp} placeholder="0"/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>CORPORATE REVENUE (M AED)</label>
                    <input type="number" defaultValue={setup.corporateRevenue||""} onBlur={e=>upSetup("corporateRevenue",e.target.value)} style={inp} placeholder="0"/>
                  </div>
                </div>
              </div>
            </Card>

            <SHead>Entity Configuration</SHead>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
              {ENTITIES.map(e=>{
                const eData=allData[e.id];
                return(
                  <Card key={e.id} style={{padding:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,fontSize:13,fontWeight:700,color:e.color}}>
                      <span style={{fontSize:18}}>{e.icon}</span>{e.short}
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>ENTITY NAME</label>
                      <input type="text" defaultValue={eData.name} onBlur={ev=>setAllData(p=>({...p,[e.id]:{...p[e.id],name:ev.target.value}}))} style={{...inp,fontSize:11}} placeholder={e.name}/>
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>PRIMARY SECTOR</label>
                      <select value={eData.primarySector} onChange={ev=>setAllData(p=>({...p,[e.id]:{...p[e.id],primarySector:ev.target.value}}))} style={{...sel,fontSize:11}}>
                        {e.sectors.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                      <div>
                        <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>FTE</label>
                        <input type="number" defaultValue={eData.fte} onBlur={ev=>setAllData(p=>({...p,[e.id]:{...p[e.id],fte:ev.target.value}}))} style={{...inp,fontSize:11}} placeholder="0"/>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>REVENUE (M)</label>
                        <input type="number" defaultValue={eData.revenue} onBlur={ev=>setAllData(p=>({...p,[e.id]:{...p[e.id],revenue:ev.target.value}}))} style={{...inp,fontSize:11}} placeholder="0"/>
                      </div>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>DESCRIPTION</label>
                      <textarea defaultValue={eData.description} onBlur={ev=>setAllData(p=>({...p,[e.id]:{...p[e.id],description:ev.target.value}}))} style={{...inp,fontSize:10,height:60,resize:"none"}} placeholder="Entity description..."/>
                    </div>
                  </Card>
                );
              })}
            </div>

            <SHead>Division Configuration</SHead>
            <Card style={{marginBottom:20}}>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>SELECT ENTITY</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                  {ENTITIES.map(e=>(
                    <button key={e.id} onClick={()=>{setEntId(e.id);setDivId("");}} style={{padding:"8px 14px",background:entId===e.id?e.color+"22":"#0a1726",border:`1px solid ${entId===e.id?e.color:C.border}`,borderRadius:6,color:entId===e.id?e.color:C.muted,cursor:"pointer",fontSize:11,fontWeight:entId===e.id?600:400}}>{e.icon} {e.short}</button>
                  ))}
                </div>
              </div>

              {/* Entity-level FTE & Revenue row */}
              {entId&&(
                <div style={{padding:12,background:"#0f1f32",borderRadius:6,marginBottom:16,border:`1px solid ${ENTITIES.find(e=>e.id===entId)?.color}44`}}>
                  <div style={{fontSize:11,fontWeight:700,color:ENTITIES.find(e=>e.id===entId)?.color,marginBottom:10}}>
                    {ENTITIES.find(e=>e.id===entId)?.icon} {ENTITIES.find(e=>e.id===entId)?.name} — Entity Level
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>ENTITY FTE</label>
                      <input type="number" defaultValue={allData[entId].fte} onBlur={ev=>setAllData(p=>({...p,[entId]:{...p[entId],fte:ev.target.value}}))} style={{...inp,fontSize:11}} placeholder="0"/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>ENTITY REVENUE (M AED)</label>
                      <input type="number" defaultValue={allData[entId].revenue} onBlur={ev=>setAllData(p=>({...p,[entId]:{...p[entId],revenue:ev.target.value}}))} style={{...inp,fontSize:11}} placeholder="0"/>
                    </div>
                  </div>
                </div>
              )}

              {/* Division selector */}
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>SELECT DIVISION</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {ENTITIES.find(e=>e.id===entId)?.sectors.map(s=>(
                    <button key={s} onClick={()=>setDivId(s)} style={{padding:"8px 14px",background:divId===s?C.accent+"22":"#0a1726",border:`1px solid ${divId===s?C.accent:C.border}`,borderRadius:6,color:divId===s?C.accent:C.muted,cursor:"pointer",fontSize:11,fontWeight:divId===s?600:400}}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Division-level fields */}
              {divId&&(
                <div style={{padding:12,background:"#0a1f30",borderRadius:6,marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.accent,marginBottom:10}}>Division: {divId}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    <div>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>DIVISION FTE</label>
                      <input type="number" defaultValue={allData[entId].sectors[divId].fte} onBlur={ev=>setAllData(p=>({...p,[entId]:{...p[entId],sectors:{...p[entId].sectors,[divId]:{...p[entId].sectors[divId],fte:ev.target.value}}}}))} style={{...inp,fontSize:11}} placeholder="0"/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>DIVISION REVENUE (M AED)</label>
                      <input type="number" defaultValue={allData[entId].sectors[divId].revenue} onBlur={ev=>setAllData(p=>({...p,[entId]:{...p[entId],sectors:{...p[entId].sectors,[divId]:{...p[entId].sectors[divId],revenue:ev.target.value}}}}))} style={{...inp,fontSize:11}} placeholder="0"/>
                    </div>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>DESCRIPTION</label>
                    <textarea defaultValue={allData[entId].sectors[divId].description} onBlur={ev=>setAllData(p=>({...p,[entId]:{...p[entId],sectors:{...p[entId].sectors,[divId]:{...p[entId].sectors[divId],description:ev.target.value}}}}))} style={{...inp,fontSize:10,height:70,resize:"none"}} placeholder="Division description..."/>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,fontSize:11,color:C.muted}}>
                <div>
                  <div style={{fontWeight:600,color:C.accent,marginBottom:8}}>REPORT PREPARATION</div>
                  <div style={{fontWeight:600,color:C.text}}>Prepared and Generated by:</div>
                  <div style={{fontSize:12,color:C.text,fontWeight:700}}>{PREPARED_BY}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:600,color:C.accent,marginBottom:8}}>DOCUMENT INFORMATION</div>
                  <div>Framework: {setup.framework}</div>
                  <div>Boundary: {setup.boundary}</div>
                  <div>Verification: {setup.verificationStatus}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {tab==="Scope 1"&&(
          <div>
            <SHead>Scope 1 – Direct Emissions</SHead>
            <EntBar/>
            <DivBar/>
            <MonthBar/>
            <Card style={{marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Select Category</label><select id="s1cat" style={sel}><option value="">Select...</option>{S1_CAT.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Quantity</label><input type="number" id="s1qty" placeholder="0.00" style={inp}/></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Notes</label><input type="text" id="s1notes" placeholder="Optional" style={inp}/></div>
              </div>
              <button onClick={()=>{const s=document.getElementById("s1cat"),q=document.getElementById("s1qty"),n=document.getElementById("s1notes");if(s.value){const c=S1_CAT.find(x=>x.id===s.value);addEntry(1,c,q.value||0,n.value);s.value="";q.value="";n.value="";}}} style={{width:"100%",padding:"10px",background:C.s1,color:C.bg,border:"none",borderRadius:6,fontWeight:700,cursor:"pointer"}}>Add Scope 1 Entry</button>
            </Card>
            <Card>
              {allData[entId]?.s1.length>0?(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{borderBottom:`1px solid ${C.border}`}}><th style={{padding:"8px",textAlign:"left",color:C.muted}}>Division</th><th style={{padding:"8px",textAlign:"left",color:C.muted}}>Activity</th><th style={{padding:"8px",textAlign:"right",color:C.muted}}>Qty</th><th style={{padding:"8px",textAlign:"right",color:C.muted}}>t CO2e</th><th style={{padding:"8px",textAlign:"center",color:C.muted}}>Action</th></tr></thead>
                    <tbody>{allData[entId].s1.map(r=><tr key={r._uid} style={{borderBottom:`1px solid ${C.border}22`}}><td style={{padding:"8px"}}>{r.division}</td><td style={{padding:"8px"}}>{r.name}</td><td style={{padding:"8px",textAlign:"right",fontFamily:"monospace"}}>{aqty(r)}</td><td style={{padding:"8px",textAlign:"right",fontFamily:"monospace",fontWeight:700,color:C.s1}}>{tco2(r).toFixed(4)}</td><td style={{padding:"8px",textAlign:"center"}}><button onClick={()=>deleteEntry(1,r._uid)} style={{padding:"4px 8px",background:C.warn,color:C.bg,border:"none",borderRadius:4,fontSize:10,cursor:"pointer"}}>Delete</button></td></tr>)}</tbody>
                  </table>
                </div>
              ):<div style={{textAlign:"center",color:C.muted,padding:"20px"}}>No entries yet</div>}
            </Card>
          </div>
        )}

        {tab==="Scope 2"&&(
          <div>
            <SHead>Scope 2 – Indirect Emissions (Purchased Energy)</SHead>
            <EntBar/>
            <DivBar/>
            <MonthBar/>
            <Card style={{marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Select Category</label><select id="s2cat" style={sel}><option value="">Select...</option>{S2_CAT.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Quantity</label><input type="number" id="s2qty" placeholder="0.00" style={inp}/></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Notes</label><input type="text" id="s2notes" placeholder="Optional" style={inp}/></div>
              </div>
              <button onClick={()=>{const s=document.getElementById("s2cat"),q=document.getElementById("s2qty"),n=document.getElementById("s2notes");if(s.value){const c=S2_CAT.find(x=>x.id===s.value);addEntry(2,c,q.value||0,n.value);s.value="";q.value="";n.value="";}}} style={{width:"100%",padding:"10px",background:C.s2,color:C.bg,border:"none",borderRadius:6,fontWeight:700,cursor:"pointer"}}>Add Scope 2 Entry</button>
            </Card>
            <Card>
              {allData[entId]?.s2.length>0?(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{borderBottom:`1px solid ${C.border}`}}><th style={{padding:"8px",textAlign:"left",color:C.muted}}>Division</th><th style={{padding:"8px",textAlign:"left",color:C.muted}}>Activity</th><th style={{padding:"8px",textAlign:"right",color:C.muted}}>Qty</th><th style={{padding:"8px",textAlign:"right",color:C.muted}}>t CO2e</th><th style={{padding:"8px",textAlign:"center",color:C.muted}}>Action</th></tr></thead>
                    <tbody>{allData[entId].s2.map(r=><tr key={r._uid} style={{borderBottom:`1px solid ${C.border}22`}}><td style={{padding:"8px"}}>{r.division}</td><td style={{padding:"8px"}}>{r.name}</td><td style={{padding:"8px",textAlign:"right",fontFamily:"monospace"}}>{aqty(r)}</td><td style={{padding:"8px",textAlign:"right",fontFamily:"monospace",fontWeight:700,color:C.s2}}>{tco2(r).toFixed(4)}</td><td style={{padding:"8px",textAlign:"center"}}><button onClick={()=>deleteEntry(2,r._uid)} style={{padding:"4px 8px",background:C.warn,color:C.bg,border:"none",borderRadius:4,fontSize:10,cursor:"pointer"}}>Delete</button></td></tr>)}</tbody>
                  </table>
                </div>
              ):<div style={{textAlign:"center",color:C.muted,padding:"20px"}}>No entries yet</div>}
            </Card>
          </div>
        )}

        {tab==="Scope 3"&&(
          <div>
            <SHead>Scope 3 – Indirect Emissions (Value Chain)</SHead>
            <EntBar/>
            <DivBar/>
            <MonthBar/>
            <Card style={{marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Select Category</label><select id="s3cat" style={sel}><option value="">Select...</option>{S3_CAT.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Quantity</label><input type="number" id="s3qty" placeholder="0.00" style={inp}/></div>
                <div><label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Notes</label><input type="text" id="s3notes" placeholder="Optional" style={inp}/></div>
              </div>
              <button onClick={()=>{const s=document.getElementById("s3cat"),q=document.getElementById("s3qty"),n=document.getElementById("s3notes");if(s.value){const c=S3_CAT.find(x=>x.id===s.value);addEntry(3,c,q.value||0,n.value);s.value="";q.value="";n.value="";}}} style={{width:"100%",padding:"10px",background:C.s3,color:C.bg,border:"none",borderRadius:6,fontWeight:700,cursor:"pointer"}}>Add Scope 3 Entry</button>
            </Card>
            <Card>
              {allData[entId]?.s3.length>0?(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{borderBottom:`1px solid ${C.border}`}}><th style={{padding:"8px",textAlign:"left",color:C.muted}}>Division</th><th style={{padding:"8px",textAlign:"left",color:C.muted}}>Activity</th><th style={{padding:"8px",textAlign:"right",color:C.muted}}>Qty</th><th style={{padding:"8px",textAlign:"right",color:C.muted}}>t CO2e</th><th style={{padding:"8px",textAlign:"center",color:C.muted}}>Action</th></tr></thead>
                    <tbody>{allData[entId].s3.map(r=><tr key={r._uid} style={{borderBottom:`1px solid ${C.border}22`}}><td style={{padding:"8px"}}>{r.division}</td><td style={{padding:"8px"}}>{r.name}</td><td style={{padding:"8px",textAlign:"right",fontFamily:"monospace"}}>{aqty(r)}</td><td style={{padding:"8px",textAlign:"right",fontFamily:"monospace",fontWeight:700,color:C.s3}}>{tco2(r).toFixed(4)}</td><td style={{padding:"8px",textAlign:"center"}}><button onClick={()=>deleteEntry(3,r._uid)} style={{padding:"4px 8px",background:C.warn,color:C.bg,border:"none",borderRadius:4,fontSize:10,cursor:"pointer"}}>Delete</button></td></tr>)}</tbody>
                  </table>
                </div>
              ):<div style={{textAlign:"center",color:C.muted,padding:"20px"}}>No entries yet</div>}
            </Card>
          </div>
        )}

        {tab==="Dashboard"&&(
          <div>
            <SHead>Emissions Dashboard</SHead>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
              <Stat label="Scope 1" value={corpSum.reduce((a,c)=>a+sumR(allData[c.id].s1),0).toFixed(2)} unit="t CO2e" color={C.s1}/>
              <Stat label="Scope 2" value={corpSum.reduce((a,c)=>a+sumR(allData[c.id].s2),0).toFixed(2)} unit="t CO2e" color={C.s2}/>
              <Stat label="Scope 3" value={corpSum.reduce((a,c)=>a+sumR(allData[c.id].s3),0).toFixed(2)} unit="t CO2e" color={C.s3}/>
              <Stat label="Total" value={corpTot.toFixed(2)} unit="t CO2e" color={C.accent}/>
            </div>
            <Card style={{marginBottom:20}}>
              <SHead>Entity Breakdown</SHead>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={corpSum}>
                  <CartesianGrid stroke={C.border}/>
                  <XAxis dataKey="name" stroke={C.muted}/>
                  <YAxis stroke={C.muted}/>
                  <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`}}/>
                  <Bar dataKey="total" fill={C.accent}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {tab==="GHG Report"&&(
          <div>
            {/* Report Config - NOT printed */}
            <div className="no-print">
            <Card style={{marginBottom:20}}>
              <SHead>Report Configuration</SHead>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
                <div>
                  <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Report Level</label>
                  <select value={repLevel} onChange={e=>setRepLevel(e.target.value)} style={sel}>
                    <option value="national">National Holding</option>
                    <option value="entity">By Entity</option>
                    <option value="division">By Division</option>
                  </select>
                </div>
                {repLevel!=="national"&&(
                  <div>
                    <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Select Entity</label>
                    <select value={repEnt} onChange={e=>{setRepEnt(e.target.value);setRepDiv("");}} style={sel}>
                      <option value="">Select...</option>
                      {ENTITIES.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                )}
                {repLevel==="division"&&repEnt&&(
                  <div>
                    <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6}}>Select Division</label>
                    <select value={repDiv} onChange={e=>setRepDiv(e.target.value)} style={sel}>
                      <option value="">Select...</option>
                      {ENTITIES.find(e=>e.id===repEnt)?.sectors.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <button onClick={handlePrint} style={{width:"100%",padding:"12px",background:C.accent,color:C.bg,border:"none",borderRadius:6,fontWeight:700,cursor:"pointer",fontSize:13}}>🖨️ Print / Export PDF</button>
            </Card>
            </div>

            {/* PRINTABLE REPORT */}
            <div id="ghg-print">

              {/* Cover Header */}
              <Card style={{marginBottom:20,background:"linear-gradient(135deg,#0a1f35,#0d2a45)",borderColor:C.accent}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:10,color:C.accent,letterSpacing:3,fontWeight:700,marginBottom:8}}>GREENHOUSE GAS EMISSIONS REPORT</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:C.text,marginBottom:6}}>
                      {repLevel==="national"?setup.holdingName:repLevel==="entity"&&repEnt?allData[repEnt]?.name||ENTITIES.find(e=>e.id===repEnt)?.name:repDiv||"—"}
                    </div>
                    <div style={{fontSize:12,color:C.muted,marginBottom:4}}>
                      {repLevel==="division"&&repEnt?`Division of ${allData[repEnt]?.name||ENTITIES.find(e=>e.id===repEnt)?.name}`:""}
                    </div>
                    <div style={{fontSize:11,color:C.muted}}>Reporting Period: {setup.periodStart} — {setup.periodEnd}</div>
                    <div style={{fontSize:11,color:C.muted}}>Framework: {setup.framework}</div>
                    <div style={{fontSize:11,color:C.muted}}>Boundary: {setup.boundary}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:32,marginBottom:8}}>🌍</div>
                    <div style={{fontSize:9,color:C.muted,letterSpacing:2}}>CARBONTRACK PRO</div>
                    <div style={{fontSize:9,color:C.muted}}>v1.0 · UAE</div>
                  </div>
                </div>
              </Card>

              {/* Executive Summary + Description */}
              <Card style={{marginBottom:20}}>
                <SHead>Executive Summary</SHead>
                {repLevel==="national"&&setup.orgDesc&&(
                  <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:12}}>{setup.orgDesc}</p>
                )}
                {repLevel==="entity"&&repEnt&&allData[repEnt]?.description&&(
                  <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:12}}>{allData[repEnt].description}</p>
                )}
                {repLevel==="division"&&repEnt&&repDiv&&allData[repEnt]?.sectors[repDiv]?.description&&(
                  <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:12}}>{allData[repEnt].sectors[repDiv].description}</p>
                )}

                {/* Key Metrics */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
                  <div style={{padding:14,background:"#0a1726",borderRadius:8,borderLeft:`4px solid ${C.s1}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>SCOPE 1 — DIRECT</div>
                    <div style={{fontFamily:"monospace",fontSize:22,color:C.s1,fontWeight:700}}>{reportData.s1.toFixed(2)}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e</div>
                  </div>
                  <div style={{padding:14,background:"#0a1726",borderRadius:8,borderLeft:`4px solid ${C.s2}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>SCOPE 2 — INDIRECT</div>
                    <div style={{fontFamily:"monospace",fontSize:22,color:C.s2,fontWeight:700}}>{reportData.s2.toFixed(2)}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e</div>
                  </div>
                  <div style={{padding:14,background:"#0a1726",borderRadius:8,borderLeft:`4px solid ${C.s3}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>SCOPE 3 — VALUE CHAIN</div>
                    <div style={{fontFamily:"monospace",fontSize:22,color:C.s3,fontWeight:700}}>{reportData.s3.toFixed(2)}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                  <div style={{padding:14,background:"#0a1726",borderRadius:8,borderLeft:`4px solid ${C.accent}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>TOTAL EMISSIONS</div>
                    <div style={{fontFamily:"monospace",fontSize:22,color:C.accent,fontWeight:700}}>{(reportData.s1+reportData.s2+reportData.s3).toFixed(2)}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e</div>
                  </div>
                  <div style={{padding:14,background:"#0a1726",borderRadius:8,borderLeft:`4px solid ${C.grad1}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>TOTAL FTE</div>
                    <div style={{fontFamily:"monospace",fontSize:22,color:C.grad1,fontWeight:700}}>{Math.round(reportData.fte)}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>employees</div>
                  </div>
                  <div style={{padding:14,background:"#0a1726",borderRadius:8,borderLeft:`4px solid ${C.green}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:10,letterSpacing:1,marginBottom:6}}>TOTAL REVENUE</div>
                    <div style={{fontFamily:"monospace",fontSize:22,color:C.green,fontWeight:700}}>{reportData.revenue.toFixed(1)}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>M AED</div>
                  </div>
                </div>
              </Card>

              {/* Charts */}
              {reportData.rows.length>0&&(
                <Card style={{marginBottom:20}}>
                  <SHead>Emissions Distribution</SHead>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>By Scope</div>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={[{name:"Scope 1",value:reportData.s1},{name:"Scope 2",value:reportData.s2},{name:"Scope 3",value:reportData.s3}].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                            {[C.s1,C.s2,C.s3].map((color,i)=><Cell key={i} fill={color}/>)}
                          </Pie>
                          <Tooltip formatter={(v)=>`${v.toFixed(2)} t CO2e`} contentStyle={{background:"#0a1726",border:`1px solid ${C.border}`,fontSize:11}}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>Scope Comparison (t CO2e)</div>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={[{name:"Scope 1",value:reportData.s1,fill:C.s1},{name:"Scope 2",value:reportData.s2,fill:C.s2},{name:"Scope 3",value:reportData.s3,fill:C.s3}]}>
                          <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
                          <XAxis dataKey="name" stroke={C.muted} fontSize={10}/>
                          <YAxis stroke={C.muted} fontSize={10}/>
                          <Tooltip formatter={(v)=>`${v.toFixed(2)} t CO2e`} contentStyle={{background:"#0a1726",border:`1px solid ${C.border}`,fontSize:11}}/>
                          <Bar dataKey="value" radius={[4,4,0,0]}>
                            {[C.s1,C.s2,C.s3].map((color,i)=><Cell key={i} fill={color}/>)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              )}

              {/* Detailed Records */}
              {reportData.rows.length>0&&(
                <Card style={{marginBottom:20}}>
                  <SHead>Detailed Emissions Data</SHead>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead>
                        <tr style={{borderBottom:`1px solid ${C.border}`,background:"#0a1726"}}>
                          <th style={{padding:"8px",textAlign:"left",color:C.muted,fontWeight:600}}>Scope</th>
                          <th style={{padding:"8px",textAlign:"left",color:C.muted,fontWeight:600}}>Division</th>
                          <th style={{padding:"8px",textAlign:"left",color:C.muted,fontWeight:600}}>Activity</th>
                          <th style={{padding:"8px",textAlign:"right",color:C.muted,fontWeight:600}}>Quantity</th>
                          <th style={{padding:"8px",textAlign:"right",color:C.muted,fontWeight:600}}>Unit</th>
                          <th style={{padding:"8px",textAlign:"right",color:C.muted,fontWeight:600}}>EF</th>
                          <th style={{padding:"8px",textAlign:"right",color:C.muted,fontWeight:600}}>t CO2e</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.rows.map(r=>(
                          <tr key={r._uid} style={{borderBottom:`1px solid ${C.border}22`}}>
                            <td style={{padding:"8px"}}><Label color={r.sc}>S{r.scope}</Label></td>
                            <td style={{padding:"8px",color:C.muted,fontSize:10}}>{r.division}</td>
                            <td style={{padding:"8px",color:C.text}}>{r.name}</td>
                            <td style={{padding:"8px",textAlign:"right",fontFamily:"monospace"}}>{aqty(r).toLocaleString()}</td>
                            <td style={{padding:"8px",textAlign:"right",color:C.muted,fontSize:10}}>{r.unit}</td>
                            <td style={{padding:"8px",textAlign:"right",fontFamily:"monospace",color:C.muted}}>{r.ef}</td>
                            <td style={{padding:"8px",textAlign:"right",fontFamily:"monospace",fontWeight:700,color:r.sc}}>{tco2(r).toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* KPIs */}
              <Card style={{marginBottom:20}}>
                <SHead>Carbon Intensity KPIs</SHead>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
                  <div style={{padding:14,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.accent}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Emissions Intensity / Employee</div>
                    <div style={{fontFamily:"monospace",fontSize:20,color:C.accent,fontWeight:700}}>{reportData.fte>0?(repTotal/reportData.fte).toFixed(3):"—"}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e / FTE</div>
                  </div>
                  <div style={{padding:14,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.s2}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Emissions Intensity / Revenue</div>
                    <div style={{fontFamily:"monospace",fontSize:20,color:C.s2,fontWeight:700}}>{reportData.revenue>0?(repTotal/reportData.revenue).toFixed(3):"—"}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e / M AED</div>
                  </div>
                  <div style={{padding:14,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.s1}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Scope 1 Intensity / Employee</div>
                    <div style={{fontFamily:"monospace",fontSize:20,color:C.s1,fontWeight:700}}>{reportData.fte>0?(reportData.s1/reportData.fte).toFixed(3):"—"}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e / FTE</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                  <div style={{padding:14,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.s2}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Scope 2 Intensity / Employee</div>
                    <div style={{fontFamily:"monospace",fontSize:20,color:C.s2,fontWeight:700}}>{reportData.fte>0?(reportData.s2/reportData.fte).toFixed(3):"—"}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e / FTE</div>
                  </div>
                  <div style={{padding:14,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.s3}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Scope 3 Intensity / Revenue</div>
                    <div style={{fontFamily:"monospace",fontSize:20,color:C.s3,fontWeight:700}}>{reportData.revenue>0?(reportData.s3/reportData.revenue).toFixed(3):"—"}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>t CO2e / M AED</div>
                  </div>
                  <div style={{padding:14,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.green}`,textAlign:"center"}}>
                    <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Revenue per t CO2e</div>
                    <div style={{fontFamily:"monospace",fontSize:20,color:C.green,fontWeight:700}}>{repTotal>0?(reportData.revenue/repTotal).toFixed(3):"—"}</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:4}}>M AED / t CO2e</div>
                  </div>
                </div>
              </Card>

              <Card style={{marginBottom:20}}>
                <SHead>Energy & Waste KPIs</SHead>
                {(()=>{
                  const allRows=reportData.rows;
                  const elecKwh=allRows.filter(r=>r.scope===2&&["elec_dub","elec_ad","elec_taqa","elec_ne","elec_iea"].includes(r.categoryId)).reduce((s,r)=>s+(r.qty||0),0);
                  const renKwh=allRows.filter(r=>r.scope===2&&r.categoryId==="elec_ren").reduce((s,r)=>s+(r.qty||0),0);
                  const totalKwh=elecKwh+renKwh;
                  const wasteTotal=allRows.filter(r=>r.scope===3&&r.categoryId&&r.categoryId.startsWith("c5_")).reduce((s,r)=>s+(r.qty||0),0);
                  const wasteRecycled=allRows.filter(r=>r.scope===3&&r.categoryId==="c5_recycle").reduce((s,r)=>s+(r.qty||0),0);
                  const waterM3=allRows.filter(r=>r.scope===3&&r.categoryId==="c5_ww").reduce((s,r)=>s+(r.qty||0),0);
                  const recycleRate=wasteTotal>0?((wasteRecycled/wasteTotal)*100).toFixed(1):"—";
                  const energyPerFTE=reportData.fte>0&&totalKwh>0?(totalKwh/reportData.fte).toFixed(0):"—";
                  const energyPerRev=reportData.revenue>0&&totalKwh>0?(totalKwh/reportData.revenue).toFixed(0):"—";
                  return(
                    <div>
                      <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:10}}>Energy</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.s2}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Total Electricity</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.s2,fontWeight:700}}>{totalKwh>0?totalKwh.toLocaleString():"—"}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>kWh</div>
                        </div>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.green}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Renewable Share</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.green,fontWeight:700}}>{totalKwh>0?((renKwh/totalKwh)*100).toFixed(1)+"%" :"—"}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>of total kWh</div>
                        </div>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.grad1}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Energy / Employee</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.grad1,fontWeight:700}}>{energyPerFTE}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>kWh / FTE</div>
                        </div>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.accent}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Energy / Revenue</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.accent,fontWeight:700}}>{energyPerRev}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>kWh / M AED</div>
                        </div>
                      </div>
                      <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:10}}>Waste</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.warn}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Total Waste</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.warn,fontWeight:700}}>{wasteTotal>0?wasteTotal.toLocaleString():"—"}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>tonnes</div>
                        </div>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.green}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Recycling Rate</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.green,fontWeight:700}}>{recycleRate}{recycleRate!=="—"?"%":""}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>of total waste</div>
                        </div>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.s3}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Waste / Employee</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.s3,fontWeight:700}}>{wasteTotal>0&&reportData.fte>0?(wasteTotal/reportData.fte).toFixed(2):"—"}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>t / FTE</div>
                        </div>
                        <div style={{padding:12,background:"#060f1b",borderRadius:8,borderLeft:`4px solid ${C.grad1}`,textAlign:"center"}}>
                          <div style={{color:C.muted,fontSize:9,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Water (Wastewater)</div>
                          <div style={{fontFamily:"monospace",fontSize:18,color:C.grad1,fontWeight:700}}>{waterM3>0?waterM3.toLocaleString():"—"}</div>
                          <div style={{color:C.muted,fontSize:10,marginTop:2}}>m³</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>

              {/* Footer */}
              <Card style={{marginBottom:0}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,fontSize:11,color:C.muted}}>
                  <div>
                    <div style={{fontWeight:700,color:C.accent,marginBottom:6,letterSpacing:1}}>REPORT PREPARATION</div>
                    <div style={{marginBottom:4}}>Prepared and Generated by:</div>
                    <div style={{fontSize:13,color:C.text,fontWeight:700}}>{PREPARED_BY}</div>
                    <div style={{marginTop:6,fontSize:10}}>Date: {new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"})}</div>
                    <div style={{fontSize:10}}>System: CarbonTrack Pro v1.0</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:700,color:C.accent,marginBottom:6,letterSpacing:1}}>DOCUMENT INFORMATION</div>
                    <div>Framework: {setup.framework}</div>
                    <div>Boundary: {setup.boundary}</div>
                    <div>Verification: {setup.verificationStatus}</div>
                    <div style={{marginTop:6,fontSize:10}}>Base Year: {setup.baseYear}</div>
                  </div>
                </div>
                <div style={{marginTop:16,padding:12,background:C.border+"22",borderRadius:6,fontSize:10,color:C.muted,borderLeft:`3px solid ${C.accent}`,fontStyle:"italic"}}>
                  <strong style={{color:C.text}}>Confidentiality Notice:</strong> This report contains proprietary greenhouse gas emissions data prepared in accordance with {setup.framework}. Intended for internal stakeholder review and regulatory compliance. Unauthorized distribution is prohibited.
                </div>
                <div style={{marginTop:12,padding:12,background:"#0a1426",borderRadius:6,fontSize:10,color:C.muted,lineHeight:1.7}}>
                  <strong style={{color:C.accent}}>Disclaimer:</strong> Emission factors sourced from IPCC AR6, GHG Protocol 2023, DEFRA 2024, DEWA/ADWEC/TAQA 2024, ecoinvent 3.10, API Compendium 2023, and UAE-specific regulatory sources. All values in tonnes of CO2 equivalent (t CO2e) using GWP-100 from IPCC Sixth Assessment Report (AR6). {setup.verificationStatus}.
                </div>
              </Card>

            </div>
          </div>
        )}

        {tab==="Completeness"&&(
          <div>
            <SHead>GHG Scope Applicability Matrix — Reporting Year {setup.year}</SHead>
            <Card style={{marginBottom:16,padding:"12px 16px",background:"#0a1726"}}>
              <div style={{fontSize:11,color:C.muted,lineHeight:1.8}}>
                This matrix documents which emission sources are applicable to each entity under the <strong style={{color:C.text}}>{setup.boundary}</strong> consolidation approach.
                Sources marked <span style={{color:C.s1,fontWeight:700}}>✅</span> are present and reported. <span style={{color:C.muted,fontWeight:700}}>N/A</span> indicates the source is not applicable to that entity's operations.
              </div>
            </Card>
            {(()=>{
              const matrix=[
                {scope:"Scope 1",cat:"—",source:"Mobile Combustion — Diesel (vehicles, machinery, generators)",ef:"2.68 kg CO2e/L",ref:"IPCC AR6 / GHG Protocol 2023",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 1",cat:"—",source:"Mobile Combustion — Petrol (company cars)",ef:"2.31 kg CO2e/L",ref:"IPCC AR6 / GHG Protocol 2023",entities:{efi:false,bloom:true,eiic:true,exeed:false,foodquest:false,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 1",cat:"—",source:"Stationary Combustion — Natural Gas (process, kitchens, boilers)",ef:"2.04 kg CO2e/m3",ref:"IPCC AR6 / GHG Protocol 2023",entities:{efi:true,bloom:true,eiic:false,exeed:true,foodquest:true,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Stationary Combustion — LPG (kitchens, pantry, process)",ef:"1.51 kg CO2e/L",ref:"IPCC AR6 / GHG Protocol 2023",entities:{efi:true,bloom:true,eiic:true,exeed:false,foodquest:true,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 1",cat:"—",source:"Fugitive — Refrigerant R-404A (cold chain / dairy)",ef:"3,922 GWP-100",ref:"IPCC AR6",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:true,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Fugitive — Refrigerant R-410A (HVAC / AC)",ef:"2,088 GWP-100",ref:"IPCC AR6",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 1",cat:"—",source:"Fugitive — Refrigerant R-22 (legacy HVAC)",ef:"1,810 GWP-100",ref:"IPCC AR6",entities:{efi:false,bloom:true,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Fugitive — Refrigerant R-32 (split AC)",ef:"675 GWP-100",ref:"IPCC AR6",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Fugitive — Refrigerant R-134a (medical / oil & gas cooling)",ef:"1,430 GWP-100",ref:"IPCC AR6",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:true,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Fugitive — SF6 (electrical switchgear)",ef:"23,500 GWP-100",ref:"IPCC AR6",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Livestock — Enteric Fermentation (dairy cattle)",ef:"1,786 kg CO2e/head/yr",ref:"IPCC AR6 Tier 1",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Livestock — Manure Management CH4",ef:"446 kg CO2e/head/yr",ref:"IPCC AR6 Tier 1",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Livestock — Manure Management N2O",ef:"93 kg CO2e/head/yr",ref:"IPCC AR6 Tier 1",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Agricultural — Synthetic N Fertilizer (N2O)",ef:"4.9 kg CO2e/kg N",ref:"IPCC AR6 Tier 1",entities:{efi:true,bloom:true,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Agricultural — Urea Fertilizer (CO2 release)",ef:"0.72 kg CO2e/kg urea",ref:"IPCC AR6 / GHG Protocol 2023",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Process — Precast Concrete Curing (steam / autoclave)",ef:"18 kg CO2e/m3",ref:"ecoinvent 3.10",entities:{efi:false,bloom:false,eiic:false,exeed:true,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Process — Dry Mortar Production (process heat)",ef:"56 kg CO2e/tonne",ref:"ecoinvent 3.10",entities:{efi:false,bloom:false,eiic:false,exeed:true,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Process — Associated Gas Flaring",ef:"1.89 kg CO2e/m3",ref:"API Compendium 2023",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Process — Methane Venting (wellhead / pipeline)",ef:"27.9 kg CO2e/kg CH4",ref:"IPCC AR6 GWP-100",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Process — Pipeline Fugitive Emissions",ef:"580 kg CO2e/km",ref:"EPA Emission Factors Hub 2023",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 1",cat:"—",source:"Process — Refinery Process Emissions",ef:"30 kg CO2e/barrel",ref:"API Compendium 2023",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 2",cat:"—",source:"Purchased Electricity — Abu Dhabi (ADDC / AADC) — Location-Based",ef:"0.40 kg CO2e/kWh",ref:"ADWEC Grid EF 2024",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 2",cat:"—",source:"Purchased Electricity — Dubai (DEWA) — Location-Based",ef:"0.42 kg CO2e/kWh",ref:"DEWA Carbon Footprint 2024",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:true,petromal:false,rise:true,nathold:false}},
                {scope:"Scope 2",cat:"—",source:"Purchased Electricity — Market-Based (UAE Residual Mix)",ef:"0.45 kg CO2e/kWh",ref:"UAE Residual Mix EF 2024",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 2",cat:"—",source:"Purchased District Cooling",ef:"0.15 kg CO2e/kWh",ref:"UAE DCS Average 2024",entities:{efi:false,bloom:true,eiic:true,exeed:false,foodquest:false,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Goods — Animal Feed Raw Materials",ef:"2.0 kg CO2e/kg",ref:"ecoinvent 3.10",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Goods — Cement",ef:"0.92 kg CO2e/kg",ref:"IPCC AR6 / ecoinvent 3.10",entities:{efi:false,bloom:false,eiic:false,exeed:true,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Goods — Steel / Reinforcement Bars",ef:"1.46 kg CO2e/kg",ref:"ecoinvent 3.10",entities:{efi:false,bloom:false,eiic:false,exeed:true,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Goods — Packaging (plastic bags)",ef:"2.53 kg CO2e/kg",ref:"DEFRA 2024",entities:{efi:true,bloom:false,eiic:false,exeed:false,foodquest:true,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Goods — Food & Beverage Ingredients",ef:"2.0 kg CO2e/kg",ref:"DEFRA 2024 / ecoinvent",entities:{efi:false,bloom:true,eiic:false,exeed:false,foodquest:true,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Goods — Paper / Office Supplies",ef:"1.09 kg CO2e/kg",ref:"DEFRA 2024",entities:{efi:false,bloom:true,eiic:false,exeed:false,foodquest:false,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.2",source:"Capital Goods — IT Equipment (laptops, monitors, servers)",ef:"30 kg CO2e/kg",ref:"ecoinvent 3.10",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.4",source:"Upstream Transport — Road Freight Inbound (tonne-km)",ef:"0.098 kg CO2e/tonne-km",ref:"DEFRA 2024",entities:{efi:true,bloom:false,eiic:false,exeed:true,foodquest:true,petromal:true,rise:true,nathold:false}},
                {scope:"Scope 3",cat:"Cat.4",source:"Upstream Transport — Marine / Offshore Supply",ef:"0.016 kg CO2e/tonne-km",ref:"IMO / DEFRA 2024",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.5",source:"Waste — Landfill",ef:"467 kg CO2e/tonne",ref:"IPCC AR6 / UAE Waste Board",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.5",source:"Waste — Recycling",ef:"21 kg CO2e/tonne",ref:"IPCC AR6 / ecoinvent 3.10",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.5",source:"Waste — Wastewater Treatment (offsite)",ef:"700 kg CO2e/m3",ref:"IPCC AR6 / GHG Protocol 2023",entities:{efi:true,bloom:true,eiic:false,exeed:false,foodquest:false,petromal:true,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.5",source:"Waste — Medical Waste Incineration",ef:"1,100 kg CO2e/tonne",ref:"IPCC AR6",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:true,nathold:false}},
                {scope:"Scope 3",cat:"Cat.1",source:"Purchased Water",ef:"0.344 kg CO2e/m3",ref:"UAE Water Authority / ADWEC 2024",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.6",source:"Business Travel — Short-haul Flights (economy)",ef:"0.156 kg CO2e/km",ref:"ICAO / DEFRA 2024",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:false,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.6",source:"Business Travel — Long-haul Flights (economy)",ef:"0.195 kg CO2e/km",ref:"ICAO / DEFRA 2024",entities:{efi:false,bloom:false,eiic:true,exeed:true,foodquest:false,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.6",source:"Business Travel — Hotel Stays",ef:"31 kg CO2e/night",ref:"DEFRA 2024",entities:{efi:false,bloom:true,eiic:true,exeed:false,foodquest:false,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.7",source:"Employee Commuting — Personal Car (petrol)",ef:"0.192 kg CO2e/km",ref:"DEFRA 2024",entities:{efi:true,bloom:true,eiic:true,exeed:true,foodquest:true,petromal:true,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.7",source:"Employee Commuting — Metro / Rail",ef:"0.041 kg CO2e/km",ref:"DEFRA 2024",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:true,nathold:true}},
                {scope:"Scope 3",cat:"Cat.7",source:"Employee Commuting — Bus / Public Transport",ef:"0.089 kg CO2e/km",ref:"DEFRA 2024",entities:{efi:false,bloom:true,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.7",source:"Employee Commuting — Work From Home",ef:"0.135 kg CO2e/day/person",ref:"DEFRA 2024",entities:{efi:false,bloom:false,eiic:false,exeed:false,foodquest:false,petromal:false,rise:false,nathold:true}},
                {scope:"Scope 3",cat:"Cat.9",source:"Downstream Transport — Road Freight Outbound",ef:"0.098 kg CO2e/tonne-km",ref:"DEFRA 2024",entities:{efi:true,bloom:false,eiic:false,exeed:true,foodquest:false,petromal:false,rise:true,nathold:false}},
                {scope:"Scope 3",cat:"Cat.15",source:"Financed Emissions — Listed Equity (PCAF)",ef:"210 tCO2e/AED m",ref:"PCAF 2023",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.15",source:"Financed Emissions — Corporate Bonds (PCAF)",ef:"180 tCO2e/AED m",ref:"PCAF 2023",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.15",source:"Financed Emissions — Private Equity (PCAF)",ef:"240 tCO2e/AED m",ref:"PCAF 2023",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.15",source:"Financed Emissions — Real Estate Investments (PCAF)",ef:"0.025 kg CO2e/m2",ref:"PCAF 2023",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
                {scope:"Scope 3",cat:"Cat.15",source:"Financed Emissions — Project Finance RE (PCAF)",ef:"12 tCO2e/AED m",ref:"PCAF 2023",entities:{efi:false,bloom:false,eiic:true,exeed:false,foodquest:false,petromal:false,rise:false,nathold:false}},
              ];
              const entityCols=[
                {id:"efi",label:"EFI"},
                {id:"bloom",label:"Bloom"},
                {id:"eiic",label:"EIIC"},
                {id:"exeed",label:"Exeed"},
                {id:"foodquest",label:"FoodQ"},
                {id:"petromal",label:"Petro"},
                {id:"rise",label:"Rise"},
                {id:"nathold",label:"NH HQ"},
              ];
              const scopeColors={"Scope 1":C.s1,"Scope 2":C.s2,"Scope 3":C.s3};
              let lastScope="";
              return(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,minWidth:900}}>
                    <thead>
                      <tr style={{background:"#0a1726",borderBottom:`2px solid ${C.accent}`}}>
                        <th style={{padding:"10px 8px",textAlign:"left",color:C.muted,fontWeight:600,width:60}}>Scope</th>
                        <th style={{padding:"10px 8px",textAlign:"left",color:C.muted,fontWeight:600,width:50}}>Cat</th>
                        <th style={{padding:"10px 8px",textAlign:"left",color:C.muted,fontWeight:600}}>Emission Source</th>
                        <th style={{padding:"10px 8px",textAlign:"left",color:C.muted,fontWeight:600,width:140}}>EF</th>
                        {entityCols.map(e=><th key={e.id} style={{padding:"10px 6px",textAlign:"center",color:ENTITIES.find(x=>x.id===e.id)?.color||C.muted,fontWeight:700,width:52}}>{e.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {matrix.map((row,i)=>{
                        const showScope=row.scope!==lastScope;
                        lastScope=row.scope;
                        return(
                          <tr key={i} style={{borderBottom:`1px solid ${C.border}22`,background:i%2===0?"#09152200":"#0a172611"}}>
                            <td style={{padding:"7px 8px",color:scopeColors[row.scope]||C.muted,fontWeight:600,fontSize:9,letterSpacing:0.5}}>{showScope?row.scope:""}</td>
                            <td style={{padding:"7px 8px",color:C.muted,fontSize:9}}>{row.cat}</td>
                            <td style={{padding:"7px 8px",color:C.text}}>{row.source}</td>
                            <td style={{padding:"7px 8px",color:C.muted,fontSize:9,fontFamily:"monospace"}}>{row.ef}</td>
                            {entityCols.map(e=>(
                              <td key={e.id} style={{padding:"7px 6px",textAlign:"center"}}>
                                {row.entities[e.id]
                                  ?<span style={{color:C.s1,fontSize:13}}>✅</span>
                                  :<span style={{color:C.border,fontSize:10}}>N/A</span>
                                }
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            <Card style={{marginTop:16,padding:"10px 16px"}}>
              <div style={{fontSize:10,color:C.muted}}>
                <strong style={{color:C.accent}}>Legend:</strong> ✅ Applicable — emission source is present and reported for this entity. N/A — not applicable to this entity's operations.
                &nbsp;|&nbsp; Framework: {setup.framework} &nbsp;|&nbsp; Boundary: {setup.boundary} &nbsp;|&nbsp; Prepared by: Mohamed Gibril Mohamed Elimam
              </div>
            </Card>
          </div>
        )}

        {tab==="Governance"&&(
          <div>
            <SHead>Boundary, Consolidation & Base Year — Governance Document</SHead>

            <Card style={{marginBottom:16}}>
              <SHead color={C.s2}>Section 1 — Consolidation Approach</SHead>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,fontSize:11}}>
                <div>
                  <div style={{color:C.muted,fontSize:10,marginBottom:4,fontWeight:600,letterSpacing:1}}>APPROACH SELECTED</div>
                  <div style={{color:C.s1,fontWeight:700,fontSize:14,marginBottom:8}}>{setup.boundary}</div>
                  <div style={{color:C.muted,lineHeight:1.7}}>
                    GHG Protocol §3 — 100% of emissions from operations where National Holding exercises operational control.
                    National Holding exercises operational control over all included entities through management authority over policies, operating procedures, and HSE systems.
                    This is the most appropriate approach for UAE Federal Decree-Law No. (11) of 2024 compliance.
                  </div>
                </div>
                <div>
                  <div style={{color:C.muted,fontSize:10,marginBottom:4,fontWeight:600,letterSpacing:1}}>DOCUMENT OWNER</div>
                  <div style={{color:C.text,fontWeight:700,marginBottom:12}}>Mohamed Gibril Mohamed Elimam — Head of HSE & Group ESG / GHG Lead</div>
                  <div style={{color:C.muted,fontSize:10,marginBottom:4,fontWeight:600,letterSpacing:1}}>APPROVED BY</div>
                  <div style={{padding:"8px 12px",background:"#0a1726",borderRadius:6,border:`1px dashed ${C.warn}`,color:C.warn,fontSize:11}}>
                    ⚠️ Approving executive name and title required before external submission
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{marginBottom:16}}>
              <SHead color={C.s2}>Section 2 — Base Year & Recalculation Policy</SHead>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,fontSize:11}}>
                <div>
                  <div style={{marginBottom:12}}>
                    <div style={{color:C.muted,fontSize:10,marginBottom:4,fontWeight:600,letterSpacing:1}}>BASE YEAR</div>
                    <div style={{color:C.accent,fontWeight:700,fontSize:20,fontFamily:"monospace"}}>{setup.year}</div>
                    <div style={{color:C.muted,marginTop:4}}>First year of complete Group-wide data collection</div>
                  </div>
                  <div>
                    <div style={{color:C.muted,fontSize:10,marginBottom:4,fontWeight:600,letterSpacing:1}}>BASE YEAR RATIONALE</div>
                    <div style={{color:C.muted,lineHeight:1.7}}>{setup.year} is the first year for which complete Scope 1, 2, and 3 data has been collected across all National Holding entities under a unified methodology. Prior years had incomplete coverage. Per GHG Protocol §5.</div>
                  </div>
                </div>
                <div>
                  <div style={{color:C.muted,fontSize:10,marginBottom:8,fontWeight:600,letterSpacing:1}}>RECALCULATION TRIGGER CRITERIA</div>
                  {[
                    "Structural change — acquisition/divestiture changing Group emissions by >5%",
                    "Methodology change — materially different EF source or calculation method",
                    "Boundary change — reclassification of emission sources",
                    "Significant data error — correction affecting >5% of total reported emissions"
                  ].map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                      <span style={{color:C.s3,fontWeight:700,minWidth:16}}>{i+1}.</span>
                      <span style={{color:C.muted,lineHeight:1.5}}>{item}</span>
                    </div>
                  ))}
                  <div style={{marginTop:12,padding:"8px 12px",background:"#0a1726",borderRadius:6,borderLeft:`3px solid ${C.warn}`}}>
                    <span style={{color:C.muted,fontSize:10}}>Recalculation Threshold: </span>
                    <span style={{color:C.warn,fontWeight:700}}>&gt;5% of total Group-wide emissions (t CO2e)</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{marginBottom:16}}>
              <SHead color={C.s2}>Section 3 — Entity Inclusion / Exclusion Register</SHead>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:"#0a1726",borderBottom:`1px solid ${C.border}`}}>
                      <th style={{padding:"10px 12px",textAlign:"left",color:C.muted,fontWeight:600}}>Entity</th>
                      <th style={{padding:"10px 12px",textAlign:"center",color:C.muted,fontWeight:600}}>Status</th>
                      <th style={{padding:"10px 12px",textAlign:"left",color:C.muted,fontWeight:600}}>Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {entity:"Emirates Food Industries (EFI) — Al Rawdah, NDF, MDF, NBF, National Diary Factory, NFFPM",status:"INCLUDED",rationale:"Core manufacturing and agri-food operations; full operational control"},
                      {entity:"Bloom Holding — Property Mgmt, Education, Hospitality, Landscape",status:"INCLUDED",rationale:"Operational control over all Bloom divisions confirmed"},
                      {entity:"EIIC — Emirates International Investment Co.",status:"INCLUDED",rationale:"Corporate investment entity; office operations + PCAF financed emissions"},
                      {entity:"Exeed Industries — Filament, Geotextile, Litecrete, Precast, Mortar",status:"INCLUDED",rationale:"Manufacturing operations under full operational control"},
                      {entity:"FoodQuest",status:"INCLUDED",rationale:"F&B operations under NH operational control"},
                      {entity:"Petromal (Upstream & Downstream Oil & Gas)",status:"INCLUDED",rationale:"Energy sector operations; high-materiality Scope 1 sources"},
                      {entity:"Rise (General Trading, Technologies, Healthcare)",status:"INCLUDED",rationale:"Operational control confirmed"},
                      {entity:"National Holding Corporate HQ",status:"INCLUDED",rationale:"Corporate offices; direct overhead emissions"},
                      {entity:"Paul — Spain",status:"EXCLUDED",rationale:"International franchise; NH does not exercise operational control over Spanish operations"},
                      {entity:"Mansco (non-IFRS)",status:"EXCLUDED",rationale:"Non-IFRS entity; operational control not confirmed for GHG accounting purposes"},
                      {entity:"Scope Properties / Private Equity passive holdings",status:"EXCLUDED",rationale:"Passive financial investments; no operational control. PCAF assessment via EIIC Cat.15"},
                    ].map((row,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.border}22`}}>
                        <td style={{padding:"10px 12px",color:C.text}}>{row.entity}</td>
                        <td style={{padding:"10px 12px",textAlign:"center"}}>
                          <span style={{
                            display:"inline-block",padding:"3px 10px",borderRadius:4,fontSize:10,fontWeight:700,
                            background:row.status==="INCLUDED"?C.s1+"22":C.warn+"22",
                            color:row.status==="INCLUDED"?C.s1:C.warn,
                            border:`1px solid ${row.status==="INCLUDED"?C.s1:C.warn}44`
                          }}>{row.status}</span>
                        </td>
                        <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{row.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,fontSize:11,color:C.muted}}>
                <div>
                  <div style={{fontWeight:600,color:C.accent,marginBottom:6,letterSpacing:1}}>DOCUMENT INFORMATION</div>
                  <div>Framework: {setup.framework}</div>
                  <div>Consolidation: {setup.boundary}</div>
                  <div>Reporting Year: {setup.year}</div>
                  <div>Base Year: {setup.baseYear}</div>
                  <div>Verification: {setup.verificationStatus}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:600,color:C.accent,marginBottom:6,letterSpacing:1}}>PREPARED BY</div>
                  <div style={{color:C.text,fontWeight:700}}>Mohamed Gibril Mohamed Elimam</div>
                  <div>Head of HSE & Group ESG / GHG Lead</div>
                  <div style={{marginTop:8,fontSize:10}}>Generated: {new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"})}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
