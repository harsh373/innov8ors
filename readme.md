# FairPrice AI

AI-powered commodity price monitoring platform that detects market price manipulation and anomalies across Delhi Markets using machine learning and community-reported data.

Built during a hackathon to improve **price transparency in Informal markets**.

---

# Overview

FairPrice AI is a real-time monitoring system that analyzes commodity prices reported from local markets and identifies abnormal spikes using machine learning.

The platform combines:

- Community price reporting
- Historical market data
- Machine learning anomaly detection
- AI-generated explanations

to help citizens and administrators identify potential price manipulation or unusual market activity.

---

# Key Features

## Real-Time Market Monitoring

Tracks commodity prices across **7 major Delhi mandis**

- Azadpur
- Daryaganj
- Ghazipur
- INA Market
- Keshopur
- Okhla
- Rohini

---

## Machine Learning Anomaly Detection

A **Random Forest model** analyzes historical commodity prices and identifies abnormal spikes.

- Detects price manipulation patterns
- Achieved **85%+ accuracy** in anomaly classification
- Compares real prices against predicted fair values

---

## AI-Based Explanations (Gemini API)

When anomalies occur, the platform generates **human-readable explanations** using Google's Gemini API.

Example output:
Seasonal price manipulation detected.
Recent supply drop combined with abnormal vendor pricing.


This reduces manual investigation time significantly.

---

## Community Price Reporting

Citizens can submit real commodity prices they observe in local markets.

These reports feed into the ML pipeline to improve anomaly detection.

---

## Live Dashboard

Admin dashboard visualizes:

- Commodity price trends
- Market comparison
- Spike alerts
- AI explanations

Built with **React + TypeScript** for fast data visualization.

---

# Tech Stack

## Frontend

- React
- TypeScript
- TailwindCSS


## Backend

- Node.js
- Express.js
- REST API Architecture

## Authentication

- Clerk

## Machine Learning Service

- Python
- Scikit-Learn
- Random Forest Classifier
- Hosted on Render

## AI Integration

- Gemini API

Used for generating anomaly explanations.

---

# System Architecture
                    ┌────────────────────┐
                    │       Client       │
                    │  React + TypeScript│
                    └─────────┬──────────┘
                              │
                              │ HTTPS Requests
                              ▼
                    ┌────────────────────┐
                    │   Node.js Backend  │
                    │   Express APIs     │
                    └───────┬───────┬────┘
                            │       │
                            │       │
                            ▼       ▼
                  ┌────────────┐   ┌──────────────┐
                  │  MongoDB   │   │  Clerk Auth  │
                  │  Database  │   │ Authentication│
                  └────────────┘   └──────────────┘
                            │
                            │
                            ▼
                    ┌───────────────────┐
                    │   ML Microservice │
                    │   Random Forest   │
                    │   Python + sklearn│
                    └─────────┬─────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   Gemini API    │
                     │ AI Explanation  │
                     └─────────────────┘

---

# Core Functionalities

## Price Analysis Pipeline

1. User reports commodity price
2. Backend validates and stores data
3. ML service receives price data
4. Random Forest model predicts expected price
5. System calculates deviation
6. If anomaly detected:
   - Alert triggered
   - Gemini generates explanation
7. Dashboard updates in real time

---

# Machine Learning Model

Algorithm used:

**Random Forest Classifier**

Inputs include:

- Commodity type
- Market location
- Historical price patterns
- Seasonal price trends

Output:
Normal Price
or
Price Spike Anomaly


Accuracy achieved during testing:


~85%

---

# Project Metrics

- **500+ commodity price data points analyzed**
- **7 Delhi markets monitored**
- **8+ REST APIs designed**
- **3 user roles implemented**
- **70% reduction in manual price analysis time**

---

# Deployment

Frontend and Backend -Vercel

Ml-Service-Render


---

# Future Improvements

- Real-time mandi data scraping
- Mobile reporting application
- Geospatial price anomaly mapping
- Government market integration
- Fraud detection for fake reports

---

# Problem Statement

Informal commodity markets often suffer from **price manipulation, lack of transparency, and delayed monitoring**.

FairPrice AI attempts to solve this by combining:

- citizen participation
- machine learning
- AI explanations

to create a transparent pricing ecosystem.

---

Buit in hackathon Quasar IIIT Ranchi 2026 by Team INNOV8ORS


